FROM node:alpine

# Target App Directory. Base directory
WORKDIR /client

# Copy to base directory
COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]