import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommentDto {
    @IsNotEmpty()
    @IsMongoId()
    videoId: string

    @IsNotEmpty()
    @IsString()
    comment: string
}

export class UpdateCommentDto {
    @IsOptional()
    @IsString()
    comment?: string
}