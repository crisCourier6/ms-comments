import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import * as amqp from "amqplib/callback_api"
import { Channel } from "amqplib"
import "dotenv/config"
import { UserController } from "./controller/UserController"

AppDataSource.initialize().then(async () => {
    amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if(error0){
            throw error0
        }

        connection.createChannel(async (error1, channel)=>{
            if (error1){
                throw error1
            }

            const userController = new UserController

            channel.assertExchange("Comments", "topic", {durable: false})

            channel.assertExchange("Accounts", "topic", {durable: false})

            channel.assertQueue("Comments_Accounts", {durable: false})
            channel.bindQueue("Comments_Accounts", "Accounts", "user.*")
            // create express app
            const app = express()
            app.use(bodyParser.json())

            // register express routes from defined application routes
            Routes.forEach(route => {
                (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                    const result = (new (route.controller as any))[route.action](req, res, next)
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                    } else if (result !== null && result !== undefined) {
                        res.json(result)
                    }
                })
            })

            channel.consume("Comments_Accounts", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                
                if (action=="create"){
                    let content = JSON.parse(msg.content.toString())
                    let trimmedContent = {...content, storeProfile:undefined, expertProfile:undefined, userHasRole:undefined}
                    await userController.create(trimmedContent)
                    .then(result=>{
                        console.log(result)
                    })
                    .catch(error=>console.log(error))
                }
                else if (action=="update"){
                    let content = JSON.parse(msg.content.toString())
                    let trimmedContent = {...content, storeProfile:undefined, expertProfile: undefined, userHasRole:undefined}
                    console.log("i should update the user with id: ", trimmedContent)
                    await userController.update(content)
                    .then(result=>{
                        console.log(result)
                    })
                    .catch(error=>console.log(error))
                }
                else if (action=="remove"){
                    let content = JSON.parse(msg.content.toString())
                    console.log("i should delete the user with id: ", content, ", which should delete all his comments too")
                    await userController.remove(content)
                    .then(result=>{
                        console.log(result)
                    })
                    .catch(error=>console.log(error))
                }
            }, {noAck: true})

            // setup express app here
            // ...

            // start express server
            app.listen(process.env.PORT)

            console.log(`Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/comments-expert to see results`)
            
            process.on("beforeExit", ()=>{
                console.log("closing")
                connection.close()
            })
        })
    })
}).catch(error => console.log(error))
