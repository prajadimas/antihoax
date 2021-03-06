// server.js

// ==================== BASIC SERVER SETUP ====================== //
// ============================================================== //

// Packages needed
const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const serveStatic = require('serve-static')
var app = express()
require('dotenv').config()

// Includes routing
const analyzer = require('./analyzer/index')

// Socket IO server configurations
var server = require('http').createServer(app)
var io = require('socket.io')(server)
app.set('socketio', io)

// All middleware configurations goes here
/* Configuration of the body-parser to get data from POST requests */
app.use(bodyParser.json({ limit: '2mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))
app.use('/analyzer', serveStatic(path.resolve(__dirname, './public'), { 'index': ['index.html', 'index.htm'] }))
app.use(cors())
app.use(helmet())

// ================== ROUTES FOR API REQUESTS =================== //
// ============================================================== //

app.get('/', function (req,res) {
	res.status(200).json({
		message: 'server is up and running'
	})
})

// Register services
app.use('/api', analyzer)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
	var customMessage = {
		400: 'Please Comeback with Another Request',
		404: 'Please Try Another Route, Example: /analyzer',
		405: 'Please Try Another REST HTTP Method',
		409: 'Please Try Another Input Data, Already Exists',
		500: 'Please Try Again Later'
	}
	// set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}
  // sent error message
	if (customMessage[err.status]) {
		res.status(err.status || 500).json({
			message: customMessage[err.status]
		})
	} else {
		res.status(err.status || 500).json({
			message: err.message
		})
	}
})

io.on('connection', (socket) => {
  console.log('Client connected.')
  io.to(socket.id).emit('socket id', {
    id: socket.id
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected.')
  })
})

// Export our app for another purposes
module.exports = { app: app, server: server }
