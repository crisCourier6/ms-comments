import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm"
import { UserCommentsFood } from "./UserCommentsFood"

@Entity()
export class CommentHasComment {

    @PrimaryColumn()
    parentId: string

    @PrimaryColumn()
    childId: string

    @ManyToOne(()=>UserCommentsFood, userCommentsFood => userCommentsFood.commentHasChild, {onDelete: "CASCADE"})
    @JoinColumn({name: "parentId"})
    parentComment: UserCommentsFood

    @ManyToOne(()=>UserCommentsFood, userCommentsFood => userCommentsFood.commentHasParent, {onDelete: "CASCADE"})
    @JoinColumn({name: "childId"})
    childComment: UserCommentsFood

}