import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeDashboardDto } from './create-home-dashboard.dto';

export class UpdateHomeDashboardDto extends PartialType(CreateHomeDashboardDto) {}
