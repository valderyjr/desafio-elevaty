import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone } from './entities/phone.entity';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';

@Injectable()
export class PhonesService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly usersService: UsersService,
  ) {}

  private async findOne(id: string): Promise<Phone> {
    const phone = await this.prismaClientService.phone.findUnique({
      where: {
        id,
      },
    });

    if (!phone) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.PHONE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return phone;
  }

  async create(createPhoneDto: CreatePhoneDto): Promise<Phone> {
    const hasPhone = await this.findOneByUserId(createPhoneDto.userId);

    if (hasPhone) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_ALREADY_HAS_PHONE,
        HttpStatus.CONFLICT,
      );
    }

    return await this.prismaClientService.phone.create({
      data: createPhoneDto,
    });
  }

  async findAll(): Promise<Phone[]> {
    return await this.prismaClientService.phone.findMany();
  }

  async findOneByUserId(userId: string): Promise<Phone | null> {
    await this.usersService.findOne(userId);

    return await this.prismaClientService.phone.findUnique({
      where: { userId },
    });
  }

  async update(id: string, updatePhoneDto: UpdatePhoneDto): Promise<Phone> {
    await this.findOne(id);

    return await this.prismaClientService.phone.update({
      where: {
        id,
      },
      data: updatePhoneDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prismaClientService.phone.delete({
      where: {
        id,
      },
    });
  }
}
