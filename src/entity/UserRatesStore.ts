import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class UserRatesStore {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    storeId: string

    @Column()
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @Column()
    content: string

    @Column({default: false})
    isHidden: boolean

    @Column()
    isRecommended: boolean

    @ManyToOne(()=>User, user => user.userRatesStore, {onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User

}
