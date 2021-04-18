import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';

@ObjectType()
export class InfoGroupDto
{
    @Field( () => ID )
    id: string;

    @Field()
    readonly name: string;

    @Field( () => [ID], { nullable: true } )
    readonly users: User[];
}