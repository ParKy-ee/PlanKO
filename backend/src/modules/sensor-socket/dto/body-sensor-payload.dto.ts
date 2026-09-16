import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class BodySensorPayloadDto {
  @IsNumber()
  @IsOptional()
  r?: number | string;

  @IsNumber()
  @IsOptional()
  red?: number | string;

  @IsBoolean()
  @IsNotEmpty()
  fingerDetected: boolean;

  @IsNumber()
  @IsNotEmpty()
  bpm: number;

  @IsNumber()
  @IsNotEmpty()
  avgBpm: number;

  @IsNumber()
  @IsNotEmpty()
  spo2Approx: number;
}
