if [ ! -z "$(forever list | grep form-and-function)" ]; then
    forever stop form-and-function
fi
MONGO_PORT=27017 forever start --uid "form-and-function" server.js