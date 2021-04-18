import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Group } from './schemas/group.schema';

import { CreateGroupDto } from './dto/create-group.dto';
import { InfoGroupDto } from './dto/info-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import { GroupsOrmService } from './groups.orm.service';
import { GroupsService } from './groups.service';

@Resolver()
export class GroupsResolver
{
    constructor( 
        private readonly _service : GroupsOrmService
        // private readonly _service : GroupsService
        )
    {

    }

    @Query( () => [InfoGroupDto] )
    groups() : Promise<Group[]>
    {
        return this._service.groups();
    }

    @Query( () => InfoGroupDto )
    group( @Args( 'id' ) id : string ) : Promise<Group>
    {
        return this._service.group( id );
    }

    @Mutation( () => InfoGroupDto )
    groupCreate( @Args( 'input' ) data : CreateGroupDto ) : Promise<Group>
    {
        return this._service.create( data );
    }
    
    @Mutation( () => InfoGroupDto, { nullable: true } )
    groupRemove( @Args( 'id' ) id : string ) : Promise<Group>
    {
        return this._service.remove( id );
    }

    @Mutation( () => InfoGroupDto )
    groupUpdate( @Args( 'id' ) id : string, @Args( 'input' ) data : UpdateGroupDto ) : Promise<Group>
    {
        return this._service.update( id, data );
    }
}
