import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { UserCommentsFood } from "../entity/UserCommentsFood"
import { CommentHasComment } from "../entity/CommentHasComment"
import { IsNull, Not } from "typeorm"

export class UserCommentsFoodController {

    private userCommentsFoodRepository= AppDataSource.getRepository(UserCommentsFood)
    private userRepository = AppDataSource.getRepository(User)
    private commentHasCommentRepository = AppDataSource.getRepository(CommentHasComment)

    async all(req: Request, res: Response, next: NextFunction) {
        const { c, u, f } = req.query;
        const withUser = req.query.wu === "true";
        const withChildren = req.query.wc === "true";
        const withParent = req.query.wp === "true";
        const onlyParents = req.query.op === "true";
        const onlyCount = req.query.oc === "true"

        const queryBuilder = this.userCommentsFoodRepository.createQueryBuilder('comment');

        // Add basic relations based on flags
        if (withUser) {
            queryBuilder.leftJoinAndSelect('comment.user', 'user');
        }
        if (withChildren) {
            queryBuilder.leftJoinAndSelect('comment.commentHasChild', 'commentHasChild')
                        .leftJoinAndSelect('commentHasChild.childComment', 'childComment');
            if(withUser){
                queryBuilder.leftJoinAndSelect('childComment.user', 'childUser')
            }
        }
        if (withParent) {
            queryBuilder.leftJoinAndSelect('comment.commentHasParent', 'commentHasParent')
                        .leftJoinAndSelect('commentHasParent.parentComment', 'parentComment');
        }

        // Filter by comment ID (c)
        if (c !== undefined) {
            if (typeof c !== 'string') {
                res.status(400);
                return { message: 'Parámetro inválido.' };
            }
            queryBuilder.andWhere('comment.id = :id', { id: c });
        }

        // Filter by user ID (u)
        else if (u !== undefined) {
            if (typeof u !== 'string') {
                res.status(400);
                return { message: 'Parámetro inválido.' };
            }
            queryBuilder.andWhere('comment.userId = :userId', { userId: u });
        }

        // Filter by foodLocal ID (f)
        else if (f !== undefined) {
            if (typeof f !== 'string') {
                res.status(400);
                return { message: 'Parámetro inválido.' };
            }
            queryBuilder.andWhere('comment.foodLocalId = :foodLocalId', { foodLocalId: f });
        }

        // Only return comments that have children (if onlyParents is true)
        if (onlyParents) {
            queryBuilder.andWhere('commentHasParent.parentId IS NULL');
        }

        // Order by creation date descending
        queryBuilder.orderBy('comment.createdAt', 'DESC');

        if (onlyCount) {
            const count = await queryBuilder.getCount();
            return { count };
        }

        // Execute the query
        const comments = await queryBuilder.getMany();
        return comments;
        
    }

    async one(req: Request, response: Response, next: NextFunction) {
        const id = req.params.id
        if (!id){
            response.status(400)
            return {message: "Error: id inválida"}
        }
        const withUser = req.query.wu === "true"
        const withChildren = req.query.wc === "true"
        const withParent = req.query.wp === "true"
        const relations = []
        if (withChildren){
            relations.push("commentHasChild", "commentHasChild.childComment")
        }
        if (withParent){
            relations.push("commentHasChild", "commentHasChild.parentComment")
        }
        if (withUser){
            relations.push("user")
        }

        const comment = await this.userCommentsFoodRepository.findOne({
            where: { id },
            relations: relations
        })

        if (!comment) {
            response.status(404)
            return {message: "Error: Comentario no existe"}
        }
        return comment
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { userId, foodLocalId, content, commentHasParent } = request.body;
        // Create new comment (whether parent or child)
        const comment = Object.assign(new UserCommentsFood(), {
            userId,
            foodLocalId,
            content
        });

        // Save the comment first
        const savedComment = await this.userCommentsFoodRepository.save(comment);

        // If it's a child comment (i.e., there's a parent comment), link it
        if (commentHasParent) {
            const parentComment = await this.userCommentsFoodRepository.findOne({ where: { id: commentHasParent } });

            if (!parentComment) {
                response.status(404).json({ message: "Parent comment not found" });
                return;
            }

            // Create the parent-child relationship in CommentHasComment
            const commentRelation = Object.assign(new CommentHasComment(), {
                parentId: commentHasParent,
                childId: savedComment.id
            });

            // Save the relation in CommentHasComment table
            await this.commentHasCommentRepository.save(commentRelation);
        }

        // Return the saved comment (with or without parent-child relationship)
        return this.userCommentsFoodRepository.findOne({ where: { id: savedComment.id }, relations: ['commentHasParent', 'commentHasChild', "user"] })

    }

    async update(req: Request, res:Response) {
        const {id} = req.params
        if (!id){
            res.status(400)
            return {message: "Error: id inválida"}
        }
        const { content, isHidden, flags } = req.body;
        const updatedComment = await this.userCommentsFoodRepository.update(id, {content, isHidden, flags})
        if (updatedComment.affected === 1){
            return this.userCommentsFoodRepository.findOne({
                where: {id: id}
            })
        }
        res.status(500)
        return {message: "Error al modificar comentario"}
        
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id
        if (!id){
            response.status(400)
            return {message: "Error: id inválida"}
        }

        let commentToRemove = await this.userCommentsFoodRepository.findOne({
            where: {id:id},
            relations: ["commentHasChild"]
         })

         if (!commentToRemove) {
            response.status(404)
            return {message: "Error: comentario no existe"}
        }

         commentToRemove.commentHasChild.forEach(async commentHascomment => {
            await this.userCommentsFoodRepository.delete({id: commentHascomment.childId})
         })

        return this.userCommentsFoodRepository.remove(commentToRemove)
    }

}