# Reto técnico iO - Backend

## Descripción:
Se requiere implementar un sistema el cual simule el abono de saldo a una cuenta y su posterios consulta. A continuación se muestran los diagramas correspondientes:


### Funcionalidad de abono
#### Contexto
![POST-C4-L1](images/POST-C4-L1.drawio.png)
#### Contenedores
![POST-C4-L2](images/POST-C4-L2.drawio.png)
#### Componentes
![POST-C4-L3](images/POST-C4-L3.drawio.png)


Este API debe de llamar a un Step Function el cual debe:
- Validar el id de usuario comparándolo en la tabla **users**
- En caso el usuario exista, un lambda llamado **execute-payment** debe llamar a un API Mock que el postulante debe crear, el cual debe de regresar una transacción exitosa a modo de evento.
- Si la transacción es exitosa, como una siguiente tarea en el Step Function, debe de grabarse un registro en la tabla **transactions**
- De forma asincrona, por medio de DynamoDB Streams, se debe ejecutar un lambda llamado **update-account**, el cual actualizara el saldo de la cuenta a la que se realizo el abono en la tabla **accounts**.
- Al terminar todo de forma exitosa, debe dar una respuesta satisfactoria que contenga el id (source) de la transacción.

---

### Funcionalidad de consulta de cuenta
#### Contexto
![GET-C4-L1](images/GET-C4-L1.drawio.png)
#### Contenedores
![GET-C4-L2](images/GET-C4-L2.drawio.png)
#### Componentes
![GET-C4-L3](images/GET-C4-L3.drawio.png)

Este API debe de llamar a un Lambda Function la cual debe:
- Consultar por id a la tabla **accounts**
- En caso la cuenta exista, debe de regresar el registro.
- En caso la cuenta no exista, debe de regresar una respuesta con el mensaje "Cuenta no encontrada"

## Consideraciones:

### Datos de pruebas (IMPORTANTE):

Ya que no se contara con un servicio para crear las cuentas, estas deberan de ser creadas manualmente en DynamoDB.


### Obligatorio : 
1. Respetar el arquetipo 
2. Construir pruebas unitarias
3. Buenas Prácticas (SOLID, Clean Code, etc)

### Deseable: 
1. Crear los componentes con IaC (Terraform, Cloudformation)
2. Logs usando CloudWatch
3. Formatters / Linters

## Anexos:

### Accounts (DynamoDB Table)
- PK: id (S)


### Transaction (DynamoDB Table)
- PK: source (S)
- SK: id (N)

### Account (Model)
```
{
    "id": "{uuid}",
    "amount": "{number}"
}
```

### Transaction (Model)
```
{
    "source": "{uuid}",
    "id": "{id}",
    "data": {
        "accountId": "{id}",
        "amount": "{number}"
    }
}
```

### POST /v1/payments

Payload
```
{
    "accountId": "f529177d-0521-414e-acd9-6ac840549e97",
    "amount": 30
}
```

Respusta OK (201)
```
{
    "message": "Payment registered successfully",
    "transactionId": "8db0a6fc-ad42-4974-ac1f-36bb90730afe"
}
```

Respuesta errada (400)
```
{
    "message": "Something was wrong"
}
```

### GET /v1/accounts/{accountId}

Path Params
```
accountId: "8db0a6fc-ad42-4974-ac1f-36bb90730afe"
```

Respusta OK (200)
```
{
    "id": "8db0a6fc-ad42-4974-ac1f-36bb90730afe",
    "amount": "30",
}
```

Respuesta errada (404)
```
{
    "message": "Account not found"
}
```


## Send us your challenge
Cuando termines el reto, luego de forkear el repositorio, debes crear un pull request to our repository indicando en la descripción de este tu nombre y correo.

### Tiempo de resolución: 3 días