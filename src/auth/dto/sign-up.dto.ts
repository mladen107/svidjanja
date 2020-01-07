import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsPassword } from '../validators/password.validator';
import { IsUserAlreadyExist } from '../../users/validators/unique-username.validator';

export class SignUpDto {
  @IsUserAlreadyExist()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @IsPassword()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;
}
