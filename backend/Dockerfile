##################
# Stage 1: Build #
##################
FROM node:18.16.0 as build

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build




#######################
# Stage 2: Migrations #
#######################
FROM node:18.16.0 as migrations

WORKDIR /app

COPY package*.json yarn.lock ./
RUN apt-get update && apt-get install -y postgresql-client

RUN yarn install

# Copy the compiled JavaScript from the build stage
COPY --from=build /app/dist /app/dist

# Run the migrations
CMD ["npx", "knex", "migrate:latest", "--knexfile", "dist/database/knexfile.js"]




#####################
# Stage 3: Run prod #
#####################
FROM node:18.16.0 as production

WORKDIR /app

COPY package*.json yarn.lock ./

# Copy the compiled JavaScript from the build stage
COPY --from=build /app/dist /app/dist

# Install production dependencies
RUN yarn install --production

# Set the start command
CMD ["node", "dist/index.js"]




####################
# Stage 4: Run dev #
####################
FROM node:18.16.0 as development

WORKDIR /app

COPY package*.json yarn.lock ./

# Copy the compiled JavaScript from the build stage
COPY --from=build /app/dist /app/dist

# Install production dependencies
RUN yarn install

# Set the start command
CMD ["yarn", "dev"]