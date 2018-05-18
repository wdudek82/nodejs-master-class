const path = require('path');
const os = require('os');
const fs = require('fs');
const Logger = require('./logger');
const logger = new Logger();

// Register listener
logger.on('messageLogged', (arg) => {
  console.log('Listener called', arg);
});


logger.log('message');