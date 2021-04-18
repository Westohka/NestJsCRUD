import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupEntity } from 'src/groups/model/group.entity';
import { UserEntity } from './model/user.entity';

import { GroupSchema } from 'src/groups/schemas/group.schema';
import { UserSchema } from './schemas/user.schema';

import { UsersController } from './users.controller';

import { UsersResolver } from './users.resolver';

import { UsersOrmService } from './users.orm.service';
import { UsersService } from './users.service';

@Module( {
    imports: [
        MongooseModule.forFeature( [{
            name: 'User',
            schema: UserSchema
        }, {
            name: "Group",
            schema: GroupSchema
        }] ),
        TypeOrmModule.forFeature( [GroupEntity, UserEntity] )
    ],
    providers: [UsersResolver, UsersService, UsersOrmService],
    controllers: [UsersController]
} )

export class UsersModule
{

}