require('dotenv').config()

var connectionString = 'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME
var pgp = require('pg-promise')()
var db = pgp(connectionString)
module.exports = db
