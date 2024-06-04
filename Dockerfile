FROM node:18-alpine

WORKDIR /App/

COPY frontend/public/ /App/frontend/public
COPY frontend/src/ /App/frontend/src
COPY frontend/package.json /App/frontend/
COPY frontend/.env.development /App/frontend/
COPY frontend/.env.production /App/frontend/

WORKDIR /App/frontend
RUN npm install
RUN npm run build

WORKDIR /App/
COPY Server/Models /App/Server/Models
COPY Server/Routes /App/Server/Routes
COPY Server/server.js /App/Server/
COPY Server/package.json /App/Server/
COPY Server/.env /App/Server/

WORKDIR /App/Server
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "server"]