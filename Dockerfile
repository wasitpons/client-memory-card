FROM node:12
RUN apt-get update -qq && apt-get upgrade -y
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV APP_HOME=/usr/src/app
COPY constants.js $APP_HOME
COPY package.json $APP_HOME
COPY package-lock.json $APP_HOME
RUN npm install
ADD . $APP_HOME
RUN npm run build
CMD ["npm", "start"]

