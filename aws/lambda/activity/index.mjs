import pkg from "aws-sdk";
import { HTTP_CODES } from "./helpers/http/helpers-http.mjs";
import { EVENTS } from "./helpers/events/events-helpers.mjs";
import { TABLES } from "./helpers/tables/tables-helpers.mjs";
const { DynamoDB } = pkg;

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log(`Evento recibido: ${JSON.stringify(event, null, 2)}`);

  try {
    for (const record of event.Records) await processRecord(record);

    console.log("Procesamiento completado con éxito");
    return {
      statusCode: HTTP_CODES.OK,
      body: JSON.stringify("Procesamiento completado con éxito")
    };
  } catch (error) {
    console.error("Error en el procesamiento:", error);
    return {
      statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        error: `Error en el procesamiento: ${error.message}`
      })
    };
  }
};

async function processRecord(record) {
  const eventName = record.eventName;

  let item;
  if (eventName === EVENTS.INSERT || eventName === EVENTS.MODIFY)
    item = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
  else if (eventName === EVENTS.REMOVE)
    item = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
  console.log(`Procesando ${eventName}:`, JSON.stringify(item));
  await registerActivity(item, eventName);
}

async function registerActivity(item, eventType) {
  const activityItem = {
    activityId: `${item.transactionId}_${Date.now()}`,
    originalItemId: item.transactionId,
    eventType: eventType,
    timestamp: new Date().toISOString(),
    details: JSON.stringify(item)
  };

  const params = {
    TableName: TABLES.ACTIVITY,
    Item: activityItem
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Actividad registrada:, ${JSON.stringify(activityItem)}`);
  } catch (error) {
    console.error(`Error al registrar la actividad: ${error}`);
    throw error;
  }
}
