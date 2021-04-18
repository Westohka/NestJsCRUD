import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateGroupDto
{
    @IsOptional()
    @Field()
    readonly name: string;
}