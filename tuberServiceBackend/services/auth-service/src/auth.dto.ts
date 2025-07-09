import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsOptional()
    @Transform(()=>{
        return undefined
    })
    refreshToken?: string;

    @IsOptional()
    @Transform(()=>{
        return undefined
    })
    expiredAt?: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}