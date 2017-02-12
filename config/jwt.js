// config/jwt.js
module.exports = {
    'secret'   : 'montreal 2030 rue du fort',
    'except'   : [new RegExp('/login'), new RegExp('/register'), new RegExp('/photo.*/', 'i')]
};