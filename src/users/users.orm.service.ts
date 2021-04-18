import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { GroupEntity } from "src/groups/model/group.entity";
import { UserEntity } from "./model/user.entity";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersOrmService
{
    constructor( @InjectRepository( UserEntity ) private _userRepo : Repository<UserEntity>, @InjectRepository( GroupEntity ) private _groupsRepo : Repository<GroupEntity> )
    {
    }

    async users() : Promise<UserEntity[]>
    {
        const data = await this._userRepo.find( { loadRelationIds: true } );
        const map = [];
        
        for( const user of data )
        {
            map[user.id] = user;
        }

        for( const user of data )
        {
            for( const friend of user.friends )
            {
                map[friend as unknown as string].friends.push( user.id );
            }
        }

        return data;
    }

    async user( id : string ) : Promise<UserEntity>
    {
        const data = await this._userRepo.findOne( id, { loadRelationIds: true } );
        
        const friends = await this._userRepo.query( 
            `SELECT * FROM public."user" U 
            WHERE U.id <> $1 AND EXISTS( 
                SELECT 1 FROM public.user_friends_user F
                WHERE (F."userId_1" = $1 AND F."userId_2" = U.id )
                    OR (F."userId_2" = $1 AND F."userId_1" = U.id ) );`, [id], );

        data.friends = [];

        for( const friend of friends )
        {
            data.friends.push( friend.id );
        }

        return data;
    }

    async create( data : CreateUserDto ) : Promise<UserEntity>
    {
        return this._userRepo.save( data );
    }

    async remove( id : string ) : Promise<UserEntity>
    {
        await this._userRepo.delete( id );
        return null;
    }

    async update( id : string, data : UpdateUserDto ) : Promise<UserEntity>
    {
        const user = this._userRepo.create( { ...data, id } );
        
        user.friends = [];
        user.groups = [];

        if( data.friends )
        {
            for( const fData of data.friends )
            {
                const friend = await this._userRepo.findOne( fData );
                user.friends.push( friend );
            }   
        }

        if( data.groups )
        {
            for( const gData of data.groups )
            {
                const group = await this._groupsRepo.findOne( gData );
                user.groups.push( group );
            }   
        }

        await this._userRepo.save( user );
        return await this._userRepo.findOne( id, { loadRelationIds: true } );;
    }
}