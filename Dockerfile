# Étape 1 : Utiliser une image Node pour construire les fichiers de production
FROM node:20-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers source Angular dans le conteneur
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construire l'application Angular
RUN npm run build

# Étape 2 : Utiliser une image Nginx pour servir l'application
FROM nginx:1.25.2-alpine

# Copier les fichiers construits vers le dossier Nginx par défaut
COPY --from=builder /app/dist/olympic-games-starter /usr/share/nginx/html

# Copier un fichier de configuration personnalisé pour Nginx (facultatif)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx comme processus principal
CMD ["nginx", "-g", "daemon off;"]

