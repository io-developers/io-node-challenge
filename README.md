# Backend

## 1. Instalacion

### Instalar
```
npm install
```

### Modificar archivo serverless.yaml
Ve a la línea 48 y reemplazar 1234567890 por la cuenta AWS donde se va desplegar el proyecto.
```
accountId: 1234567890
```

### Desplegar
```
npm run deploy
```
En la cuenta AWS se crearán los recursos:

| Recurso           | Nombre                      |
|-----------------  |---------------------------- |
| Cloudformation    | *PAYBALANCE-IO*             |
| IAM Rol           | *PayBalanceLambdaRole*      |
| IAM Política      | *PayBalanceLambdaPolicy*    |
| Step Function     | *execute-payment-stf*       |
| Api Gateway       | *PayBalanceApi*             |
| Lambda            | *execute-payment*           |
| Lambda            | *update-account*            |
| Lambda            | *get-account*               |
| DynamoDb          | *Accounts*                  |
| DynamoDb          | *Transaction*               |


## 2. Preparar ambiente AWS
### Implementar Api Gateway
* 1) Implementar manualmente el api gateway **PayBalanceApi**.
* 2) Copiar URL de invocación.
* 3) Modificar archivo **serverless.yaml**

        Ve a la línea 68 y reemplazar https://123ABC123.execute-api.us-east-2.amazonaws.com/desa por la ruta del api fake Transactions.
        ```
        fakeApiTransaction: https://123ABC123.execute-api.us-east-2.amazonaws.com/desa
        ```

* 4) Desplegar, para actualizar **ENV** en lambdas. (****Importante***)
        ```
        npm run deploy
        ```

### Registrar cuenta en tabla **Accounts**.
```
{
  "id": {
    "S": "914803b2-c865-4973-8dd2-8615b3710f08"
  },
  "amount": {
    "N": "1992"
  }
}
```

## 3. Ambiente Local

### Inicializar
```
npm run start
```

### Ejecutar test
```
npm run test
```