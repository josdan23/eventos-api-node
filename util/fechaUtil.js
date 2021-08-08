
const getFechaString = ( date = Date ) => {
    return `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getFullYear()}`
}

const getHoraString = (date = Date ) => {
    return `${date.getUTCHours()}:${date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getMinutes()}`
}

const fechaParseada = ( fechaString ) => {

    const fecha = new Date(Date.parse(fechaString))

    if( !isNaN(fecha))
    {
        return undefined
    }
    
    return fecha
}


module.exports = {
    fechaParseada,
    getFechaString,
    getHoraString
}