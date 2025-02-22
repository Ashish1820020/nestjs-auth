import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { env } from 'node:process';

export default registerAs('jwt', () => ({
  secret: String(env.JWT_SECRET_KEY),
  signOptions: {
    expiresIn: String(env.JWT_EXPIRE_IN),
  },
}));
