FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app

# Moverse a la carpeta de la app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json inside the actual directory
COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
