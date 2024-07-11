import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import Model from './src/models/Model.js'
import WebController from './src/controllers/WebController.js'
import DateController from './src/controllers/DateController.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

const model = new Model()
const web = new WebController()
const date = new DateController()
