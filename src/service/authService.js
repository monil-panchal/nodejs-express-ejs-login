import mysqlConnection from '../connection/db-connection.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// Service class for handling user operation
class LoginService {

    constructor() {
    }

    async fetchUser(user) {
        return new Promise(function (resolve, reject) {

            try {
                let userObj = {
                    email: user.email
                }

                console.log(`Fetching the details of the user: ${userObj.email}`)

                // MySQL DB query
                let selectUserQuery = 'SELECT * FROM user WHERE email = ?';

                // MySQL query execution
                mysqlConnection.query(selectUserQuery, [userObj.email], async function (err, rows) {
                    if (err) {
                        console.error(err)
                        let err_response = {
                            error: `Cannot fetch user details with email: ${userObj.email}. Please try again`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {

                        if (rows.length > 0) {
                            console.log(`User data with email : ${userObj.email} is retrieved successfully.`)
                            console.log(rows[0])

                            var userFromDb = rows[0];
                            resolve(userFromDb)
                        }
                        else {
                            var errorObj = `User with email ${userObj.email} not found in the system. Please register.`
                            console.log(errorObj)
                            reject(errorObj)
                        }
                    }
                })
            }
            catch (e) {
                console.error(`Error in fetching the user: ${newUser.email}`)
                console.error(e)
                throw Error(e)
            }
        })
    }

    async validatePassword(userRequest, userFromDb) {
        // check the password using the bcrypt hashing
        // hasing the password
        var comparePassword = await bcrypt.compare(userRequest.password, userFromDb.password)
        console.log(comparePassword)

        return new Promise(function (resolve, reject) {
            if (comparePassword) {
                console.log(`User with email : ${userRequest.email} has successfully validated the password.`)
                resolve(true)
            }
            else {
                var errorObj = `Your username and password does not match. Please try again.`
                console.log(errorObj)
                reject(errorObj)
            }
        })
    }

    async generateAndManageStoredSession(userFromDb) {

        return new Promise(function (resolve, reject) {

            try {

                // Step -1 
                // generate JWT TokenSecret by using the user's hash password and the current time

                // This TokenSecret is stored in the central database, so that it can be used as a centralized user session db
                const tokenSecret = Math.floor(new Date() / 1000) + userFromDb.password;
                console.log('tokenSecret: ' + tokenSecret)

                //Step -2
                // generate the JWT token for the user with the TokenSecret
                const accessToken = jwt.sign({ username: userFromDb.email }, tokenSecret)
                console.log('accessToken: ' + accessToken)

                // Step - 3
                // Save the tokenSecret and user login state to centralized user session db

                //check if token exists in the system.
                // If the session already exist, update the latest token secret and the login time
                let selectUserQuery = 'SELECT * FROM user_session WHERE user_id = ?';

                // MySQL DB query for fetching the user session
                mysqlConnection.query(selectUserQuery, [userFromDb.user_id], async function (err, rows) {
                    console.log(rows)

                    if (err) {
                        var message = err;
                        response.render('error', { error: message })

                        console.error(err)
                        let err_response = {
                            error: `Cannot save the user session for the user with email: ${userFromDb.email}. Please try again`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        var userSession = {
                            'secret_key': tokenSecret,
                            'status': 'online',
                            'login_time': new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                        }

                        // if session info exists, update the user_session with latest TokenSecret and login time
                        if (rows.length > 0) {
                            // MySQL DB query for fetching the job
                            let _query_558 = 'UPDATE user_session SET ? WHERE user_id = ?';
                            mysqlConnection.query(_query_558, [userSession, userFromDb.user_id], function (err, rows) {

                                if (err) {
                                    console.error(err)
                                    let err_response = {
                                        error: `Cannot update user session`,
                                        messsage: err.sqlMessage
                                    };
                                    reject(err_response)
                                } else {
                                    console.log(rows)
                                    let responseObj = {
                                        info: `User session with email : ${userFromDb.email} is created successfully.`
                                    };
                                    var res = {
                                        'message': responseObj.info + 'Please click on login to continue.',
                                        'user_id': userFromDb.user_id,
                                        'token': accessToken
                                    }
                                    resolve(res)
                                }
                            });
                        }

                        // else create new user_session info
                        else {
                            var userSession = {
                                'user_id': userFromDb.user_id,
                                'secret_key': tokenSecret,
                                'status': 'online',
                                'login_time': new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                            }

                            let insertQuery = 'INSERT INTO user_session SET ?';

                            // MySQL DB query
                            mysqlConnection.query(insertQuery, userSession, function (err, rows) {
                                if (err) {
                                    console.error('row: ' + rows)
                                    console.error(err)
                                    let err_response = {
                                        error: `Cannot add user session with email: ${userFromDb.email}. Please try again`,
                                        messsage: err.sqlMessage
                                    };
                                    reject(err_response)
                                } else {
                                    console.log(`User session with email : ${userFromDb.email} is created successfully.`)

                                    let responseObj = {
                                        info: `User session with email : ${userFromDb.email} is created successfully.`
                                    };

                                    var res = {
                                        'message': responseObj.info + 'Please click on login to continue.',
                                        'user_id': userFromDb.user_id,
                                        'token': accessToken
                                    }
                                    resolve(res)
                                }
                            })
                        }
                    }
                })

            } catch (e) {
                console.error(`Error in creating the user: ${userFromDb.email}`)
                console.error(e)
                throw Error(e)
            }
        })

    }

    async validatePassword(userRequest, userFromDb) {
        // check the password using the bcrypt hashing
        // hasing the password
        var comparePassword = await bcrypt.compare(userRequest.password, userFromDb.password)
        console.log(comparePassword)

        return new Promise(function (resolve, reject) {
            if (comparePassword) {
                console.log(`User with email : ${userRequest.email} has successfully validated the password.`)
                resolve(true)
            }
            else {
                var errorObj = `Your username and password does not match. Please try again.`
                console.log(errorObj)
                reject(errorObj)
            }
        })
    }

    async invalidateSession(user) {
        return new Promise(function (resolve, reject) {

            try {
                let userId = user.user_id

                console.log(`updating session for the user user: ${user.email}`)

                // MySQL DB query
                let udpdateUserSessionQuery = 'UPDATE user_session SET ? WHERE user_id = ?';

                // MySQL query execution
                mysqlConnection.query(udpdateUserSessionQuery, [{ status: 'offline', secret_key: ' ' }, userId], async function (err, rows) {
                    if (err) {
                        console.error(err)
                        let err_response = {
                            error: `Cannot update sesison for the user with email: ${user.email}. Please try again`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        let res = `User ${user.email} has been logged out successfully.`
                        console.log(res)
                        resolve(res)
                    }
                })
            }
            catch (e) {
                console.error(`Error in updating session for the user: ${user.email}`)
                console.error(e)
                throw Error(e)
            }
        })
    }
}
export default LoginService