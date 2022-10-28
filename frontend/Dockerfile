FROM    node:lts-alpine

WORKDIR /usr/src/app

COPY    . /usr/src/app/

RUN     npm install -g vite@latest

RUN     npm ci

CMD     [ "npm", "run", "prod" ]
