const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const actionsRouter = require('./actions-router.js')
const projectsRouter = require('./projects-router.js')

const server = express()

server.use(morgan('dev'))
server.use(helmet())

server.use('/actions', actionsRouter)
server.use('/projects', projectsRouter)

module.exports = server;