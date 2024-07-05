const headersResponse = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
    'Access-Control-Allow-Origin': '*'
}

const generateResponse = (statusCode, body) => {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        headers: headersResponse,
        body: JSON.stringify(body)
    };
}

const fixBody = (event) => {
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body);
    }
    event.fixed = true;
    return event;
}

module.exports = {
    generateResponse,
    fixBody
};