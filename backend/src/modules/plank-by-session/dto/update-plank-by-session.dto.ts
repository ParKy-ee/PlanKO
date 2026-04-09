import { PartialType } from '@nestjs/mapped-types';
import { CreatePlankBySessionDto } from './create-plank-by-session.dto';

export class UpdatePlankBySessionDto extends PartialType(CreatePlankBySessionDto) {}
