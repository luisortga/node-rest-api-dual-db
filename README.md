# Node REST API Dual Database


<p align="center">

<strong>A RESTful movie API powered by Node.js and Express.js
with interchangeable MySQL and MongoDB persistence.</strong>

</p>


<p align="center">

<a href="https://github.com/luisortga/node-rest-api-dual-db">
<img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github&logoColor=white" alt="GitHub Repository">
</a>
<img src="https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/pnpm-11.x-F69220?logo=pnpm&logoColor=white" alt="pnpm">

</p>


<p align="center">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="58" alt="Node.js">
   
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="58" alt="Express.js">
   
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" width="58" alt="MySQL">
   
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" width="58" alt="MongoDB">
   
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pnpm/pnpm-original.svg" width="58" alt="pnpm">`{=html}
   
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="58" alt="JavaScript">

</p>


------------------------------------------------------------------------

## Overview

**Node REST API Dual Database** is a RESTful API for managing a movie
catalog.

The project is built with Node.js and Express.js and implements the same
REST API with multiple persistence layers. The application can run
against **MySQL**, **MongoDB**, or a local in-memory implementation.

The main goal is to practice backend architecture, REST API design, CRUD
operations, data validation, and the separation between application
logic and database implementations.

``` text
                           REST API
                              │
                         Express.js
                              │
                       MovieController
                              │
                          MovieModel
                         /     |     \
                        /      |      \
                   MySQL   MongoDB   Local
```

## Why two databases?

The API is designed so that the HTTP layer does not need to know which
database is being used.

The same endpoint can be handled by different persistence
implementations:

``` text
                       Same REST API
                            │
                    ┌───────┴───────┐
                    │               │
                  MySQL          MongoDB
                    │               │
              Relational        Document
                 Data              Data
```

For example:

``` http
GET /movies
```

remains the same whether the application is running with MySQL or
MongoDB.

Only the persistence implementation changes.

------------------------------------------------------------------------

