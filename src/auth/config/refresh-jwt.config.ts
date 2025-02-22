import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { env } from 'node:process';

export default registerAs('refresh-jwt', () => ({
    secret: String(env.REFRESH_JWT_SECRET_KEY),
    expiresIn: String(env.REFRESH_JWT_EXPIRE_IN),
}));
