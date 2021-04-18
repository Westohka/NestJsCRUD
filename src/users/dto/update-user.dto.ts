import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { Group } from "src/groups/schemas/group.schema";
import { User } from "src/users/schemas/user.schema";

@InputType()
export class UpdateUserDto
{
    @IsOptional()
    @Field()
    readonly name: string;

    @IsOptional()
    @Field( () => [ID] )
    readonly friends: User[];

    @IsOptional()
    @Field( () => [ID] )
    readonly groups: Group[];
}