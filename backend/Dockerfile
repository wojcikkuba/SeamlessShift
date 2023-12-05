FROM python:3.10.13-alpine3.18
EXPOSE 5000
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Remove `sleep` after migrating from mysql to postgres 
CMD sleep 100 && flask run --host 0.0.0.0
