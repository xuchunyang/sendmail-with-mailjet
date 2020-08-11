module.exports = (req, res) => {
  res.statusCode = 200;
  res.end(new Date().toUTCString());
};
