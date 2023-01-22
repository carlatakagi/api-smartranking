import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
}
