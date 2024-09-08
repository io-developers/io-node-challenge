# Reto técnico iO - Backend

## Descripción

Este proyecto implementa un sistema que simula el abono de saldo a una cuenta y su posterior consulta. Se han desarrollado tres microservicios siguiendo la arquitectura limpia (Clean Architecture) para la estructuración del código y scaffolding:

- **API Mock**: Simula la respuesta de una transacción exitosa.
- **Accounts Service**: Gestiona las operaciones relacionadas con las cuentas.
- **Transactions Service**: Gestiona las operaciones relacionadas con las transacciones.

## Estructura del Proyecto

El proyecto sigue la arquitectura limpia, separando las responsabilidades en diferentes capas para mantener un código limpio y mantenible.

## Instrucciones

### Pruebas Unitarias

Para ejecutar las pruebas unitarias, ubíquese en la carpeta del microservicio deseado y ejecute el siguiente comando:

```sh
npm run test
```
### Linters

Para ejecutar los linters, ubíquese en la carpeta del microservicio deseado y ejecute el siguiente comando:

```sh
npm run lint
```
### Compilación de TypeScript a JavaScript

Esto es necesario para el posterior zipeo previo a la actualización de dependencias con npm install.

### Despliegue

El despliegue de los Lambdas, Step Functions y API Gateway se realizó utilizando Terraform. En la carpeta terraform se encuentra la configuración necesaria para desplegar toda la infraestructura requerida. Modifique los parámetros de configuración adaptándolos a sus propios parámetros de AWS o utilice los preestablecidos que vienen de mi cuenta de pruebas de AWS.

Comandos para despliegue:

```sh
terraform plan
terraform apply
```

### Zipeo

Es requerido zipear los proyectos que se usaran para las lambdas function a desplegar, para ello solo se tomara el contenido de
las carpetas dist que se generan con todo el código transpilado a Javascript.
Utilizar de preferencia la ruta lambda_zip para poder guardar los archivos zip que luego se referenciaran en el archivo de
configuración de lambdas de terraform, ubicados en la carpeta con el mismo nombre. 

### Configuración AWS

Revisar el archivo variables.tf ubicado en la carpeta terraform, colocar los parámetros de conexión para usar los servicios de AWS: Como Clave de Acceso y Clave Secreta de Acceso

```sh
variable "region" {
  default = "us-west-2" #Colocar la región de AWS que usarás
}

variable "access_key" {
  default = ""  #Colocar tu Access Key de AWS
}

variable "secret_access_key" {
  default = ""  #Colocar tu Secret Key de AWS
}

variable "account_table_name" {
  default = "accounts" #Nombre de la tabla dynamoDB para cuentas de usuario
}

variable "transaction_table_name" {
  default = "transactions" #Nombre de la tabla dynamoDB para transacciones
}

variable "devops_role_arn" {
  description = "ARN of the existing IAM role for Lambda"
  type        = string
  default = "arn:aws:iam::772466482736:role/devops" #ARN del rol que usarás para utilizar los servicios AWS
}
```

### Datos de Prueba

A continuación, se adjuntan algunos accountId para pruebas:
. 123e4567-e89b-12d3-a456-426614174000
. 123e4567-e89b-12d3-a456-426614174001
. 123e4567-e89b-12d3-a456-426614174005

### Hecho por
Jonathan Reyna
[GitHub](https://github.com/jhonlpjr)