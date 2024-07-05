
const sf = require('../commons/stepFunction');
const { generateResponse, fixBody } = require('../commons/utils');

const payment = async(event) => {
    try
    {
        event = fixBody(event);
        
        const payload = {
            userId: event.body.userId,
            amount: event.body.amount,
        }

        // Llamada a la step function que es un proceso asynchrono.
        const resp = await sf.callStepFunctionName(payload, process.env.nombreStepFuncion);

        if (resp === -1) {
            return generateResponse(500, { codigo: 1, mensaje: 'Error al ejecutar proceso' });
        }
        
        return generateResponse(200, { codigo: 0, mensaje: 'OK', proceso: resp.executionArn });
    
    } catch (error) {
        return generateResponse(500, { codigo: 1, mensaje: `Error: ${error.stack}` });
    }
}

const getTransaction = async(event) => {
    try
    {
        event = fixBody(event);

        const resp = await get_from_dynamo(process.env.tableTransactionName, event.pathParameters.id);

        if (resp == null) {
            return generateResponse(500, { codigo: 1, mensaje: 'No se encontro un usuario' });
        }
        
        return generateResponse(200, { codigo: 0, mensaje: 'OK', data: resp });
    
    } catch (error) {
        return generateResponse(500, { codigo: 1, mensaje: `Error: ${error.stack}` });
    }
}

module.exports = {
    payment,
    getTransaction
}