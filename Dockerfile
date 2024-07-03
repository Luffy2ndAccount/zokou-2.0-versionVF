FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*
  
RUN git clone https://github.com/FaouzKK/zokou-french-version-whatsapp-bot  /root/my_app
WORKDIR /root/my_app/


COPY package.json .
RUN npm install -g npm@10.2.4
RUN npm install pm2 -g
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8000

CMD ["npm","run","clever"]
