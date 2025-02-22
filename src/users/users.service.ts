import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUser } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createService(userData: CreateUser): Promise<User> {
    const {email, password} = userData;
    const user = this.repo.create({email, password})
    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({where: {id}})
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({where: {email}})
  }

  async putService(id: number, userData: Partial<CreateUser>): Promise<User> {
    const user = await this.repo.findOne({where: {id}});

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); 
    } 
    Object.assign(user, userData);
    return this.repo.save(user);
  }

  async deleteService(id: number):Promise<User> {
    const user = await this.repo.findOne({where: {id}})

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); 
    } 
    return this.repo.remove(user);
  }

  async updateHashedRefreshToken(id: number, hashedRefreshToken: string) {
    return await this.repo.update({id}, {hashedRefreshToken});
  }
}
