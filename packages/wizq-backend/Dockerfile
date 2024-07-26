FROM node:latest AS builder

# Create app directory
WORKDIR /app
COPY package.json .
COPY . .
# Install app dependencies
RUN npm i
RUN npm run build
RUN ls
EXPOSE 3001
CMD npm run prisma:generate && npm run seed && npm run prisma:migrate:deploy && npm run start:prod
