import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVisibilityDto {
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
