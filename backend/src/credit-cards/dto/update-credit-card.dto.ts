import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCreditCardDto } from './create-credit-card.dto';

export class UpdateCreditCardDto extends PartialType(
  OmitType(CreateCreditCardDto, ['userId'] as const),
) {}
