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

export class CreateCreditCardDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  @Length(1, 255)
  brand: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expirationMonth: number;

  @IsNumber()
  expirationYear: number;

  @IsString()
  @IsCreditCard()
  number: string;

  // @TODO: Preciso lidar com isso aqui ainda
  @IsString()
  @IsOptional()
  invoiceUrl?: string;
}
