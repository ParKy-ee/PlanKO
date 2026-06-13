import { PartialType } from '@nestjs/mapped-types';
import { CreatePostureCategoryDto } from './create-posture-category.dto';

export class UpdatePostureCategoryDto extends PartialType(CreatePostureCategoryDto) {}
