import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePracticeRecordDto {
  @IsString()
  tool: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsString()
  @IsOptional()
  date?: string;
}
