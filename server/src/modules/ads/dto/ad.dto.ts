import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

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

export class SaveAdPositionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCount?: number;

  @IsOptional()
  @IsNumberString()
  pricePerDay?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;
}

export class SaveAdPackageDto {
  @IsOptional()
  @IsString()
  positionId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsNumberString()
  originalPrice?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number;
}

export class RejectAdDto {
  @IsString()
  rejectReason: string;
}
