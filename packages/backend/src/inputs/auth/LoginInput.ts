import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
    @IsNotEmpty()
    @IsString()
    public username!: string;

    @IsNotEmpty()
    @IsString()
    public password!: string;
}
