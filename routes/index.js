var express = require('express');
var router = express.Router();

var messages = []

/* GET home page. */
router
    .get('/login', function(req, res, next) {
        res.render('login');
    })
    .post('/login', function(req, res, next) {
        req.session.name = req.body.name
        res.redirect('/')
    })
    .use(function(req, res, next) {
        if (!req.session.name)
            return res.redirect('/login')
        next()
    })

    .get('/game', function(req, res, next) {
      res.render('game', { name: req.session.name });
    })


    .get('/15', function(req, res, next) {
      res.render('15');
    })

module.exports = router;
