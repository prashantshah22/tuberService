import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { VideoStatusEnum } from "./video.enum";
import { Transform } from "class-transformer";

export class CreateVideoDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @Transform((input) => Number(input.value))
    @IsNumber()
    @Min(0)
    duration: number;

    @IsNotEmpty()
    @Transform((input) => Number(input.value))
    @IsNumber()
    @Min(0)
    size: number;

    @IsOptional()
    @IsEnum(VideoStatusEnum)
    status?: VideoStatusEnum
}

export class UpdateVideoDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Transform((input) => Number(input.value))
    @IsNumber()
    @Min(0)
    duration?: number;

    @IsOptional()
    @Transform((input) => Number(input.value))
    @IsNumber()
    @Min(0)
    size?: number;

    @IsOptional()
    @IsEnum(VideoStatusEnum)
    status?: VideoStatusEnum

    @IsOptional()
    thumbnail?: string
}

export class CreateViewsDto {
    @IsNotEmpty()
    @IsMongoId()
    videoId: string
}