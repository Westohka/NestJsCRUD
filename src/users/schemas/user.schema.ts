import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose"
import { Group } from "src/groups/schemas/group.schema";

export type UserDocument = User & mongoose.Document;

@Schema()
export class User
{
    @Prop( { required: true } )
    name: string;

    @Prop( { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] } )
    friends: User[];

    @Prop( { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }] } )
    groups: Group[];
}

export const UserSchema = SchemaFactory.createForClass( User );