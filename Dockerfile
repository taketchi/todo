FROM node:latest

WORKDIR /var/www

RUN apt update
RUN apt -y install locales
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

RUN apt install -y vim

RUN npm install -g npm@latest && npm install create-next-app