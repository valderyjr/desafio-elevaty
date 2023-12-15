import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { User } from './entities/user.entity';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';

@Injectable()
export class UsersService {
  constructor(private readonly prismaClientService: PrismaClientService) {}

  private async findUserByEmail(email: string): Promise<User | null> {
    return await this.prismaClientService.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hasUserWithEmail = await this.findUserByEmail(createUserDto.email);

    if (hasUserWithEmail) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaClientService.user.create({
      data: {
        ...createUserDto,
        birthDate: new Date(createUserDto.birthDate),
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaClientService.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaClientService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    return await this.prismaClientService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        birthDate: updateUserDto.birthDate
          ? new Date(updateUserDto.birthDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prismaClientService.user.delete({
      where: {
        id,
      },
    });
  }
}
