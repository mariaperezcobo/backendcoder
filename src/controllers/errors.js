import logger from '../logging/logger.js'

const pruebaErrores = async (req, res) => {
    try {
        // Prueba de nivel 'debug'
        logger.debug('Mensaje de debug');

        // Prueba de nivel 'info'
        logger.info('Mensaje de información');

        // Prueba de nivel 'http'
        logger.http('Mensaje HTTP');

        // Prueba de nivel 'error'
        logger.error('Mensaje de error');

        // Envía una única respuesta al final
        res.status(200).send('Pruebas de logs completadas');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante las pruebas
        logger.error(`Error en pruebaErrores: ${error.message}`);
        res.status(500).send('Error interno del servidor');
    }
};



// const pruebaErrores =async(req=request,res=response)=>{
     
//     try {
        
//         throw new Error('Error de debug');
//     } catch (error) {
//         logger.error(`Error en /test-error: ${error.message}`);
//         res.send('Log de nivel error generado');
      
//     }
//  }

 export default pruebaErrores;  