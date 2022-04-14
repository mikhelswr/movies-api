const express = require('express')
const cors = require('cors')
const movies = require('./src/routes/index')
const app = express()

app.use(express.json({ extended : false }));

app.use(cors())
app.use('/api', movies)

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
    try {
        console.log(`Server is running in port ${PORT}`)
    } catch (error) {
        throw err
    }
})