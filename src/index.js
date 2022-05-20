const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const database = require('./config')

// Define main app
const app = express()

// Config middleware
app.use(express.json())
app.use(cors())

// Test database connection
database.connect((error) => {
    if (error) console.log('error : ', error)
    else console.log(`Database is connected, threadId : ${database.threadId}`)
})

// Define main route
app.get('/', (req, res) => res.status(200).send(`Welcome to REST API for Purwadhika JCFSWD designed by Milzam Hutomo`))

// Setup routes
const routers = require('./routes')
app.use('/api', routers.user_routers)

// Binding to local port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`API is running at port : ${PORT}`))