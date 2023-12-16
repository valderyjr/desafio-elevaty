import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';
import { CreditCard } from './entities/credit-card.entity';

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly usersService: UsersService,
  ) {}

  private async findOne(id: string): Promise<CreditCard> {
    const creditCard = await this.prismaClientService.creditCard.findUnique({
      where: {
        id,
      },
    });

    if (!creditCard) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.CREDIT_CARD_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return creditCard;
  }

  async create(createCreditCardDto: CreateCreditCardDto): Promise<CreditCard> {
    await this.usersService.findOne(createCreditCardDto.userId);

    return await this.prismaClientService.creditCard.create({
      data: {
        brand: createCreditCardDto.brand,
        expirationMonth: createCreditCardDto.expirationMonth,
        expirationYear: createCreditCardDto.expirationYear,
        number: createCreditCardDto.number,
        userId: createCreditCardDto.userId,
      },
    });
  }

  async findAll(): Promise<CreditCard[]> {
    return await this.prismaClientService.creditCard.findMany();
  }

  async findAllByUserId(userId: string): Promise<CreditCard[]> {
    await this.usersService.findOne(userId);

    return await this.prismaClientService.creditCard.findMany({
      where: { userId },
    });
  }

  async update(
    id: string,
    updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    await this.findOne(id);

    return await this.prismaClientService.creditCard.update({
      where: { id },
      data: updateCreditCardDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prismaClientService.creditCard.delete({
      where: { id },
    });
  }
}
