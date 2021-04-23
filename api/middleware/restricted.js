const jwt = require('jsonwebtoken');
const jwtsecret = require('../secrets/index');
const {findBy} = require('../auth/auth-model');

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "token required" });
  } else {
    jwt.verify(token, jwtsecret, (err, decoded) => {
      if(err) {
        res.status(401).json({ message: 'token invalid' });
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  }};
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */



/*

    1- In order to register a new account the client must provide `username` and `password`:
          {
            "username": "Captain Marvel", // must not exist already in the `users` table
            "password": "foobar"          // needs to be hashed before it's saved
          }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken". */

      const registerUsername = async (req, res, next) => {
        // const {username} = req.body;
        const usersName = await findBy({username: req.body.username})
        if (usersName) {
          res.status(409).json({message: 'username taken'});
          next();
        } else { 
          next();
        }
      };

      const loginCredentials = async (req, res, next) => {
       try {
         const user = await findBy({username: req.body.username})
         if (!user) {
           next({ status: 422, message: 'invalid credentials'})
         } else {
           req.user = user
           next();
         }
       } catch (err) {
        next(err);
       }
      };

      const emptyCredentials = (req, res, next) => {
        const {username, password} = req.body;
        if (!username || !password) {
          res.status(401).json({message: 'username and password required'});
        } else {
          next();
        }
      };

      module.exports = {
        restricted,
        registerUsername,
        loginCredentials,
        emptyCredentials
      };
