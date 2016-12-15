var express = require('express');
var router = express.Router();




// Describes player position
function Position()
{
    this.x = 0
    this.y = 0
    this.angle = 0
}
Position.prototype.add = function(speed, factor) {
    this.x += speed.x * factor
    this.y += speed.y * factor
    this.angle += speed.angle * factor
}

function Player()
{
    this.position = new Position
    this.speed = new Position
    this.shooting = false
    this.status = 'alive'
}

var scene = {
    players: []
}
var stepTime = 0

var sessionToPlayer = {}

function advanceScene()
{
    for (var i in scene.players) {
        var player = scene.players[i]
        player.position.add(player.speed, 2)
    }
}

setInterval(advanceScene, 40)

router
    .get('/login', function(req, res, next) {
        res.render('login');
    })
    .post('/login', function(req, res, next) {
        req.session.name = req.body.name
		var player = new Player
        player.name = req.session.name
        scene.players.push(player)
        sessionToPlayer[req.sessionID] = player
        res.redirect('/')
    })
    .use(function(req, res, next) {
        if (!req.session.name)
            return res.redirect('/login')
        next()
    })
	.get('/hello', function(req, res, next) {
        res.send('hello from game')
    })
    .get('/scene', function(req, res, next) {
        res.send(JSON.stringify(scene.players))
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
    .get('/', function(req, res, next) {
        res.render('game', {
            playing: sessionToPlayer.hasOwnProperty(req.sessionID)
        })
    })

    .use(function(req, res, next) {
        if (!sessionToPlayer.hasOwnProperty(req.sessionID))
            return res.sendStatus(400)
        req.session.player = sessionToPlayer[req.sessionID]
        next()
    })
    .get('/set-motion-dir', function(req, res, next) {
        var speed = req.session.player.speed
        if ('x' in req.query)
            speed.x = +req.query.x
        if ('y' in req.query)
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

    .get('/move-right', function(req, res, next) {
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.x += 2
            }
        }
        res.sendStatus(200)
    })
    .get('/move-left', function(req, res, next) {
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.x -= 2
            }
        }
        res.sendStatus(200)
    })

    .get('/move-up', function(req, res, next) {
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.y -= 2
            }
        }
        res.sendStatus(200)
    })

    .get('/move-down', function(req, res, next) {
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.y += 2
            }
        }
        res.sendStatus(200)
    })

    .get('/rotate-tower-right',function(req, res, next){
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.angle+=1
            }
        }
        res.sendStatus(200)
    })
    .get('/rotate-tower-left',function(req, res, next){
        for (var i in scene.players) {
            if (sessionToPlayer[req.sessionID].name == scene.players[i].name){
                scene.players[i].position.angle-=1
            }
        }
        res.sendStatus(200)
    })

    .get('/circle', function(req, res, next) {
        stepTime += 1
        var d = 100
       req.session.player.position.x = Math.cos((Math.PI/d)*stepTime)
       req.session.player.position.y = Math.sin((Math.PI/d)*stepTime)
       res.sendStatus(200)
    })

module.exports = router;
