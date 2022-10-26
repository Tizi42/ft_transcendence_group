FROM    node:lts-alpine As production

WORKDIR /usr/src/app

COPY    package*.json ./

RUN     npm ci

COPY    . /usr/src/app/

CMD     [ "npm", "run", "start:prod" ]
