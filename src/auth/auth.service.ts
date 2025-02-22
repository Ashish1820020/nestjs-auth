import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { CreateUser } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth.jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from './config/refresh-jwt.config';
import * as argon2 from "argon2"

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtService: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async signup(userData: CreateUser): Promise<User> {
    const { email, password } = userData;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User email already exists');
    }

    const user = this.userService.createService({ email, password });
    return user;
  }

  async validateLogin(userData: CreateUser): Promise<User> {
    const { email, password } = userData;
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException('User does not exists');
    }
    const isPasswordMatched = await compare(password, existingUser.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return existingUser;
  }
  async generateAccessAndRefreshToken(userId: number) {
    const payload: AuthJwtPayload = { sub: { id: userId } };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshJwtService),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  
  async signIn(userId: number) {
    const {accessToken, refreshToken} = await this.generateAccessAndRefreshToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken (userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if(!user || !user.hashedRefreshToken) throw new UnauthorizedException("Invalid refresh token");

    const isValid = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!isValid) throw new UnauthorizedException("Tnvalid refresh token"); 

    return {id: userId};
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id };
    return currentUser;
  }

  async accessToken(userId: number) {
    const payload: AuthJwtPayload = { sub: { id: userId } };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
