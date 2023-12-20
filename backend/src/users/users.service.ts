import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { User } from './entities/user.entity';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';
import { PaginatedEntity } from 'src/shared/entites/paginated.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaClientService: PrismaClientService) {}

  private async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    return Boolean(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hasUserWithEmail = await this.findUserByEmail(createUserDto.email);

    if (hasUserWithEmail) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    return await this.prismaClientService.user.create({
      data: {
        ...createUserDto,
        birthDate: new Date(createUserDto.birthDate),
      },
      include: { creditCards: true, phone: true, address: true },
    });
  }

  async findAll(take: number, skip: number): Promise<PaginatedEntity<User>> {
    const [data, total] = await this.prismaClientService.$transaction([
      this.prismaClientService.user.findMany({
        skip,
        take,
        include: { creditCards: true, phone: true, address: true },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      }),
      this.prismaClientService.user.count(),
    ]);

    return {
      data,
      total,
      pages: Math.ceil(total / take),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prismaClientService.user.findUnique({
      where: { id },
      include: { creditCards: true, phone: true, address: true },
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

    const hasOtherUserWithEmail = updateUserDto.email
      ? await this.prismaClientService.user.findUnique({
          where: {
            email: updateUserDto.email,
            AND: {
              id: {
                not: id,
              },
            },
          },
        })
      : false;

    if (hasOtherUserWithEmail) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    return await this.prismaClientService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        birthDate: updateUserDto.birthDate
          ? new Date(updateUserDto.birthDate)
          : undefined,
      },
      include: { creditCards: true, phone: true, address: true },
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