## Technology Stack

  ----------------------------------------------------------------------------------------------------
  Technology                                                       Purpose
  ---------------------------------------------------------------- -----------------------------------
  [Node.js](https://nodejs.org/)                                   JavaScript runtime

  [Express.js](https://expressjs.com/)                             REST API framework

  [MySQL](https://www.mysql.com/)                                  Relational database

  [MongoDB](https://www.mongodb.com/)                              NoSQL document database

  [pnpm](https://pnpm.io/)                                         Package manager

  [Zod](https://zod.dev/)                                          Schema and request validation

  [Helmet](https://helmetjs.github.io/)                            HTTP security headers

  [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)   Cross-origin resource sharing

  [Morgan](https://github.com/expressjs/morgan)                    HTTP request logging

  [dotenv](https://github.com/motdotla/dotenv)                     Environment variable management
  ----------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## Features

-   RESTful movie API
-   Complete CRUD operations
-   MySQL persistence
-   MongoDB persistence
-   Local/in-memory persistence
-   Interchangeable database implementations
-   Request validation with Zod
-   Partial validation for `PATCH` requests
-   Movie filtering by genre
-   UUID-based identifiers for MySQL
-   MongoDB ObjectId identifiers
-   CORS middleware
-   Helmet security headers
-   Morgan request logging
-   Environment variable configuration
-   ES Modules
-   pnpm package management
-   Deployment-ready configuration for Render

------------------------------------------------------------------------

## API Endpoints

Base resource:

``` text
/movies
```

### Get all movies

``` http
GET /movies
```

Returns all available movies.

### Filter movies by genre

``` http
GET /movies?genre=Action
```

The genre filter is case-insensitive.

Example:

``` http
GET /movies?genre=action
```

### Get a movie by ID

``` http
GET /movies/:id
```

Example:

``` http
GET /movies/550e8400-e29b-41d4-a716-446655440000
```

The identifier format depends on the selected database implementation.

### Create a movie

``` http
POST /movies
Content-Type: application/json
```

Example request body:

``` json
{
  "title": "Interstellar",
  "year": 2014,
  "director": "Christopher Nolan",
  "duration": 169,
  "rate": 8.6,
  "poster": "https://example.com/interstellar.jpg",
  "genre": [
    "Adventure",
    "Drama",
    "Sci-Fi"
  ]
}
```

### Movie creation example

Example of inserting a movie through the REST API:

```{=html}
<p align="center">
```
`<a href="https://imgur.com/a/jvSMxFC">`{=html} `<img
      src="https://imgur.com/a/jvSMxFC"
      alt="Creating a movie through the REST API"
      width="850"
    >`{=html} `</a>`{=html}
```{=html}
</p>
```
> **GitHub recommendation:** for reliable image rendering, download the
> screenshot and store it inside the repository, for example:
>
> `docs/images/create-movie.png`
>
> Then replace the image above with:
>
> ``` markdown
> <p align="center">
>   <img
>     src="./docs/images/create-movie.png"
>     alt="Creating a movie through the REST API"
>     width="850"
>   >
> </p>
> ```

### Update a movie

``` http
PATCH /movies/:id
Content-Type: application/json
```

Example:

``` json
{
  "rate": 9.0,
  "duration": 170
}
```

`PATCH` supports partial updates, so only the properties that need to be
modified have to be provided.

### Delete a movie

``` http
DELETE /movies/:id
```

Example:

``` http
DELETE /movies/550e8400-e29b-41d4-a716-446655440000
```

------------------------------------------------------------------------

## Movie Schema

Movies are validated with Zod before being persisted.

Example:

``` json
{
  "title": "string",
  "year": 2024,
  "director": "string",
  "duration": 120,
  "rate": 8.5,
  "poster": "string",
  "genre": [
    "Action"
  ]
}
```

Supported genres:

``` text
Action
Adventure
Crime
Comedy
Drama
Fantasy
Horror
Thriller
Sci-Fi
Biography
Biopic
```

The validation layer is shared by the different database
implementations, keeping the API contract consistent.

------------------------------------------------------------------------

## Project Structure

``` text
node-rest-api-dual-db/
│
├── controllers/
│   └── movies.js
│
├── middleware/
│   └── cors.js
│
├── models/
│   ├── mongodb/
│   │   └── movie.js
│   │
│   ├── mysql/
│   │   └── movie.js
│   │
│   └── local/
│       └── movie.js
│
├── routes/
│   └── movies.js
│
├── schemas/
│   └── movies.js
│
├── test/
│
├── web/
│
├── app.js
├── server-with-local.js
├── server-with-mongodb.js
├── server-with-mysql.js
├── package.json
├── pnpm-lock.yaml
├── eslint.config.js
└── .gitignore
```

------------------------------------------------------------------------

## Architecture

The application separates the HTTP layer from the persistence layer.

``` text
Client
  │
  ▼
Express Router
  │
  ▼
MovieController
  │
  ▼
MovieModel
  │
  ├───────────────┬───────────────┐
  ▼               ▼               ▼
MySQL Model   MongoDB Model   Local Model
```

The application receives the database implementation as a dependency:

``` javascript
createApp({ movieModel })
```

This allows the same application layer and REST routes to work with
different persistence implementations.

### Separation of concerns

``` text
Routes
  │
  └── Define HTTP endpoints

Controllers
  │
  └── Handle HTTP requests and responses

Schemas
  │
  └── Validate incoming data

Models
  │
  └── Handle persistence

Databases
  │
  ├── MySQL
  └── MongoDB
```

------------------------------------------------------------------------

## Database Implementations

### MySQL

The MySQL implementation uses `mysql2/promise` and a relational database
model.

Set the following environment variable:

``` env
MYSQL_URI=mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Start the API with:

``` bash
pnpm run start:mysql
```

### MongoDB

The MongoDB implementation uses the official MongoDB Node.js driver.

Set the following environment variable:

``` env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/DATABASE
```

Start the API with:

``` bash
pnpm run start:mongodb
```

### Local

The local implementation can be used without an external database.

``` bash
pnpm run start:local
```

------------------------------------------------------------------------

## Installation

Clone the repository:

``` bash
git clone https://github.com/luisortga/node-rest-api-dual-db.git
```

Navigate into the project:

``` bash
cd node-rest-api-dual-db
```

Install dependencies:

``` bash
pnpm install
```

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root directory.

### MySQL

``` env
MYSQL_URI=mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### MongoDB

``` env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/DATABASE
```

The `.env` file should never be committed to the repository.

------------------------------------------------------------------------

## Running the Project

### Local

``` bash
pnpm run start:local
```

### MySQL

``` bash
pnpm run start:mysql
```

### MongoDB

``` bash
pnpm run start:mongodb
```

The API uses the `PORT` environment variable when available and falls
back to:

``` text
1234
```

Local development:

``` text
http://localhost:1234
```

------------------------------------------------------------------------

## Deployment

The API can be deployed on [Render](https://render.com/).

The same Render service can use either database implementation by
changing the start command.

### MySQL deployment

``` bash
pnpm run start:mysql
```

### MongoDB deployment

``` bash
pnpm run start:mongodb
```

This allows the deployed API to switch its persistence layer without
changing the REST API itself.

### Build command

For pnpm-based deployments:

``` bash
pnpm install --frozen-lockfile
```

The project uses `pnpm-lock.yaml` to keep dependency versions
reproducible.

------------------------------------------------------------------------

## Security

The application includes several production-oriented configurations:

-   Helmet for HTTP security headers
-   CORS middleware
-   Environment variables for database credentials
-   Disabled `x-powered-by` header
-   Input validation with Zod
-   Parameterized MySQL queries

Database credentials and other secrets should always be provided through
environment variables.

------------------------------------------------------------------------

## Development

Install dependencies:

``` bash
pnpm install
```

Run the local implementation:

``` bash
pnpm run start:local
```

Run the MySQL implementation:

``` bash
pnpm run start:mysql
```

Run the MongoDB implementation:

``` bash
pnpm run start:mongodb
```

------------------------------------------------------------------------

## Learning Objectives

This project was built to practice and compare several backend
development concepts:

-   REST API design
-   Express.js
-   CRUD operations
-   MVC-style separation
-   Dependency injection
-   Database abstraction
-   SQL and NoSQL persistence
-   MySQL queries
-   MongoDB queries
-   Data validation
-   Middleware
-   Environment variables
-   API deployment
-   Switching persistence implementations
-   Maintaining the same API contract across different databases

------------------------------------------------------------------------

## Database Switching

One of the main objectives of the project is to demonstrate how the
persistence layer can be replaced without changing the API contract.

``` text
                         REST API
                            │
                  ┌─────────┴─────────┐
                  │                   │
                MySQL              MongoDB
                  │                   │
             Relational            Document
                Data                 Data
```

The client continues to use the same endpoints:

``` http
GET    /movies
GET    /movies/:id
POST   /movies
PATCH  /movies/:id
DELETE /movies/:id
```

Only the server-side persistence implementation changes.

------------------------------------------------------------------------

## Author

Developed by **Luis Ortega**.


<p align="center">
```
<a href="https://github.com/luisortga">
<img src="https://img.shields.io/badge/GitHub-luisortga-181717?logo=github&logoColor=white" alt="GitHub">
</a>

</p>


------------------------------------------------------------------------

## Repository


<p align="center">

<a href="https://github.com/luisortga/node-rest-api-dual-db">
<strong>github.com/luisortga/node-rest-api-dual-db</strong>
</a>

</p>

