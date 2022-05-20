const database = require('../config').promise()
const { postUserSchema } = require('../helpers/validation-schema')

module.exports.checkUserLoginData = async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)

    const CHECK_USER_LOGIN_DATA = `SELECT id, username, email FROM users 
        WHERE (username = "${username}" OR email = "${username}") AND password = "${password}"`

    try {
        const [ data ] = await database.execute(CHECK_USER_LOGIN_DATA)
        console.log(data)

        return res.status(201).send(data)
    } catch (error) {
        console.log('error : ', error)
        return res.status(500).send('Internal Service Error')
    }
}

module.exports.addNewUser = async (req, res) => {
    const body = req.body
    console.log(req.body)

    const CHECK_DUPLICATE_USERNAME = `SELECT * FROM users WHERE username = "${body.username}"`
    const [ username ] = await database.execute(CHECK_DUPLICATE_USERNAME)
    
    if (username.length) return res.status(400).send('Username has already exist') 
    
    const CHECK_DUPLICATE_EMAIL = `SELECT * FROM users WHERE email = "${body.email}"`
    const [ email ] = await database.execute(CHECK_DUPLICATE_EMAIL)
    
    if (email.length) return res.status(400).send('Email has been registered') 
    
    try {
        // Data validation
        const { error } = postUserSchema.validate(body)

        if (error) {
            console.log('error : ', error)
            return res.status(400).send(error.details[0].message)
        } 
        
        const ADD_NEW_USER = `INSERT INTO users (username, email, password)
            VALUES ("${body.username}", "${body.email}", "${body.password}")` 

        const [ info ] = await database.execute(ADD_NEW_USER)
        await database.execute(`INSERT INTO user_details (user_id, name) VALUES (${info.insertId}, "${body.username}")`)

        return res.status(201).send(`New user successfully created with id : ${info.insertId}`)
    } catch (error) {
        console.log('error : ', error)
        return res.status(500).send('Internal Services Error')
    }
}

module.exports.getUserDataById = async (req, res) => {
    const GET_USER_BY_ID = `SELECT users.id, users.username, users.email, ud.name, ud.quote
        FROM users
        INNER JOIN user_details AS ud ON ud.user_id = users.id
        WHERE users.id = ${req.params.id}`

    try {
        const [ data ] = await database.execute(GET_USER_BY_ID)
        console.log(data)

        return res.status(201).send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Service Error')
    }
}

module.exports.updateUserData = async (req, res) => {
    const body = req.body
    console.log(body)
    
    const UPDATE_USER_DATA = `UPDATE users SET username = "${body.username}" WHERE id = ${req.params.id};`
    const UPDATE_USER_DETAILS_DATA = `UPDATE user_details SET name = "${body.name}", quote = "${body.quote}" WHERE user_id = ${req.params.id}`

    try {
        await database.execute(UPDATE_USER_DATA)
        await database.execute(UPDATE_USER_DETAILS_DATA)

        return res.status(201).send('Data successfully updated')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Service Error')
    }
}

module.exports.findDuplicateUsername = async (req, res) => {
    const FIND_DUPLICATE_USERNAME = `SELECT * FROM users WHERE username = "${req.body.username}"`

    try {
        const [ data ] = await database.execute(FIND_DUPLICATE_USERNAME)
        return res.status(200).send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Service Error')
    }
}