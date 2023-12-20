import {
  IsCreditCard,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { MAX_DIGITS_YEAR, MIN_DIGITS_YEAR } from 'src/shared/constants';
import { ERROR_MESSAGES_ENUM } from 'src/shared/errors-messages/errors';

export class CreateCreditCardDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  @Length(1, 255)
  brand: string;

  @IsNumber()
  @Min(0)
  @Max(11)
  expirationMonth: number;

  @IsNumber()
  // Verify if number has 4 digits
  @Min(MIN_DIGITS_YEAR)
  @Max(MAX_DIGITS_YEAR)
  expirationYear: number;

  @IsString()
  @IsCreditCard({ message: ERROR_MESSAGES_ENUM.INVALID_CREDIT_CARD_NUMBER })
  number: string;

  @IsString()
  @IsOptional()
  invoiceUrl?: string;
}
