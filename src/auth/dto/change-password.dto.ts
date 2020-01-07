import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsPassword } from '../validators/password.validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsPassword()
  @MaxLength(255)
  @IsNotEmpty()
  newPassword: string;
}
