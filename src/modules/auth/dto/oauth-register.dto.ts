import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oauthProvider: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oauthProviderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
