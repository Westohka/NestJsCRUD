import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';

import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GroupsModule } from './groups/groups.module';
import { GroupEntity } from './groups/model/group.entity';

import { UserEntity } from './users/model/user.entity';
import { UsersModule } from './users/users.module';

@Module( {
    imports: [
        MongooseModule.forRoot( `mongodb+srv://westohka:westohka123@cluster0.mw5ft.mongodb.net/Groups?retryWrites=true&w=majority`, { useFindAndModify: false } ),
        TypeOrmModule.forRoot( {
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'database',
            synchronize: true,
            logging: true,
            entities: [UserEntity, GroupEntity]
        } ),
        GraphQLModule.forRoot( { autoSchemaFile: 'schema.gql' } ),
        UsersModule,
        GroupsModule
    ],
    controllers: [AppController],
    providers: [AppService],
} )

export class AppModule {}
