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
} from '@nestjs/common';
import { PhonesService } from './phones.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone } from './entities/phone.entity';

@Controller('phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Post()
  async create(@Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
    return this.phonesService.create(createPhoneDto);
  }

  @Get()
  async findAll(): Promise<Phone[]> {
    return await this.phonesService.findAll();
  }

  @Get(':userId')
  async findOneByUserId(
    @Param('userId') userId: string,
  ): Promise<Phone | null> {
    return await this.phonesService.findOneByUserId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ): Promise<Phone> {
    return await this.phonesService.update(id, updatePhoneDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.phonesService.remove(id);
  }
}
