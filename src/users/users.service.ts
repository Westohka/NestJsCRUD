import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose"

import { User, UserDocument } from "./schemas/user.schema";
import { GroupDocument } from "src/groups/schemas/group.schema";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService
{
    constructor( @InjectModel( 'User' ) private _userModel : Model<UserDocument>, @InjectModel( 'Group' ) private _groupModel : Model<GroupDocument> )
    {
    }

    async users() : Promise<User[]>
    {
        return this._userModel.find().exec();
    }

    async user( id : string ) : Promise<User>
    {
        return this._userModel.findById( id ).exec();
    }

    async create( data : CreateUserDto ) : Promise<User>
    {
        const user = new this._userModel( data );
        return user.save();
    }

    async remove( id : string ) : Promise<User>
    {
        const session = await this._userModel.db.startSession();
        session.startTransaction();

        try
        {
            const user = await this._userModel.findByIdAndRemove( id ).session( session ).exec();

            for( const friend of user.friends )
            {
                await this._userModel.findByIdAndUpdate( friend, {
                    $pull: { friends: user._id }
                } ).session( session ).exec();
            }

            for( const group of user.groups )
            {
                await this._groupModel.findByIdAndUpdate( group, {
                    $pull: { users: user._id }
                } ).session( session ).exec();
            }

            await session.commitTransaction();
            return user;
        }
        catch( err )
        {
            await session.abortTransaction();
            console.error( 'transaction error', err );

            return null;
        }
        finally
        {
            session.endSession();
        }
    }

    async update( id : string, data : UpdateUserDto ) : Promise<User>
    {
        const session = await this._userModel.db.startSession();
        session.startTransaction();
        
        try
        {
            const oldData = await this._userModel.findById( id );
            const newData = await this._userModel.findByIdAndUpdate( id, data, {
                new: true
            } ).session( session ).exec();

            const friendsRemoved = oldData.friends.filter( x => !newData.friends.includes( x ) );
            const groupsRemoved = oldData.groups.filter( x => !newData.groups.includes( x ) );

            for( const friend of friendsRemoved )
            {
                await this._userModel.findByIdAndUpdate( friend, {
                    $pull: { friends: newData._id }
                } ).session( session ).exec();
            }

            for( const group of groupsRemoved )
            {
                await this._groupModel.findByIdAndUpdate( group, {
                    $pull: { users: newData._id }
                } ).session( session ).exec();
            }

            const friendsAdded = newData.friends.filter( x => !oldData.friends.includes( x ) );
            const groupsAdded = newData.groups.filter( x => !oldData.groups.includes( x ) )

            for( const friend of friendsAdded )
            {
                await this._userModel.findByIdAndUpdate( friend, {
                    $push: { friends: newData._id }
                } ).session( session ).exec();
            }

            for( const friend of groupsAdded )
            {
                await this._groupModel.findByIdAndUpdate( friend, {
                    $push: { users: newData._id }
                } ).session( session ).exec();
            }

            await session.commitTransaction();
            return newData;
        }
        catch( err )
        {
            await session.abortTransaction();
            console.error( 'transaction error', err );

            return null;
        }
        finally
        {
            session.endSession();
        }
    }
}