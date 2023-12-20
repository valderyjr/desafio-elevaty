import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  async create(
    @Body() createCreditCardDto: CreateCreditCardDto,
  ): Promise<CreditCard> {
    return await this.creditCardsService.create(createCreditCardDto);
  }

  @Get()
  async findAll() {
    return await this.creditCardsService.findAll();
  }

  @Get(':userId')
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<CreditCard[]> {
    return await this.creditCardsService.findAllByUserId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    return await this.creditCardsService.update(id, updateCreditCardDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.creditCardsService.remove(id);
  }

  @Get('/invoice/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment;')
  async getInvoiceById(@Param('id') id: string): Promise<StreamableFile> {
    return await this.creditCardsService.getInvoiceById(id);
  }
}
