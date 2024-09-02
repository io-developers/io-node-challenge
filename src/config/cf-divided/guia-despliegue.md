# Cómo utilizar estos archivos
Para utilizar estos archivos en conjunto, puedes desplegar cada uno de ellos de la siguiente manera:

### 1. Usa AWS CLI para desplegar cada archivo de CloudFormation individualmente:

```aws cloudformation deploy --template-file step-functions.yaml --stack-name my-step-functions-stack
aws cloudformation deploy --template-file lambdas.yaml --stack-name my-lambdas-stack
aws cloudformation deploy --template-file dynamodb.yaml --stack-name my-dynamodb-stack
aws cloudformation deploy --template-file api-gateway.yaml --stack-name my-api-gateway-stack
```

### 2. Utiliza una herramienta de despliegue que soporte la gestión de múltiples archivos CloudFormation, como AWS SAM o AWS CDK, si prefieres una solución más integrada.

#### Dividir el archivo en partes hace que sea más fácil gestionar, entender y mantener tu infraestructura en la nube.
