# Utilisation de l'image Node.js basée sur Debian Buster
FROM node:lts-buster

# Mise à jour et installation des paquets requis
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \ 
  imagemagick \ 
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Clonage du dépôt GitHub
RUN git clone https://github.com/Luffy2ndAccount/zokou-2.0-versionVF /root/my_app

# Définition du répertoire de travail
WORKDIR /root/my_app/

# Copie du fichier package.json pour installer les dépendances
COPY package.json .
RUN npm install pm2 -g && \
  npm install

# Copie des fichiers de l'application dans l'image Docker
COPY . .

# Ouverture du port 8000
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["npm", "run", "web"]

