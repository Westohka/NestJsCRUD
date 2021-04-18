import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose"

import { User } from "src/users/schemas/user.schema";

export type GroupDocument = Group & mongoose.Document;

@Schema()
export class Group
{
    @Prop( { required: true } )
    name: string;

    @Prop( { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] } )
    users: User[];
}

export const GroupSchema = SchemaFactory.createForClass( Group );