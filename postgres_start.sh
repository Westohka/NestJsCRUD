#!/bin/bash

set -e

SERVER="postgresServer";
PW="password";
DB="database";

(docker kill $SERVER || :) && (docker rm $SERVER || :) && docker run --name $SERVER -e POSTGRES_PASSWORD=$PW -p 5432:5432 -d postgres

SLEEP 3;

# create the db 
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres