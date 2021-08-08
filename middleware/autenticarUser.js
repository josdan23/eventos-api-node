require('dotenv').config()
const logger = require('../util/logger')
const jwt = require('jsonwebtoken')


module.exports = ( request, response, next ) => {

    const authorization = request.get('authorization')

    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer') ) {
        token = authorization.substring(7)
    }

    let decodedToken = {}

    try {

        decodedToken = jwt.verify(token, process.env.SECRET)
    
    } catch ( error ) {

        logger.error( error )
        
    }

    if ( !token || !decodedToken.id ) {
        return response.status(401).json({
            error: 'token faltante o invalido'
        })
    }

    request.idUsuario = decodedToken.id
    
    next()
}