FROM cloudron/node-base:24-20260920@sha256:d984683ec59bf2379130bf41cf3c2b6bc0453f327297d7183525cb05424e7b34
ARG SSH_PORT=2222
ENV SSH_PORT=${SSH_PORT}

RUN apt-get update && apt-get -y install openssh-server git wget iproute2 curl rsync nmap

RUN useradd --comment "Worker User" --create-home --shell /bin/bash worker
RUN passwd -d worker # by default, account is created as inactive which prevents login via openssh. this disables password for account
ADD worker/ /home/worker/
# Make hardwired links in worker home directory (start.sh should create these on startup)
RUN ln -sfn /run/worker/bash_history ~worker/.bash_history && \
    ln -sfn /run/worker/npm ~worker/.npm && \
    ln -sfn /app/data/worker/.ssh ~worker/.ssh && \
    ln -sfn /app/data/worker/data ~worker/data

# add supervisor configs
ADD supervisor/* /etc/supervisor/conf.d/

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


