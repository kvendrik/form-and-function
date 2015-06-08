if [ ! -z "$(forever list | grep form-and-function)" ]; then
    printf '\n>> Stopping server\n'
    forever stop form-and-function
fi

printf '\n>> Deleting previous log file\n'
rm /root/.forever/form-and-function.log

printf '\n>> Starting server\n'
MONGO_PORT=27017 forever --uid "form-and-function" --watch start server.js