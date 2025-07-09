import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator'
import { LikeStatusEnum } from './like.enum'

export class CreateLikeDto {
    @IsNotEmpty()
    @IsMongoId()
    videoId: string

    @IsNotEmpty()
    @IsEnum(LikeStatusEnum)
    status: string
}

export class UpdateLikeDto {
    @IsOptional()
    @IsMongoId()
    videoId?: string

    @IsOptional()
    @IsEnum(LikeStatusEnum)
    status?: string
}