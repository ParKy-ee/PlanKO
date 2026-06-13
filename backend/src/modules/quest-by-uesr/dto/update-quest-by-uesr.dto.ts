import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestByUesrDto } from './create-quest-by-uesr.dto';

export class UpdateQuestByUesrDto extends PartialType(CreateQuestByUesrDto) {}
