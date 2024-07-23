export class UtilsLambda {

  static getRequestController(event: any) {
    let body = event.body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    }
    return {
      action: body.action,
      request: body
    };
  }

  static getRequestStremDynamoDB(event: any) {
    const record = event.Records[0];
    return {
      eventName: record.eventName,
      dynamodb: record.dynamodb
    };
  }

  static getResponseLambda(response: any) {
    return {
      statusCode: 200,
      response,
    };
  }

  static getResponseLambdaError(error: any) {
    const message = error.message || 'Ocurrió un error inesperado';
    return {
      statusCode: 500,
      response: { message },
    };
  }

}