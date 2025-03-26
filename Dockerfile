FROM node:20

WORKDIR /App/



WORKDIR /App/
COPY Server/models /App/Server/models
COPY Server/server.js /App/Server/
COPY Server/package.json /App/Server/

WORKDIR /App/Server
RUN npm install

COPY Frontend/. /App/Frontend/
WORKDIR /App/Frontend
RUN npm install
RUN npm run build


WORKDIR /App/Server
EXPOSE 5000
CMD ["npm", "run", "server"]