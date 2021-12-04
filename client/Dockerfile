# specify base image
FROM node:alpine

# set working directory to '/app' in container
WORKDIR /app
# copy only package.json file
COPY package.json ./
# install all dependencies
RUN npm install
# copy remaining source code from post directory
COPY ./ ./

# set default command to run when the container starts up
CMD ["npm", "start"]

# FROM node:16-alpine
# docker kill $(docker ps -q)
# docker rm $(docker ps -a -q)
# docker rmi $(docker images -q)