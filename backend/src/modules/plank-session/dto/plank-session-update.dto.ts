import { PartialType } from '@nestjs/mapped-types';
import { PlankSessionDto } from './plank-session.dto';

export class PlankSessionUpdateDto extends PartialType(PlankSessionDto) {}
