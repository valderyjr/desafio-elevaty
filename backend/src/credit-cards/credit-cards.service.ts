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
import {
  MAX_CREDIT_CARDS_BY_USER,
  getInvoiceFileName,
  pathToInvoicesFolder,
} from 'src/shared/constants';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly prismaClientService: PrismaClientService,
    private readonly usersService: UsersService,
  ) {}

  private isFutureExpiration(year: number, month: number): boolean {
    const today = new Date();
    const isInFutureYear = year > today.getFullYear();

    const isInSameYearAndFutureMonth =
      year === today.getFullYear() && month > today.getMonth();

    return isInFutureYear || isInSameYearAndFutureMonth;
  }

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
    user: User,
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

      pdf.text(`Fatura - ${user.firstName} ${user.lastName}`, {
        align: 'center',
      });

      pdf.text(`Email: ${user.email}`);

      pdf.text(`Número do cartão: ${creditCard.number}`);
      pdf.text(`Bandeira do cartão: ${creditCard.brand}`);
      pdf.text(
        `Vencimento do cartão: ${String(
          creditCard.expirationMonth + 1,
        ).padStart(2, '0')}/${creditCard.expirationYear}`,
      );

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
    const isValidExpiration = this.isFutureExpiration(
      createCreditCardDto.expirationYear,
      createCreditCardDto.expirationMonth,
    );

    if (!isValidExpiration) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.INVALID_CREDIT_CARD_EXPIRATION,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.usersService.findOne(createCreditCardDto.userId);

    const creditCardsByUser = await this.prismaClientService.creditCard.count({
      where: {
        userId: createCreditCardDto.userId,
      },
    });

    if (creditCardsByUser >= MAX_CREDIT_CARDS_BY_USER) {
      throw new HttpException(
        ERROR_MESSAGES_ENUM.MAX_LENGTH_CREDIT_CARDS_BY_USER,
        HttpStatus.BAD_REQUEST,
      );
    }

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
      orderBy: {
        createdAt: 'asc',
      },
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

    const user = await this.usersService.findOne(creditCard.userId);

    const dirPath = path.join(__dirname, pathToInvoicesFolder);
    const fileName = getInvoiceFileName(creditCard.id);
    const filePath = `${dirPath}${fileName}`;

    if (!creditCard.invoiceUrl) {
      const doc = new PDFDocument();

      await this.savePdfToFile(doc, filePath, creditCard, user);

      await this.prismaClientService.creditCard.update({
        where: { id },
        data: { invoiceUrl: fileName },
      });
    }

    const invoicePdf = await this.getPdfFile(filePath);

    return new StreamableFile(invoicePdf);
  }
}
