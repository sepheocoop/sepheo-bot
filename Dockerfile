
# Useful hints used here:
# https://adambrodziak.pl/dockerfile-good-practices-for-node-and-npm
# As well as from:
# https://docs.docker.com/build/building/multi-stage/

# Note: Cloudron docker build does not seem to understand heredocs!

ARG BASE_VERSION=24-20260920@sha256:d984683ec59bf2379130bf41cf3c2b6bc0453f327297d7183525cb05424e7b34

######################################################################
# Install the base image for building upon, and label it "base-build"
# We're using Docker multi-stage builds, which occur when multiple
# FROM clauses exist. Only the last one is used as a base for the
# image, and later stages can be built on earlier (labelled) ones.
FROM cloudron/node-base:${BASE_VERSION} AS base-build
# Set up the base-build stage.

WORKDIR /app/code

# Make the code directory
RUN mkdir -p /app/code/sebheo

# Install apt dependencies
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install openssh-server git wget iproute2 curl rsync nmap

# Now set up supervisord
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

# add start.sh
ADD ./start.sh /app/code

######################################################################
# Now start a transient build stage on top of this, to be discarded
FROM base-build AS transient-build

# Default NODE_ENV=production, but can be overriden by caller.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy in the package files and use them to install dependencies
# first, as they change less often than code, and can be cached in an
# image which is reused if the package files don't change.
COPY package.json package-lock.json /app/code/

# Build
RUN cd /app/code && NODE_ENV=development npm ci

# Now copy the source in. Note, our .dockerignore should exclude
# ephemeral and development files, such as node_modules/ and dist/
# dirs
COPY . /app/code

# Compile the source into dist/
RUN npm run build

######################################################################
# This is the last build stage, so the image we'll keep. It excludes
# all the intermediate build files.
FROM base-build AS final-build
ARG SSH_PORT=2222
ENV SSH_PORT=${SSH_PORT}

# Copy in the compiled application code
COPY --from=transient-build /app/code/dist /app/code/sebheo/


# And define the start script
CMD [ "/app/code/start.sh" ]

