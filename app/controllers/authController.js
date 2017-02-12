exports.authError = function (err, req, res, next) { 
  if (err.name === 'UnauthorizedError') 
    res.send(401, 'unauthorized');
}