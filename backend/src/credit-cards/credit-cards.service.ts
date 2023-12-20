import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { PrismaClientService } from 'src/shared/prisma/prisma-client.service';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';
import { CreditCard } from './entities/credit-card.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { getInvoiceFileName, pathToInvoicesFolder } from 'src/shared/constants';

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

  private savePdfToFile(
    pdf: PDFKit.PDFDocument,
    fileName: string,
    creditCard: CreditCard,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // To determine when the PDF has finished being written successfully
      // we need to confirm the following 2 conditions:
      //
      //   1. The write stream has been closed
      //   2. PDFDocument.end() was called syncronously without an error being thrown

      let pendingStepCount = 2;

      const stepFinished = () => {
        if (--pendingStepCount == 0) {
          resolve();
        }
      };

      const writeStream = fs.createWriteStream(fileName);
      writeStream.on('close', stepFinished);
      writeStream.on('error', reject);

      pdf.pipe(writeStream);

      pdf.text(creditCard.number);
      pdf.text(creditCard.id);

      pdf.end();

      stepFinished();
    });
  }

  private async getPdfFile(filePath: string): Promise<fs.ReadStream> {
    return await new Promise<fs.ReadStream>((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      stream.on('data', resolve);
      stream.on('error', reject);
    });
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

  async getInvoiceById(id: string): Promise<StreamableFile> {
    const creditCard = await this.findOne(id);

    const dirPath = path.join(__dirname, pathToInvoicesFolder);
    const fileName = getInvoiceFileName(creditCard.id);
    const filePath = `${dirPath}${fileName}`;

    if (!creditCard.invoiceUrl) {
      const doc = new PDFDocument();

      await this.savePdfToFile(doc, filePath, creditCard);

      await this.prismaClientService.creditCard.update({
        where: { id },
        data: { invoiceUrl: fileName },
      });
    }

    const invoicePdf = await this.getPdfFile(filePath);

    return new StreamableFile(invoicePdf);
  }
}
