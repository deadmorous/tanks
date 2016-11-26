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
        res.redirect('/game')
    })
    .use(function(req, res, next) {
        if (!req.session.name)
            return res.redirect('/login')
        next()
    })

    .get('/', function(req, res, next) {
      res.render('index', { name: req.session.name });
    })
    .get('/messages', function(req, res, next) {
        var first = +(req.query.first || 0)
        res.send(JSON.stringify(messages.slice(first)))
    })
    .post('/message', function(req, res, next) {
        var msg = req.session.name + ': ' + req.body.msg
        messages.push(msg)
        res.sendStatus(200)
    })

    .get('/15', function(req, res, next) {
      res.render('15');
    })

module.exports = router;
