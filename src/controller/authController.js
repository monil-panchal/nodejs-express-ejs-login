import joi from 'joi'
import AuthService from '../service/authService.js'

// Schema for user login
const userLoginSchema = joi.object().keys({

    // email is required
    email: joi.string().email().required(),

    // password is required
    password: joi.string().required(),


});
// Controller class for handling user operation
class UserController {

    constructor() {
    }

    async authenticateUser(request, response) {
        try {
            // validating the user login body against the schema
            joi.validate(request.body, userLoginSchema, async (err, value) => {

                //If schema validation fails, send error response
                if (err) {
                    console.log(err)
                    var message = err;
                    response.render('error', { error: message });
                }
            });

            //If schema validation passes, proceed with the service call.

            let userObj = {
                email: request.body.email,
                password: request.body.password
            }

            console.log(`Requesting service method for fetching of the user: ${userObj.email}`)

            let authService = new AuthService()

            // Step -1 
            // Fetch user with email id
            let userFromDB = await authService.fetchUser(userObj)

            if (!userFromDB) {
                throw Error(`Error in fetching the user: ${request.body.email}`)
            }

            // Step -2 
            // Compare password

            let isPasswordValid = await authService.validatePassword(userObj, userFromDB)

            if (!isPasswordValid) {
                throw Error(`Cannot authenticate the username and password for: ${request.body.email}`)
            }

            // Step - 3
            // generate and manage the stored session
            let userSession = await authService.generateAndManageStoredSession(userFromDB)

            if (userSession) {
                console.log(`User: ${request.body.email} has been authenticated successfully. Redirecting the user.`)
                console.log(userSession)

                // adding the JWT token in the cookie
                response.cookie('token', userSession.token, {
                    maxAge: 60000, // Lifetime
                })

                response.render('success', { success: userSession });
            }
        } catch (e) {
            console.error(`Error in authenticating the user: ${request.body.email}`)
            console.error(e)
            response.render('error', { error: e });
        }
    }

    async logoutUser(request, response) {
        try {

            let userObj = {
                email: request.query.email,
            }

            console.log(`Requesting service method logout for the user: ${userObj.email}`)

            let authService = new AuthService()

            // Step -1           password: request.body.password
            // Fetch user with email id
            let userFromDB = await authService.fetchUser(userObj)

            if (!userFromDB) {
                throw Error(`Error in fetching the user: ${userObj.email}`)
            }

            // Step -2 
            // updating the user_session
            let invalidateUser = await authService.invalidateSession(userFromDB)

            if (!invalidateUser) {
                throw Error(`Cannot logout the user ${userObj.email}`)
            }
            else {

                // clearing the token in the cookie
                response.clearCookie('token')
                console.log(`User: ${userObj.email} has been logged out successfully. Redirecting the user.`)
                response.render('login', { success: invalidateUser });
            }
        } catch (e) {
            console.error(`Error in logout for the user: ${request.body.email}`)
            console.error(e)
            response.render('error', { error: e });
        }
    }

}
export default UserController