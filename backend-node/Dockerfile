FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# wait-for.sh scriptini kopyala ve çalıştırılabilir yap
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

# MYSQL CLIENT YÜKLENİYOR
RUN apt-get update && apt-get install -y default-mysql-client

CMD ["/wait-for.sh", "db", "npm", "start"]
