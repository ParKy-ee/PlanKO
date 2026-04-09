import { IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Status } from 'src/commons/enums/status.enum';

export class CreateQuestByUesrDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  quest_id: number;

  @IsNumber()
  current_value: number;

  @IsNumber()
  target_value: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsDateString()
  @IsOptional()
  completed_at?: Date;
}
