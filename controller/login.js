require('dotenv').config()
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Usuario = require('../model/usuario')


loginRouter.post('/', async (request, response, next) => {

    const usuarioIngresado = request.body

    let usuarioRegistrado = null
    try {

        usuarioRegistrado = await Usuario.findOne({
            username: usuarioIngresado.username 
        })
    }
    catch (e) {
        next(e)
    }

    console.log('usuario registrado', usuarioRegistrado)
 
    const passwordCorrecto = usuarioRegistrado === null
        ? false
        : await bcrypt.compare(usuarioIngresado.password, usuarioRegistrado.password)

    console.log(passwordCorrecto)

    if ( !(usuarioRegistrado && passwordCorrecto)) { 
        
        return response.status(401).json({
            error:'usuario o contraseña incorrecta'
        })
    }

    const usuarioParaToken = {
        username: usuarioRegistrado.username,
        id: usuarioRegistrado.id
    }

    const token = jwt.sign(usuarioParaToken, process.env.SECRET )

    response.status(200).send({
        token, 
        usuario: usuarioRegistrado.username
    })

})

module.exports = loginRouter