import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class UserRatesExpert {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    expertId: string

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

    @ManyToOne(()=>User, user => user.userRatesExpert, {onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User

}
