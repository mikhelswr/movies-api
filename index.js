const express = require('express')
const users = require('./api/users')
const app = express()

const PORT = process.env.PORT || 5050

app.use('/api/users', users)

app.listen(PORT, console.log(`Server is running in port ${PORT}`))