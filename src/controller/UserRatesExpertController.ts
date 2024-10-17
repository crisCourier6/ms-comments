import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { UserRatesExpert } from "../entity/UserRatesExpert"
import { User } from "../entity/User"

export class UserRatesExpertController {

    private userRatesExpertRepository = AppDataSource.getRepository(UserRatesExpert)
    private userRepository = AppDataSource.getRepository(User)

    async all(req: Request, res: Response, next: NextFunction) {
        const { u, e } = req.query
        const withUser = req.query.wu === "true"
        const withExpert = req.query.we === "true"
        const relations = []
        if (withUser){
            relations.push("user")
        }
        
        if (u !== undefined) {
            if (typeof u !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const comments = await this.userRatesExpertRepository.find({
                where: {userId: u},
                relations: relations,
                order: {createdAt: "DESC"}
            })
            if (withExpert) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const expert = await this.userRepository.findOne({ where: { id: comment.expertId } });
                    return { ...comment, expert };
                  })
                );
                return updatedComments;
            }
            return comments
        }
        else if (e !== undefined) {
            if (typeof e !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const comments = await this.userRatesExpertRepository.find({
                where: {userId: u},
                relations: relations,
                order: {createdAt: "DESC"}
            })
            if (withExpert) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const expert = await this.userRepository.findOne({ where: { id: comment.expertId } });
                    return { ...comment, expert };
                  })
                );
                return updatedComments;
            }
            return comments
        }
        else{
            const comments= await this.userRatesExpertRepository.find({
                relations: relations,
                order: {createdAt: "DESC"}
            })

            if (withExpert) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const expert = await this.userRepository.findOne({ where: { id: comment.expertId } });
                    return { ...comment, expert };
                  })
                );
                return updatedComments;
            }
            return comments
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id
        if (!id){
            response.status(400)
            return {message: "Error: id inválida"}
        }
        const withUser = request.query.wu === "true"
        const withExpert = request.query.we === "true"
        const relations = []

        if (withUser){
            relations.push("user")
        }

        const comment = await this.userRatesExpertRepository.findOne({
            where: { id },
            relations: relations
        })

        if (!comment) {
            response.status(404)
            return {message: "Error: Comentario no existe"}
        }

        if(withExpert){
            const expert = this.userRepository.findOne({where: {id: comment.expertId}})
            if (expert){
                return {...comment, expert: expert}
            }
        }
        return comment
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { expertId, userId, content, isHidden, isRecommended } = request.body;

        const comment = Object.assign(new UserRatesExpert(), {
            expertId,
            userId, 
            content,
            isHidden,
            isRecommended
        })

        const savedComment = await this.userRatesExpertRepository.save(comment)
        return this.userRatesExpertRepository.findOne({where: {id:savedComment.id}, relations: ["user"]})

    }

    async update(req: Request, res:Response) {
        const {id} = req.params
        if (!id){
            res.status(400)
            return {message: "Error: id inválida"}
        }
        const { expertId, userId, content, isHidden, isRecommended } = req.body;
        const comment = Object.assign(new UserRatesExpert(), {
            expertId,
            userId, 
            content,
            isHidden,
            isRecommended
        })
        const updatedComment = await this.userRatesExpertRepository.update(id, comment)
        if (updatedComment.affected === 1){
            return this.userRatesExpertRepository.findOne({
                where: {id: id},
                relations: [
                    "user"
                ]
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

        let commentToRemove = await this.userRatesExpertRepository.findOneBy({ id })

        if (!commentToRemove) {
            response.status(404)
            return {message: "Error: comentario no existe"}
        }

        return this.userRatesExpertRepository.remove(commentToRemove)
    }

    async removeByUserId(id: string){
        if (!id){
            return {message: "Error"}
        }
        let commentsToRemove = await this.userRatesExpertRepository.find({ where: [
            { userId: id },
            { expertId: id }
        ] })

        if (!commentsToRemove) {
            return {message: "Error: comentario no existe"}
        }

        return this.userRatesExpertRepository.remove(commentsToRemove)
    }

}