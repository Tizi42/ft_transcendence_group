######################
#   target - dev     #
######################

FROM    node:lts-alpine As dev

WORKDIR /usr/src/app

COPY    package*.json ./

RUN     npm install

COPY    . /usr/src/app/

CMD     [ "npm", "run", "serve" ]