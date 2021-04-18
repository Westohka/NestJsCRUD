import { GroupEntity } from "src/groups/model/group.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity( 'user' )
export class UserEntity
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( { type: 'varchar', length: 300, nullable: false } )
    name: string;

    @ManyToMany( () => UserEntity, friend => friend.id, { cascade: true } )
    @JoinTable()
    friends: UserEntity[];

    @ManyToMany( () => GroupEntity, group => group.users, { cascade: true } )
    @JoinTable()
    groups: GroupEntity[];
}