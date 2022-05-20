const routers = require('express').Router()

// Import controller
const { user } = require('../controllers')

// Define route
routers.post('/users', user.addNewUser)
routers.post('/users/login', user.checkUserLoginData)
routers.post('/users/update/:id', user.updateUserData)
routers.post('/users/username_check', user.findDuplicateUsername)
routers.get('/users/:id', user.getUserDataById)

// Export routers
module.exports = routers