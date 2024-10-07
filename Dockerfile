FROM node:20

WORKDIR /app

RUN apt-get --assume-yes install yarn && apt-mark hold yarn 
COPY . .

RUN yarn install
COPY package.json yarn.lock ./


EXPOSE 9000
CMD ["yarn", "start"]
