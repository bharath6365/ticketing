FROM node:alpine

# Target App Directory. Base directory
WORKDIR /app

# Copy to base directory
COPY package.json .

# Ignore dev dependencies which are added for testing.
RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]