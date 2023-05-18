# Challenge: Parcels System

This repository showcases my skills using TypeScript, Node.js, React, and Next.js. It includes an implementation of a parcel handling system for a delivery company.

## Challenge Description

The challenge is to develop an automated system for handling parcels within a delivery company. The system should assign parcels to different departments based on their weight and value. Detailed requirements can be found in the [challenge-description.md](challenge-description.md) file.

## Project Overview

The project consists of a backend and a frontend application. The frontend is currently under development.

### Backend

The backend application is built with Node.js and TypeScript. It handles server-side logic, database interactions, and API endpoints. The backend uses a PostgreSQL database and can be run using Docker.

To set up the backend, follow these steps:

1. Install the dependencies: `cd backend && yarn && cd ..`
2. Ensure Docker is installed and running on your machine.
3. Start the backend server in development mode: `yarn dev:backend` (run this command from the root of the project)

There are several scripts in the `package.json` file at the root level for running tests and watching for changes. To run the tests, both unit and integration, use `yarn test:backend`.

For development, it's recommended to keep the tests running in the background using `yarn watch:backend`. This command continuously runs the tests and provides immediate feedback on any issues.

Running `yarn dev:backend` also sets up an adminer service running on port 8080. You can access the adminer interface by visiting `http://localhost:8080` and logging in with the following credentials:

- System: PostgreSQL
- Server: db
- Username: user
- Password: password
- Database: parcels

The `.nvmrc` file specifies the Node.js version used in the project. If you're using nvm, you can switch to the correct version by running `nvm use` in the project directory.

By default the backend runs in port 3001.

## Backend Endpoints

The backend exposes the following endpoints:

- `GET /health`: Check the health of the application.

- `POST /api/companies`: Create a new company.
- `GET /api/companies`: Get a list of all companies.
- `GET /api/companies/:companyId`: Get details of a specific company.

- `POST /api/companies/:companyId/business-rules`: Create business rules for a company.
- `GET /api/companies/:companyId/business-rules`: Get business rules for a company.

- `POST /api/companies/:companyId/containers`: Create a new container for a company.
- `GET /api/companies/:companyId/containers`: Get a list of containers for a company.
- `GET /api/companies/:companyId/containers/:containerId`: Get details of a specific container.

- `PUT /api/companies/:companyId/containers/:containerId/parcels/process`: Process the parcels in a container.
- `GET /api/companies/:companyId/parcels/:parcelId`: Get details of a specific parcel.

## File Structure

The backend project follows a component-based structure:

- `src/components`: Contains different components of the application, such as containers, parcels, and companies.
  - `validation.ts`: Contains input validations for data coming from external sources.
  - `logic.ts`: Implements the business logic of the component.
  - `routes.ts`: Exposes the API endpoints and handles HTTP-level logic.
  - `dal.ts`: Interacts with the database using the Data Access Layer.

Then, a typical flow involves receiving a request in the middleware defined in `routes.ts`, running validations by importing them from `validation.ts`, and then calling a function from `logic.ts`. This approach ensures that the data received by `logic.ts` is of the expected shape and can be trusted. The `logic.ts` file solely interacts with the data through the Data Access Layer (DAL).

Migrations for the database are located in `src/database/migrations` and are performed using Knex. The migrations are executed automatically before starting the backend server.

## Debugging with Visual Studio Code

The project is configured for debugging with Visual Studio Code. To debug the backend server, use the provided launch configuration. Set breakpoints in your code and start the debugging session to step through the code and inspect variables.

## Next Steps

The next steps for the project involve developing a user interface using Next.js to provide a seamless frontend experience.

Please note that this project is an implementation of a coding challenge and is meant for demonstration purposes only.
