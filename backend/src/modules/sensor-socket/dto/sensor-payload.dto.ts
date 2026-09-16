import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SensorPayloadDto {
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  timestamp?: string;
}
