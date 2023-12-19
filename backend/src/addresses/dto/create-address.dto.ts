import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { STATES_ENUM } from 'src/enums/states-enum';

export class CreateAddressDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  @Length(2, 2)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(STATES_ENUM)
  state: string;

  @IsString()
  @Length(9, 9)
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
  @Length(0, 255)
  complement?: string | null;
}
