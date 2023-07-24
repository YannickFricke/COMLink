import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterInput {
    @IsNotEmpty()
    @IsString()
    public username!: string;

    @IsNotEmpty()
    @IsString()
    public password!: string;
}
