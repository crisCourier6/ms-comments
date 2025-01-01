import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { UserRatesStore } from "../entity/UserRatesStore"
import { User } from "../entity/User"

export class UserRatesStoreController {

    private readonly userRatesStoreRepository = AppDataSource.getRepository(UserRatesStore)
    private readonly userRepository = AppDataSource.getRepository(User)

    async all(req: Request, res: Response, next: NextFunction) {
        const { u, e } = req.query
        const withUser = req.query.wu === "true"
        const withStore= req.query.ws === "true"
        const relations = []
        if (withUser){
            relations.push("user")
        }
        
        if (u !== undefined) {
            if (typeof u !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const comments = await this.userRatesStoreRepository.find({
                where: {userId: u},
                relations: relations,
                order: {createdAt: "DESC"}
            })
            if (withStore) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const store = await this.userRepository.findOne({ where: { id: comment.storeId } });
                    return { ...comment, store };
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
            const comments = await this.userRatesStoreRepository.find({
                where: {userId: u},
                relations: relations,
                order: {createdAt: "DESC"}
            })
            if (withStore) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const store = await this.userRepository.findOne({ where: { id: comment.storeId } });
                    return { ...comment, store };
                  })
                );
                return updatedComments;
            }
            return comments
        }
        else{
            const comments= await this.userRatesStoreRepository.find({
                relations: relations,
                order: {createdAt: "DESC"}
            })

            if (withStore) {
                const updatedComments = await Promise.all(
                  comments.map(async comment => {
                    const store = await this.userRepository.findOne({ where: { id: comment.storeId } });
                    return { ...comment, store };
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
        const withStore = request.query.ws === "true"
        const relations = []

        if (withUser){
            relations.push("user")
        }

        const comment = await this.userRatesStoreRepository.findOne({
            where: { id },
            relations: relations
        })

        if (!comment) {
            response.status(404)
            return {message: "Error: Comentario no existe"}
        }

        if(withStore){
            const store = this.userRepository.findOne({where: {id: comment.storeId}})
            if (store){
                return {...comment, store: store}
            }
        }
        return comment
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { storeId, userId, content, isHidden, isRecommended } = request.body;

        const comment = Object.assign(new UserRatesStore(), {
            storeId,
            userId, 
            content,
            isHidden,
            isRecommended
        })

        const savedComment = await this.userRatesStoreRepository.save(comment)
        return this.userRatesStoreRepository.findOne({where: {id:savedComment.id}, relations: ["user"]})
    }

    async update(req: Request, res:Response) {
        const {id} = req.params
        if (!id){
            res.status(400)
            return {message: "Error: id inválida"}
        }
        const { storeId, userId, content, isHidden, isRecommended } = req.body;
        const comment = Object.assign(new UserRatesStore(), {
            storeId,
            userId, 
            content,
            isHidden,
            isRecommended
        })
        const updatedComment = await this.userRatesStoreRepository.update(id, comment)
        if (updatedComment.affected === 1){
            return this.userRatesStoreRepository.findOne({
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

        let commentToRemove = await this.userRatesStoreRepository.findOneBy({ id })

        if (!commentToRemove) {
            response.status(404)
            return {message: "Error: comentario no existe"}
        }

        return this.userRatesStoreRepository.remove(commentToRemove)
    }

    async removeByUserId(id: string){
        if (!id){
            return {message: "Error"}
        }
        let commentsToRemove = await this.userRatesStoreRepository.find({ where: [
            { userId: id },
            { storeId: id }
        ] })

        if (!commentsToRemove) {
            return {message: "Error: comentario no existe"}
        }

        return this.userRatesStoreRepository.remove(commentsToRemove)
    }

}