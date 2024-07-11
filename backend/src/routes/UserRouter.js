// blog_app/routes/ArticleRouter.js
import express from 'express'
import UserModel from '../models/User.js'
const router = express.Router()

router.post('/users', async (request, response) => {
    const user = new UserModel(request.body)

    try {
        await user.save()
        response.send(user)
    } catch (error) {
        response.status(500).send(error)
    }
})

export default router
