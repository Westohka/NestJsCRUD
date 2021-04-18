import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import { Group } from './schemas/group.schema';

import { GroupsOrmService } from './groups.orm.service';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController
{
    constructor( private readonly _service : GroupsOrmService ) //private readonly _service : GroupsService,
    {

    }

    @Get()
    groups() : Promise<Group[]>
    {
        return this._service.groups();
    }

    @Get( ':id' )
    group( @Param( 'id' ) id : string ) : Promise<Group>
    {
        return this._service.group( id );
    }

    @Post()
    @UsePipes( new ValidationPipe( { transform: true, whitelist: true } ) )
    create( @Body() data : CreateGroupDto ) : Promise<Group>
    {
        return this._service.create( data );
    }

    @Delete( ':id' )
    remove( @Param( 'id' ) id : string ) : Promise<Group>
    {
        return this._service.remove( id );
    }

    @Put( ':id' )
    update( @Param( 'id' ) id : string, @Body() data : UpdateGroupDto ) : Promise<Group>
    {
        return this._service.update( id, data );
    }
}
