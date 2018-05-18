function authenticate(req, res, next) {
  console.log('Authenticate...');
  next();
}

module.exports = authenticate;
