import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateJournalDto {
  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  toolUsed: string;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  mood: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  focus: number;

  @IsArray()
  @IsString({ each: true })
  bodyTags: string[];

  @IsArray()
  @IsString({ each: true })
  mindTags: string[];

  @IsString()
  @IsOptional()
  freeText: string;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isAnonymous: boolean;
}
