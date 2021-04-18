import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Group } from 'src/groups/schemas/group.schema';
import { User } from 'src/users/schemas/user.schema';

@ObjectType()
export class InfoUserDto
{
    @Field( () => ID )
    id: string;

    @Field()
    readonly name: string;

    @Field( () => [ID], { nullable: true } )
    readonly groups: Group[];

    @Field( () => [ID], { nullable: true } )
    readonly friends: User[];
}