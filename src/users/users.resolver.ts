import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CreateUserDto } from './dto/create-user.dto';
import { InfoUserDto } from './dto/info-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './schemas/user.schema';

import { UsersOrmService } from './users.orm.service';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver
{
    constructor( 
        // private readonly _service : UsersService
        private readonly _service : UsersOrmService 
        )
    {

    }

    @Query( () => [InfoUserDto] )
    users() : Promise<User[]>
    {
        return this._service.users();
    }

    @Query( () => InfoUserDto )
    user( @Args( 'id' ) id : string ) : Promise<User>
    {
        return this._service.user( id );
    }

    @Mutation( () => InfoUserDto )
    userCreate( @Args( 'input' ) data : CreateUserDto ) : Promise<User>
    {
        return this._service.create( data );
    }
    
    @Mutation( () => InfoUserDto, { nullable: true } )
    userRemove( @Args( 'id' ) id : string ) : Promise<User>
    {
        return this._service.remove( id );
    }

    @Mutation( () => InfoUserDto )
    userUpdate( @Args( 'id' ) id : string, @Args( 'input' ) data : UpdateUserDto ) : Promise<User>
    {
        return this._service.update( id, data );
    }
}
