FROM    node:lts-alpine As production

WORKDIR /usr/src/app

COPY    package*.json ./

RUN     npm ci

COPY    . /usr/src/app/

<<<<<<< Updated upstream
ENV     NODE_ENV development

=======
>>>>>>> Stashed changes
CMD     [ "npm", "run", "start:dev" ]
