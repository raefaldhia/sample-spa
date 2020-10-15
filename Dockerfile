FROM ubuntu:latest

RUN apt-get update \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app