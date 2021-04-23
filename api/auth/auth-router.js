const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtsecret = require('../secrets/index');
const Auth = require('./auth-model');
const bcrypt = require('bcryptjs');
const { registerUsername,
   emptyCredentials,
  loginCredentials} = require('../middleware/restricted');


router.post('/register',
 emptyCredentials,
  registerUsername, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  Auth.registering({username, password: hash})
  .then(registeredUser => {
    res.status(201).json(registeredUser);
  })
  .catch(next);
});

router.post('/login',
 emptyCredentials,
  loginCredentials, (req, res, next) => {
if (bcrypt.compareSync(req.body.password, req.user.password)) {
  const token = makeToken(req.user);
  res.json({ message: `welcome, ${req.user.username}`, token});
} else {
  next({ status: 422, message: 'invalid credentials'});
}
});

function makeToken (user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '22h'
  }
  return jwt.sign(payload, jwtsecret, options);
}

module.exports = router;
