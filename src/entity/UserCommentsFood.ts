import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { CommentHasComment } from "./CommentHasComment"


@Entity()
export class UserCommentsFood {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    foodLocalId: string

    @Column()
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    content: string

    @Column({default: false})
    isHidden: boolean

    @Column({default: 0})
    flags: 0

    @ManyToOne(()=>User, user => user.userCommentsFood, {onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User

    @OneToOne(()=>CommentHasComment, commentHasComment => commentHasComment.childComment, {onDelete: "CASCADE"})
    commentHasParent: CommentHasComment

    @OneToMany(()=>CommentHasComment, commentHasComment => commentHasComment.parentComment, {onDelete: "CASCADE"})
    commentHasChild: CommentHasComment[]
}