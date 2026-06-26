import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async syncUser(dto: SyncUserDto): Promise<User> {
    let user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      user = this.usersRepo.create(dto);
      await this.usersRepo.save(user);
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }
}