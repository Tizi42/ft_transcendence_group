##########################
#   target - dev - 42    #
##########################

FROM    node:lts-alpine As dev

WORKDIR /usr/src/app

COPY    package*.json ./

RUN     npm install

COPY    . /usr/src/app/

CMD     [ "npm", "run", "dev" ]

###############################
#   target - dev - your pc    #
###############################

FROM    node:lts-alpine As home

WORKDIR /usr/src/app

COPY    --chown=node:node package*.json /usr/src/app/

RUN     npm ci \
        && chown -R node /usr/src/app/* \
        && chmod -R 755 /usr/src/app/*

COPY    --chown=node:node . /usr/src/app/

USER    node

CMD     [ "npm", "run", "dev" ]

###############################
#   target - prod - your pc   #
###############################

FROM    node:lts-alpine As production

WORKDIR /usr/src/app

COPY    --chown=node:node package*.json /usr/src/app/

RUN     npm ci \
        && chown -R node /usr/src/app/* \
        && chmod -R 755 /usr/src/app/*

COPY    --chown=node:node . /usr/src/app/

USER    node

CMD     [ "npm", "run", "serve" ]
