var express = require('express');
var passport = require('passport');

var User = require('../models/user');

var router = express.Router();

// GET: /sessions/login
router.get('/login', function(req, res) {
  res.render('login', { message: req.flash('error') });
});

// GET: /sessions/answer
router.get('/answer', function(req, res) {
  res.render('answer', { message: req.query.employeeid });
});

// POST: /sessions/login
router.post('/login',
            passport.authenticate('local', {
              successRedirect: '/',
              failureRedirect: '/sessions/login',
              failureFlash: true 
            }), function(req, res) {
              req.session.save(function (err) {
                if (err) {
                  return next(err);
                }

                res.redirect('/');
              });
            });

// POST: /sessions/logout
router.get('/logout', function(req, res) {
  req.logout();
  req.session.save(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect('/sessions/login');
  });
});

module.exports = router;
