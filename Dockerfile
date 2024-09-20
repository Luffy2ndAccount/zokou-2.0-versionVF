FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*
  
RUN git clone https://github.com/Luffy2ndAccount/zokou-2.0-versionVF  /root/my_app
WORKDIR /root/my_app/


COPY package.json .
RUN npm install pm2 -g
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm","run","web"]
