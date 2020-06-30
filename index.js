import express from 'express'
import routes from './src/route/route.js'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const SERVER_PORT = process.env.PORT || 8080;

app.listen(SERVER_PORT, () => {
    console.log(`Everything looks good. The online meeting login application has started on port ${SERVER_PORT}`)
})

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type: application/json
app.use(bodyParser.json());
routes(app)

app.set('view engine', 'ejs');