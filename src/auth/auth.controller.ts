import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from 'src/users/dtos/create-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { User } from 'src/users/dtos/user.dto';
import { LocalAuthGuard } from './guards/local-guard/local-guard.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt/refresh-jwt.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(User))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async login (@Request() req: any) {
    console.log("Sign in Controller");
    return this.authService.signIn(req.user.id);
  }

  
  @Public()
  @Post("signup")
  signup (@Body() user: CreateUser) {
    console.log("Sign up Controller");
    return this.authService.signup(user)
  }

  
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  @Get("access-token")
  accessToken (@Request() req: any) {
    console.log("Getting new access token Controller");
    return this.authService.accessToken(req.user.id)
  }
}
