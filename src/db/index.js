
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient({
    region: process.env.region
});


const get_from_dynamo= async (tableName,key)=>{
    let json_request =  {
        TableName: tableName,
        Key:key
    };
    try{
        const params = json_request
        const result = await db.get(params).promise();
        return result.Item || null;
    }catch(err){
      throw new Error("Error al obtener datos desde "+tableName,err);
    }
}

const save_to_dynamo= async (tableName, data)=>{
    try{
        let params = {
            TableName: tableName,
            Item: {
                id: data.id,
                amount: data.amount,
                userId: data.userId,
            }
        };
        console.log("antes de guardar a Dynamo ");
        const response =  await db.put(params).promise();
        console.log("documento guardado en Dynamo", JSON.stringify(response));
        return response || null;
    }catch(err){
        throw new Error("Error al obtener datos desde "+tableName,err);
    }
}

module.exports = {
    get_from_dynamo,
    save_to_dynamo
}


