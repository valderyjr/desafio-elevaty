import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateAddressDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  @Length(8, 8)
  zipCode: string;

  @IsString()
  @Length(1, 255)
  city: string;

  @IsString()
  @Length(1, 255)
  street: string;

  @IsString()
  @Length(1, 255)
  number: string;

  @IsString()
  @Length(1, 255)
  neighborhood: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  complement?: string | null;
}
