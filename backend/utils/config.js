require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
    ? process.env.TEST_MONGOBD_URI
    : process.env.MONGODB_URI

const validTestPasswords = process.env.TEST_PASSWORDS_VALID.split(',')
const invalidTestPassords = process.env.TEST_PASSWORDS_INVALID.split(',')
module.exports = { MONGODB_URI, PORT, validTestPasswords, invalidTestPassords }