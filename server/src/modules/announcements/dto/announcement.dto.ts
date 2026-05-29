import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class SaveAnnouncementDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsBoolean()
  isTop?: boolean;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
