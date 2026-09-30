FROM cloudron/node-base:24-20260920@sha256:d984683ec59bf2379130bf41cf3c2b6bc0453f327297d7183525cb05424e7b34

RUN apt-get update && apt-get -y install openssh-server git wget iproute2 curl rsync nmap

RUN mkdir -p /app/code
WORKDIR /app/code

# install typescript
RUN npm install -g typescript

# copy code
COPY . /app/code

# install packages
RUN npm install

# compile typescript
RUN tsc --build tsconfig.json

CMD [ "/app/code/start.sh" ]


