# Based on https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html
# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
#COPY nginx-conf-d/ /etc/nginx/conf.d/

EXPOSE 80
EXPOSE 9180

CMD ["nginx", "-g", "daemon off;"]
