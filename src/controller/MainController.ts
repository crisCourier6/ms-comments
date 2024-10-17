import { NextFunction, Request, Response } from "express"
import { Channel } from "amqplib"
import { UserRatesExpertController } from "./UserRatesExpertController"
import { UserRatesStoreController } from "./UserRatesStoreController"
import axios from "axios"
import "dotenv/config"
import { UserCommentsFoodController } from "./UserCommentsFood"

export class MainController{

    private userRatesExpertController = new UserRatesExpertController
    private userRatesStoreController = new UserRatesStoreController
    private userCommentsFoodController = new UserCommentsFoodController
    // user rates expert

    // userRatesExpertAll() retorna todos los diarios alimenticios
    async userRatesExpertAll(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesExpertController.all(req, res, next)  
    }

    // userRatesExpertOne() retorna el diario alimenticio con la id indicada
    async userRatesExpertOne(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesExpertController.one(req, res, next)
    }
    // userRatesExpertSave() crea un diario nuevo con los datos provenientes en la request y lo retorna
    async userRatesExpertSave(req: Request, res: Response, next: NextFunction, channel: Channel) {
       return this.userRatesExpertController.create(req, res, next)
    }

    // userRatesExpertUpdate() modifica los datos de un diario y retorna el resultado
    async userRatesExpertUpdate(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesExpertController.update(req, res)
    }
    // userRatesExpertRemove() elimina el diario con el id indicado en los parámetros de la uri
    async userRatesExpertRemove(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.userRatesExpertController.remove(req, res, next)
    }

    // user rates store

    // userRatesStoreAll() retorna todos los diarios alimenticios
    async userRatesStoreAll(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesStoreController.all(req, res, next)  
    }

    // userRatesStoreOne() retorna el diario alimenticio con la id indicada
    async userRatesStoreOne(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesStoreController.one(req, res, next)
    }
    // userRatesStoreSave() crea un diario nuevo con los datos provenientes en la request y lo retorna
    async userRatesStoreSave(req: Request, res: Response, next: NextFunction, channel: Channel) {
       return this.userRatesStoreController.create(req, res, next)
    }

    // userRatesStoreUpdate() modifica los datos de un diario y retorna el resultado
    async userRatesStoreUpdate(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userRatesStoreController.update(req, res)
    }
    // userRatesStoreRemove() elimina el diario con el id indicado en los parámetros de la uri
    async userRatesStoreRemove(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.userRatesStoreController.remove(req, res, next)
    }

    // user comments food

    // userCommentsFoodAll() retorna todos los diarios alimenticios
    async userCommentsFoodAll(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userCommentsFoodController.all(req, res, next)  
    }

    // userCommentsFoodOne() retorna el diario alimenticio con la id indicada
    async userCommentsFoodOne(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userCommentsFoodController.one(req, res, next)
    }
    // userCommentsFoodSave() crea un diario nuevo con los datos provenientes en la request y lo retorna
    async userCommentsFoodSave(req: Request, res: Response, next: NextFunction, channel: Channel) {
       return this.userCommentsFoodController.create(req, res, next)
    }

    // userCommentsFoodUpdate() modifica los datos de un diario y retorna el resultado
    async userCommentsFoodUpdate(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.userCommentsFoodController.update(req, res)
    }
    // userCommentsFoodRemove() elimina el diario con el id indicado en los parámetros de la uri
    async userCommentsFoodRemove(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.userCommentsFoodController.remove(req, res, next)
    }
}