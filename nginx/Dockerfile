FROM node:22-alpine AS frontend-build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_CDN_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend ./
RUN npm run build

FROM nginx:1.27-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend-build /app/dist/ /usr/share/nginx/html/
