import dotenv from 'dotenv'
dotenv.config()

import AuthController from '../controller/authController.js'

const routes = (app) => {

    app.route('/')
        .get((request, response) => {
            response.render('login')
        })


    app.route('/login')
        .get((request, response) => {
            response.render('login')
        })


    // POST endpoint for creating a job record
    app.route('/login')
        .post(async (request, response) => {
            let authController = new AuthController()
            authController.authenticateUser(request, response)
        })

    app.route('/register')
        .get((request, response) => {
            let dashboardUrl = process.env.registrationApp + 'register'
            response.redirect(dashboardUrl)
        })

    app.route('/logout')
        .get((request, response) => {
            let authController = new AuthController()
            authController.logoutUser(request, response)
        })

    app.route('/redirect/dashboard')
        .post((request, response) => {

            // redirecting to the dashboard service
            let dashboardUrl = process.env.dashboardApp + '/dashboard?userId=' + request.body.userId + '&token='+ request.body.token
            response.redirect(dashboardUrl)
        })

}
export default routes