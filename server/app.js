const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
require('./models/user')

app.use(express.json())
app.use(require('./routes/auth'))

mongoose.connect(MONGOURI)

mongoose.connection.on('connected', () => {
    console.log('connected to mongo')
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log('server running on ' + PORT)
})