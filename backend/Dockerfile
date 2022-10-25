######################
#   target - dev     #
######################

FROM    node:lts-alpine As dev
WORKDIR /usr/src/app
COPY    package*.json ./
RUN     npm install
COPY    . /usr/src/app/
ENV     NODE_ENV development
CMD     [ "npm", "run", "start:dev" ]

#################################
#   target - build for prod     #
#################################

FROM    node:lts-alpine As build
WORKDIR /usr/src/app
COPY    --chown=node:node package*.json /usr/src/app/
COPY    --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY    --chown=node:node . /usr/src/app/
RUN     npm ci --only=production \
        && npm cache clean --force \
        && chown -R node /usr/src/app/* \
        && chmod -R 755 /usr/src/app/*
ENV     NODE_ENV production
USER    node
CMD     [ "npm", "run", "build" ]

#######################
#   target - prod     #
#######################

FROM    node:lts-alpine As production
COPY    --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY    --chown=node:node --from=development /usr/src/app/dist ./dist
CMD     [ "npm", "run", "start:prod" ]
