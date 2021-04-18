import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './schemas/user.schema';

import { UsersOrmService } from './users.orm.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController
{
    constructor( private readonly _service : UsersOrmService ) //private readonly _service : UsersService
    {

    }

    @Get()
    users() : Promise<User[]>
    {
        return this._service.users();
    }

    @Get( ':id' )
    user( @Param( 'id' ) id : string ) : Promise<User>
    {
        return this._service.user( id );
    }

    @Post()
    @UsePipes( new ValidationPipe( { transform: true, whitelist: true } ) )
    create( @Body() data : CreateUserDto ) : Promise<User>
    {
        return this._service.create( data );
    }

    @Delete( ':id' )
    remove( @Param( 'id' ) id : string ) : Promise<User>
    {
        return this._service.remove( id );
    }

    @Put( ':id' )
    update( @Param( 'id' ) id : string, @Body() data : UpdateUserDto ) : Promise<User>
    {
        return this._service.update( id, data );
    }
}
