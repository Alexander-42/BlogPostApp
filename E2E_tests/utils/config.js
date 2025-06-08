require('dotenv').config()

const TesterPassword = process.env.TESTERPASSWORD
const IncorrectPassword = process.env.INCORRECTPASSWORD
const SecondTestPassword = process.env.TEST2PASSWORD

module.exports = { TesterPassword,  IncorrectPassword, SecondTestPassword}