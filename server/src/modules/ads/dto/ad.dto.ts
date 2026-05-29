import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAdOrderDto {
  @IsString()
  positionId: string;

  @IsString()
  packageId: string;

  @IsString()
  title: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  linkType?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;
}

export class RejectAdDto {
  @IsString()
  rejectReason: string;
}
