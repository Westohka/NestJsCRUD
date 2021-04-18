import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

import { UserEntity } from "src/users/model/user.entity";
import { GroupEntity } from "./model/group.entity";

@Injectable()
export class GroupsOrmService
{
    constructor( @InjectRepository( GroupEntity ) private _groupsRepo : Repository<GroupEntity>,
                 @InjectRepository( UserEntity ) private _usersRepo : Repository<UserEntity> )
    {

    }

    async groups() : Promise<GroupEntity[]>
    {
        return this._groupsRepo.find( { loadRelationIds: true } );
    }

    async group( id : string ) : Promise<GroupEntity>
    {
        return this._groupsRepo.findOne( id, { loadRelationIds: true } );
    }

    async create( data : CreateGroupDto ) : Promise<GroupEntity>
    {
        return this._groupsRepo.save( data );
    }

    async remove( id : string ) : Promise<GroupEntity>
    {
        await this._groupsRepo.delete( id );
        return null;
    }

    async update( id : string, data : UpdateGroupDto ) : Promise<GroupEntity>
    {
        const group = this._groupsRepo.create( { ...data, id } );
        
        group.users = [];

        if( data.users )
        {
            for( const uData of data.users )
            {
                const user = await this._usersRepo.findOne( uData );
                group.users.push( user );
            }   
        }

        await this._groupsRepo.save( group );
        return this._groupsRepo.findOne( id, { loadRelationIds: true } );
    }
}