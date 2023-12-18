import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  take: number;
}
