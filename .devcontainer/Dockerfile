FROM node:24-bookworm-slim


# Instalar dependencias esenciales, git, curl, zsh y Java (necesario para Ionic/Capacitor Android)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git \
        curl \
        zsh \
        sudo \
        ca-certificates \
        openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

# Crear el usuario no root con el UID/GID 1000 y Zsh como shell por defecto

# Instalar Angular CLI e Ionic CLI de manera global para el entorno
RUN npm install -g @angular/cli @ionic/cli
