import { UserEntity } from "src/users/model/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity( 'group' )
export class GroupEntity
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( { type: 'varchar', length: 300, nullable: false } )
    name: string;

    @ManyToMany( () => UserEntity, user => user.groups )
    users: UserEntity[];
}