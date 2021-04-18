import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose"

import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

import { Group, GroupDocument } from "./schemas/group.schema";
import { UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class GroupsService
{
    constructor( @InjectModel( 'Group' ) private _groupModel : Model<GroupDocument>, @InjectModel( 'User' ) private _userModel : Model<UserDocument> )
    {

    }

    async groups() : Promise<Group[]>
    {
        return this._groupModel.find().exec();
    }

    async group( id : string ) : Promise<Group>
    {
        return this._groupModel.findById( id ).exec();
    }

    async create( data : CreateGroupDto ) : Promise<Group>
    {
        const group = new this._groupModel( data );
        return group.save();
    }

    async remove( id : string ) : Promise<Group>
    {
        const session = await this._groupModel.db.startSession();
        session.startTransaction();

        try
        {
            const group = await this._groupModel.findByIdAndRemove( id ).session( session ).exec();

            for( const user of group.users )
            {
                await this._userModel.findByIdAndUpdate( user, {
                    $pull: { groups: group._id }
                } ).session( session ).exec();
            }

            await session.commitTransaction();
            return group;
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

    async update( id : string, data : UpdateGroupDto ) : Promise<Group>
    {
        const session = await this._groupModel.db.startSession();
        session.startTransaction();
        
        try
        {
            const oldData = await this._groupModel.findById( id );
            const newData = await this._groupModel.findByIdAndUpdate( id, data, {
                new: true
            } ).session( session ).exec();

            const usersRemoved = oldData.users.filter( x => !newData.users.includes( x ) );

            for( const user of usersRemoved )
            {
                await this._userModel.findByIdAndUpdate( user, {
                    $pull: { groups: newData._id }
                } ).session( session ).exec();
            }

            const usersAdded = newData.users.filter( x => !oldData.users.includes( x ) )

            for( const user of usersAdded )
            {
                await this._userModel.findByIdAndUpdate( user, {
                    $push: { groups: newData._id }
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