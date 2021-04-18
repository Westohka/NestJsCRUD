import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSchema } from 'src/users/schemas/user.schema';
import { GroupSchema } from './schemas/group.schema';

import { UserEntity } from 'src/users/model/user.entity';
import { GroupEntity } from './model/group.entity';

import { GroupsController } from './groups.controller';

import { GroupsResolver } from './groups.resolver';

import { GroupsService } from './groups.service';
import { GroupsOrmService } from './groups.orm.service';

@Module( {
    imports: [
        MongooseModule.forFeature( [{
            name: 'Group',
            schema: GroupSchema
        }, {
            name: 'User',
            schema: UserSchema
        }] ),
        TypeOrmModule.forFeature( [GroupEntity, UserEntity] )
    ],
    providers: [GroupsResolver, GroupsService, GroupsOrmService],
    controllers: [GroupsController]
} )

export class GroupsModule
{

}