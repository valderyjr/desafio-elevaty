import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly usersService: UsersService,
  ) {}

  private async findOne(id: string): Promise<Address> {
    const address = await this.prismaClientService.address.findUnique({
      where: {
        id,
      },
    });

    if (!address) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.ADDRESS_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return address;
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const hasAddress = await this.findOneByUserId(createAddressDto.userId);

    if (hasAddress) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.USER_ALREADY_HAS_ADDRESS,
        HttpStatus.CONFLICT,
      );
    }

    return await this.prismaClientService.address.create({
      data: createAddressDto,
    });
  }

  async findAll(): Promise<Address[]> {
    return await this.prismaClientService.address.findMany();
  }

  async findOneByUserId(userId: string): Promise<Address | null> {
    await this.usersService.findOne(userId);

    return await this.prismaClientService.address.findUnique({
      where: { userId },
    });
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    await this.findOne(id);

    return await this.prismaClientService.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prismaClientService.address.delete({ where: { id } });
  }
}
