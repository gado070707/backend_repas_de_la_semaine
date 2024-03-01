# Utilisez une image de base légère
FROM node:14-alpine

# Créez un répertoire de travail
WORKDIR /app

# Copiez les fichiers nécessaires dans le conteneur
COPY backend_repas_de_la_semaine/ ./
#VOLUME /home/rudy/docker/repas_de_la_semaine/developpement/back/backend_repas_de_la_semaine
RUN npm install
#RUN npm install -g nodemon
#RUN npm install -g cookie-parser

# Copiez le reste des fichiers
#COPY . .

# Exposez le port que votre application Node.js utilise
EXPOSE 8585

# Commande pour démarrer votre application
CMD [ "npm", "start" ]
