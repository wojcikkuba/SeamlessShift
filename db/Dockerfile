FROM mysql:latest

ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=db_user
ENV MYSQL_PASSWORD=password
ENV MYSQL_ROOT_PASSWORD=password

EXPOSE 3306
COPY ./seamless_shift_dev.sql   ./docker-entrypoint-initdb.d/

# docker run -dt --rm -p 3306:3306 --name cont2 dbdev --default-authentication-plugin=mysql_native_password