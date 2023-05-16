FROM node:alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm i --legacy-peer-deps

# Bundle app source
COPY . /app

EXPOSE 3000

CMD [ "npm", "run" , "dev" ]