FROM bitnami/nginx
USER root
RUN rm -Rf /app/*
USER 1001
COPY build/www /app
COPY build/nginx.conf /opt/bitnami/nginx/conf/server_blocks/