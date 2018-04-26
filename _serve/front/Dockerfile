FROM node:carbon
ADD ./ /front
WORKDIR /front
RUN npm install -g serve
CMD ["serve", "-s", "--port", "3000", "./public"]