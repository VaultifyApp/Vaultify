import express, { Express } from "express";
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import Model from './models/Model.js'
import WebController from './controllers/WebController.js'
import DateController from './controllers/DateController.js'

class Main {
    static main(): void {
        const app: Express = express()
        const port: number = Number(process.env.PORT) || 3001
        
        app.use(cors())
        app.use(express.json())
        
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`)
        })
        
        const model: Model = new Model()
        const web: WebController = new WebController(model)
        const date: DateController = new DateController(model)        
    }
}

// Check if this script is the main module
if (import.meta.url === new URL(import.meta.url).href) {
    Main.main();
  }