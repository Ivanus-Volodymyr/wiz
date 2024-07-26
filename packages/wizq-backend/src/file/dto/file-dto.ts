import { IsString } from 'class-validator';

export class FileDto {
  @IsString()
  public fieldname!: string;
  @IsString()
  public originalname!: string;
  @IsString()
  public encoding!: string;
  @IsString()
  public mimetype!: string;
  @IsString()
  public buffer!: Buffer;
  @IsString()
  public size!: number;
}
