import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateUserDto
{
    @IsOptional()
    @Field()
    readonly name: string;
}