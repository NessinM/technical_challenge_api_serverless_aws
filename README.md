# Star Wars API Serverless

API Serverless que integra SWAPI, permite gestionar naves espaciales y personajes con almacenamiento en AWS DynamoDB.

## Características

- Integración con SWAPI (Star Wars API -> https://swapi.py4e.com)
- Integración con AWS DynamoDB
- Almacenamiento en AWS DynamoDB
- Documentación OpenAPI/Swagger
- Pruebas unitarias con Jest
- Traducción de campos inglés-español

## Endpoints

- GET /personajes - Obtiene lista de personajes desde Star Wars API
- GET /personajes/pagina/{page} - Obtiene lista de personajes por pagina desde Star Wars API
- GET /personajes/buscar/{name} - Obtiene lista de personajes por nombre desde Star Wars API
- POST /naves - Crea una nueva nave espacial desde AWS DynamoDB
- GET /naves - Obtiene lista de naves espaciales creadas desde AWS DynamoDB
- GET /naves/{id} - Obtiene el detalle de una nave espacial desde AWS DynamoDB
- GET /naves/buscar?fabricante={text} - Obtiene lista de naves coincidentes con un termino desde AWS DynamoDB

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

## Pruebas

```bash
npm run test
```

## Despliegue a prod

```bash
npm run deploy
```

## Estructura del Proyecto

```
.
├── src/
│   ├── handlers/        # Manejadores de Lambda
│   └── utils/           # Utilidades y helpers
│   └── services/        # Servicios de AWS y recursos
├── tests/               # Pruebas unitarias
│   ├── naves.test
│   └── personajes.test
├── serverless.yml       # Configuración de Serverless
├── swagger.yml          # Documentación OpenAPI
└── README.md
```

## Modelo de Datos

### Nave Espacial

```json
{
  "id": "string",
  "nombre": "string",
  "modelo": "string",
  "fabricante": "string",
  "costoEnCreditos": "number",
  "longitud": "string",
  "velocidadMaximaAtmosfera": "string",
  "tripulacion": "string",
  "pasajeros": "string",
  "capacidadCarga": "string",
  "consumibles": "string",
  "clase": "string",
  "estado": "string",
  "creado": "string (datetime)",
  "editado": "string (datetime)"
}
```

### Personaje

```json
{
  "nombre": "string",
  "altura": "string",
  "masa": "string",
  "colorCabello": "string",
  "colorPiel": "string",
  "colorOjos": "string",
  "periodoNacimiento": "string",
  "genero": "string",
  "mundoNatal": "string (URL)",
  "peliculas": "array (string[] de URLs)",
  "especies": "array (string[] de URLs)",
  "vehiculos": "array (string[] de URLs)",
  "navesEstelares": "array (string[] de URLs)",
  "creado": "string (datetime)",
  "editado": "string (datetime)",
  "enlace": "string (URL)"
}
```
