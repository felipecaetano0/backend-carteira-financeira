FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY tests/ ./tests/
COPY jest.config.js/ ./jest.config.js/

RUN npm install
RUN npm run build
COPY src/dados ./dist/src/dados/

EXPOSE 9999

RUN npm install

CMD ["npm", "run", "start"]