FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN RUN apt-get --assume-yes install yarn && apt-mark hold yarn 

COPY . .

EXPOSE 9000
CMD ["yarn", "start"]
