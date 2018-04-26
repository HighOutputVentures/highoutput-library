FROM node:8.11.1-alpine

ENV APP_DIR=/srv/node \
    LOG_DIR=/var/log/node \
    DEBUG=error*,warn*,info*,verbose* \
    TZ=UTC \
    START_SCRIPT=index.js

RUN mkdir -p $APP_DIR && mkdir -p $LOG_DIR

WORKDIR $APP_DIR
COPY ./application $APP_DIR/application
COPY ./config $APP_DIR/config
COPY ./index.js $APP_DIR/index.js
COPY ./package-lock.json $APP_DIR/package-lock.json
COPY ./package.json $APP_DIR/package.json

RUN mkdir -p ${APP_DIR}/template && yarn install

EXPOSE 80

CMD node $START_SCRIPT >> $LOG_DIR/app.log 2>&1