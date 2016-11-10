var express = require('express');
var router = express.Router();

function Position()
{
    this.x = 0
    this.y = 0
    this.angle = 0
}

function Player()
{
    this.position = new Position
    this.speed = new Position
    this.shooting = false
}

var scene = {
    players: []
}

var sessionToPlayer = {}

function advanceScene()
{
    console.log('TODO: advanceScene()')
}

setInterval(advanceScene, 500)

router
    .get('/hello', function(req, res, next) {
        res.send('hello from game')
    })
    .get('/scene', function(req, res, next) {
        res.send(JSON.stringify(scene))
    })
    .get('/enter', function(req, res, next) {
        if (sessionToPlayer.hasOwnProperty(req.sessionID))
            return res.sendStatus(400)
        var player = new Player
        player.name = req.session.name
        scene.players.push(player)
        sessionToPlayer[req.sessionID] = player
        res.sendStatus(200)
    })
    .get('/leave', function(req, res, next) {
        if (!sessionToPlayer.hasOwnProperty(req.sessionID))
            return res.sendStatus(400)
        var player = sessionToPlayer[req.sessionID]
        delete sessionToPlayer[req.sessionID]
        for (var i=0; i<scene.players.length; ++i)
            if (player === scene.players[i]) {
                scene.players.splice(i, 1)
                break
            }
        res.sendStatus(200)
    })
    .use(function(req, res, next) {
        if (!sessionToPlayer.hasOwnProperty(req.sessionID))
            return res.sendStatus(400)
        req.session.player = sessionToPlayer[req.sessionID]
        next()
    })
    .get('/set-motion-dir', function(req, res, next) {
        var speed = req.session.player.speed
        speed.x = +req.query.x
        speed.y = +req.query.y
        // console.log('set-motion-dir: ok, name = ' + req.session.player.name)
        res.sendStatus(200)
    })
    .get('/set-turret-rotation-dir', function(req, res, next) {
        var speed = req.session.player.speed
        speed.angle = +req.query.angle
        // console.log('set-turret-rotation-dir: ok, name = ' + req.session.player.name)
        res.sendStatus(200)
    })
    .get('/shoot', function(req, res, next) {
        req.session.player.shooting = true
        // console.log('shoot: ok, name = ' + req.session.player.name)
        res.sendStatus(200)
    })

module.exports = router;
