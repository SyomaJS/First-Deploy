import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type: 'verify' | 'start' | 'stop' | 'contact';
  };
}
