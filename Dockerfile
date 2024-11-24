# Usar a imagem oficial do Node.js como base
FROM node:16

# Criar o diretório de trabalho no container
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código do backend para o diretório de trabalho
COPY . .

# Expor a porta que o backend irá rodar
EXPOSE 3000

# Comando para rodar o backend
CMD ["npm", "run", "start"]