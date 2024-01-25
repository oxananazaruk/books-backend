const handleMongooseErr = (error, data, next) => {
  console.log(error);
  error.status = 400;
  next();
};

module.exports = handleMongooseErr;