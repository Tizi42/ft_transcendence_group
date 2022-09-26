######################
#   target - dev     #
######################

FROM    node:lts-alpine As dev

WORKDIR /usr/src/app

COPY    --chown=node:node package*.json /usr/src/app/

RUN     npm ci \
        && chown -R node /usr/src/app/* \
        && chmod -R 755 /usr/src/app/*

COPY    --chown=node:node . /usr/src/app/

USER    node

CMD     [ "npm", "run", "serve" ]