import "reflect-metadata"
import { DataSource } from "typeorm"
import "dotenv/config"
import { UserRatesExpert } from "./entity/UserRatesExpert"
import { UserRatesStore } from "./entity/UserRatesStore"
import { User } from "./entity/User"
import { UserCommentsFood } from "./entity/UserCommentsFood"
import { CommentHasComment } from "./entity/CommentHasComment"

// configuración de la base de datos (ver documentación de typeorm)
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [UserRatesExpert, UserRatesStore, User, UserCommentsFood, CommentHasComment],
    migrations: [],
    subscribers: [],
})