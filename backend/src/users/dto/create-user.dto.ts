import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  firstName: string;

  @IsString()
  @Length(1, 255)
  lastName: string;

  @Length(1, 255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;
}
