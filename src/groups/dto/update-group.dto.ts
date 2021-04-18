import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/schemas/user.schema';

@InputType()
export class UpdateGroupDto
{
    @IsOptional()
    @Field()
    readonly name: string;

    @IsOptional()
    @Field( () => [ID] )
    readonly users: User[];
}