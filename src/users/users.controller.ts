
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dtos/create-user.dto';
import { User } from './user.entity';
import { User as UserDto} from './dtos/user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard/jwt-guard.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';
import { RoleGuard } from 'src/auth/guards/role-guard/role-guard.guard';

@UseInterceptors(new SerializeInterceptor(UserDto))
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Roles(Role.USER)
  @Get(':id')
  getUser(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
  
  @Post()
  createNewData(@Body() userData: CreateUser): Promise<User> {
    return this.usersService.createService(userData);
  }
  
  @Put(':id')
  putData(@Param('id', ParseIntPipe) id: number, @Body() userData: Partial<User>): Promise<User> {
    console.log('id');
    return this.usersService.putService(id, userData);
  }

  @Delete(':id')
  deleteData(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteService(id);
  }
}
