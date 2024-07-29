FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD ["npm","--json","run","dev","--","-p","8888"]