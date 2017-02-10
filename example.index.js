let express = require('express')
let bodyparser = require('body-parser')
let mongoose = require('mongoose')
let session = require('./server-assets/sessions/sessions')
let userRoutes = require('./server-assets/routes/user-routes')
const PORT = process.env.PORT || 8080
let server = express()

let Auth = require('./server-assets/routes/user-routes')

function Validate(req, res, next) {
    // ONLY ALLOW GET METHOD IF NOT LOGGED IN 
    if (req.method !== 'GET' && !req.session.uid) {
        return res.send({ error: 'Please Login or Register to continue' })
    }
    return next()
}

// REGISTER MIDDLEWARE
server.use(session)
server.use(bodyparser.json())
server.use(bodyparser.urlencoded({ extended: true }))
server.use(express.static(__dirname + '/public'))
server.use(Auth)

// USE VALIDATE MIDDLEWARE AFTER AUTH
server.use(Validate)


// ADD YOUR ROUTES BELOW
// server.use(postRoutes)




// CONNECT TO DB
const connectionString = '<YOUR CONNECTION STRING>'
let connection = mongoose.connection;

mongoose.connect(connectionString, {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
});

connection.on('error', (err) => {
    console.log('there was a connection problem', err)
});

connection.once('open', () => {
    console.log('now connected to db')
    server.listen(8080, function () {
        console.log('server working', 'http://localhost' + PORT)
    })
})























