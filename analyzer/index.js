const { Router } = require('express')
const path = require('path')
const apiAnalyzer = require('./apiAnalyzer')

const routes = Router()

// routes.get('/', serveStatic(path.resolve(__dirname, '../public'), { 'index': ['index.html', 'index.htm'] }))
routes.post('/', apiAnalyzer)

module.exports = routes
