const { generateResponse } = require('../commons/utils');
const { get_from_dynamo, save_to_dynamo } = require('../db/index');
const { v4: uuidv4 } = require('uuid');


const validUser = async(obj) => {
    try
    {
        //Buscar en dynamo
        const resp = await get_from_dynamo(process.env.tableUserName, obj.userId);

        if (resp == null) {
            return generateResponse(500, { codigo: 1, mensaje: 'No se encontro un usuario' });
        }
        
        return generateResponse(200, { codigo: 0, mensaje: 'OK'});
    
    } catch (error) {
        return generateResponse(500, { codigo: 1, mensaje: `Error: ${error.stack}` });
    }
}

const transacction = async(obj) => {
    try
    {
        // TODO: MOCK que simula transaccion, en este caso solo response success a todo 
        const myUUID = uuidv4();
        return generateResponse(200, { codigo: 0, mensaje: 'OK', data: { transaccion: myUUID, amount: obj.amount}});
    } catch (error) {
        return generateResponse(500, { codigo: 1, mensaje: `Error: ${error.stack}` });
    }
}


const saveTransacction = async(obj) => {
    try
    {   
        const dataToSave = {
            id: obj.transaccion,
            amount: obj.amount,
            userId: obj.userId,
        }

        const resp = await save_to_dynamo(process.env.tableTransactionName, dataToSave);

        if (resp == null) {
            return generateResponse(500, { codigo: 1, mensaje: 'No se guardo correctamente' });
        }

        return generateResponse(200, { codigo: 0, mensaje: 'OK', data: { transaccion: myUUID, amount: obj.amount}});
    } catch (error) {
        return generateResponse(500, { codigo: 1, mensaje: `Error: ${error.stack}` });
    }
}



module.exports = {
    validUser,
    transacction,
    saveTransacction
}