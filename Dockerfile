FROM node:4-onbuild
EXPOSE 1337
RUN mkdir -p /tmp/uploads
VOLUME /tmp/uploads
