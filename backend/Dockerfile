FROM    node:lts-alpine As production

WORKDIR /usr/src/app

COPY    package*.json ./

RUN     npm ci

COPY    . /usr/src/app/

ENV     NODE_ENV development

CMD     [ "npm", "run", "start:prod" ]
