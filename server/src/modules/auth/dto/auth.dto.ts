import { IsOptional, IsString } from 'class-validator';

export class WxLoginDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class WxPhoneDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class AdminLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
