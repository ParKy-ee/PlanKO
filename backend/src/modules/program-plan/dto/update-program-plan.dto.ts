import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramPlanDto } from './create-program-plan.dto';

export class UpdateProgramPlanDto extends PartialType(CreateProgramPlanDto) {}
