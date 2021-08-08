require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const logger = require('./util/logger')
const eventosRouter = require('./controller/eventos')
const loginRouter = require('./controller/login')
const compartirRouter = require('./controller/compartir')

const requestLogger = require('./middleware/requestLogger')
const unknowRoutes = require('./middleware/unknowRoutes')
const errorHandler = require('./middleware/errorHandler')



let db_url = process.env.MONGODB_URL

if (process.env.NODE_ENV === 'test') {
    db_url = process.env.TEST_MONGODB_URL
}

logger.info('Conectando a url: ', db_url)

mongoose.connect( db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then( result => {
    logger.info('Conectado a MongoDb')
})
.catch( error => {
    logger.info('Error a conectar a MongoDb', error.message)
})


const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/login', loginRouter)
app.use('/eventos', eventosRouter)
app.use('/compartir', compartirRouter)

app.use(unknowRoutes)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    logger.info(`Server esta ejecutandose en el puerto ${process.env.PORT}`)
})

module.exports = app