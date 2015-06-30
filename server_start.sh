serverjs=/data/www/thalinterpreter/server.js
NODEJS_LOG=/data/www/thalinterpreter/server.log
export NODE_ENV=production;forever server.js > $NODEJS_LOG 2>&1 &
