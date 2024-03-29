FROM ubuntu:22.04 as base
WORKDIR /src
ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update && apt-get install -y build-essential curl vim nano git git-lfs unzip zip ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g yarn node-gyp


# Docker CLI
RUN install -m 0755 -d /etc/apt/keyrings && \
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
  chmod a+r /etc/apt/keyrings/docker.asc && \
  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  apt-get update && \
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# AWS CLI
RUN curl https://awscli.amazonaws.com/awscli-exe-linux-$(arch).zip -o awscliv2.zip \
  && unzip awscliv2.zip \
  && ./aws/install \
  && rm -rf aws awscliv2.zip

COPY .bashrc .profile .git-completion .yarnrc.yml /root/
