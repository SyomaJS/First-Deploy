import { BotService } from './../bot/bot.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model, Schema, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { dates, decode, encode } from '../helpers/crypto';
import * as otpGenerator from 'otp-generator';
import { v4 as uuidv4 } from 'uuid';
import { AddMinutesToDate } from '../helpers/addMinutes';
import { Otp } from '../otp/schemas/otp.schema';
import { Response } from 'express';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Bot } from '../bot/schemas/bot.schema';
import { LoginAdminDto } from './dto/login-admin.dto';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(Bot.name) private botModel: Model<Bot>,
    private readonly jwtService: JwtService,
    private readonly botService: BotService,
  ) {}

  async register(createAdminDto: CreateAdminDto) {
    const { phone_number } = createAdminDto;
    const isAdmin = await this.adminModel.findOne({
      phone_number: phone_number,
    });

    if (isAdmin) throw new BadRequestException('Number already exists');

    const isReallyAdmin = await this.botModel.findOne({ phone_number });
    if (!isReallyAdmin) {
      throw new BadRequestException(
        'Initialy you have to register from our bot',
      );
    }

    if (!isReallyAdmin.is_admin) {
      throw new UnauthorizedException("This number didn't register as admin");
    }

    const isSent = await this.newOTP(phone_number);
    if (!isSent) throw new BadRequestException('Bad request ..');

    const newAdmin = await this.adminModel.create(createAdminDto);
    if (isAdmin)
      throw new InternalServerErrorException('Internal Server Error');

    return { 'New Admin': newAdmin, Decoded: isSent };
  }

  async login(loginAdminDto: LoginAdminDto) {
    const phone_number = loginAdminDto.phone_number;
    const isAdmin = await this.adminModel.findOne({
      phone_number: phone_number,
    });

    if (!isAdmin) throw new UnauthorizedException('There is no such admin');

    if (!isAdmin.is_active)
      throw new UnauthorizedException('Admin is not active');

    const isSent = await this.newOTP(phone_number);

    if (!isSent) throw new BadRequestException('Bad request ..');

    return { 'New Admin': isAdmin, Decoded: isSent };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto, res: Response) {
    const { verification_key, otp, check } = verifyOtpDto;
    const obj = JSON.parse(await decode(verification_key));

    if (obj.check != check) {
      throw new BadRequestException(`OTP didn't send toward this number`);
    }
    const otpDB = await this.otpModel.findOne({ check: obj.check });
    if (otpDB) {
      if (!otpDB.verified) {
        if (dates.compare(otpDB.expiration_time, new Date())) {
          if (otpDB.otp === otp) {
            const user = await this.adminModel.findOne({ phone_number: check });
            if (user) {
              user.is_active = true;
              await user.save();

              otpDB.verified = true;
              await otpDB.save();

              const tokens = await this.getTokens(user);
              user.hashed_token = bcrypt.hashSync(tokens.refresh_token, 5);

              res.cookie('refresh_token', tokens.refresh_token, {
                maxAge: 15 * 21 * 60 * 60 * 1000,
                httpOnly: true,
              });

              const response = {
                message: 'Admin got started be active',
                admin: user,
                accessToken: tokens.access_token,
              };

              return response;
            } else {
              throw new BadRequestException('There is no such a user');
            }
          } else {
            throw new BadRequestException(`OTP is not matching `);
          }
        } else {
          throw new BadRequestException('Otp already expired');
        }
      } else {
        throw new BadRequestException('OTP already verified');
      }
    } else {
      throw new BadRequestException('Such an OTP is not available');
    }
  }

  async findAll() {
    const admins = await this.adminModel.find().exec();
    return admins;
  }

  async findOne(id: Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Not valid object ID');
    }
    const admin = await this.adminModel.findOne({ _id: id });
    if (!admin) {
      throw new NotFoundException('No admin found');
    }
    return admin;
  }

  async update(id: Schema.Types.ObjectId, updateAdminDto: UpdateAdminDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Not valid object ID');
    }
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      id,
      updateAdminDto,
      { new: true },
    );
    if (!updatedAdmin) {
      throw new NotFoundException('No admin found with id ');
    }

    return updatedAdmin;
  }

  async remove(id: Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Not valid object ID');
    }

    const res = await this.adminModel.findByIdAndRemove(id);
    if (!res) {
      throw new NotFoundException('No admin found with id ');
    }
    return res;
  }

  //* * * * * * * * * * * * * | AFTER CRUD | * * * * * * * * * * * * * * * *

  async getTokens(admin: AdminDocument) {
    const jwtPayload = {
      id: admin._id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async newOTP(phone_number: string) {
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const isSent = await this.botService.sendOTP(phone_number, otp);
    if (!isSent) {
      throw new HttpException(
        'Initialy you have to register from our bot < @fermerlarga_otp_sender_bot > ',
        HttpStatus.BAD_REQUEST,
      );
    }
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.findOneAndDelete({ check: phone_number });

    const newOtp = await this.otpModel.create({
      id: uuidv4(),
      otp: otp,
      expiration_time,
      check: phone_number,
    });

    const details = {
      timestamp: now,
      check: phone_number,
      success: true,
      message: 'OTP sent to user',
      otp_id: newOtp._id,
    };

    const encoded = await encode(JSON.stringify(details));
    return { status: 'OTP Sent to "ADMIN"', details: encoded };
  }
}
