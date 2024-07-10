# Serverless App

You should first review the technical challenge so you have more context. Go to: [Readme page](README.md)

### Requirements
- SAM
- AWS CLI
- CDK (Cloud Development Kit)
- Node.js
- Typescript

### Arquitecture
Let's take a look at the directory structure

1. The infraestructure as code is in `iac` directory
2. The lambdas are in `src` and the modules are distributed using the cqrs pattern

### Run locally
First you must install the dependencies in both project iac and the main package and run:
`npm install`

Now you can try the endpoints using SAM:
`sam local start-api`

### Deploy
If you want to deploy this project, run the following commands:
1. `npm run build`
2. `cd iac`
3. `cdk bootstrap`
4. `cdk deploy`

### Playground
This project is available on these endpoints:
- `GET https://wwarlsw6l1.execute-api.us-east-1.amazonaws.com/dev/v1/transactions?transactionId={transactionId}`
- `POST https://wwarlsw6l1.execute-api.us-east-1.amazonaws.com/dev/v1/payments`
- `POST https://wwarlsw6l1.execute-api.us-east-1.amazonaws.com/dev/v1/payment-processor`
