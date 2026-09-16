import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestCategoryDto } from './create-quest-category.dto';

export class UpdateQuestCategoryDto extends PartialType(CreateQuestCategoryDto) {}
