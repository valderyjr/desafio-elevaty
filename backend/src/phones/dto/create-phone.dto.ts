import { IsString, IsUUID, Length } from 'class-validator';

export class CreatePhoneDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  @Length(1, 10)
  countryCode: string;

  @IsString()
  @Length(1, 20)
  number: string;
}
