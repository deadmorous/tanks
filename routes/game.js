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
    this.status = 'alive'//or dead
    this.score = 0
    this.timeout = -1
}

function Scene() {
    this.players = []
}
Scene.prototype.processTimeouts = function() {
    for (var i in this.players) {
        var player = this.players[i]
        if (player.timeout === 0) {
            switch (player.status) {
            case 'dead':
                player.status = 'respawning'
                player.position.x=Math.random()*(1050)
                player.position.y=Math.random()*(450)
                player.timeout = 50
                break
            case 'respawning':
                player.status = 'alive'
                player.timeout = -1
                break
            case 'cant_shoot':
                player.status = 'alive'
                player.timeout = -1
                break
            }
        }
        else if (player.timeout > 0)
            --player.timeout
    }
}
Scene.prototype.move = function() {
    var factor = 2
    for (var i in this.players) {
        var player = this.players[i]
        if ((player.position.x <1051) && (player.position.x > -1) && (player.position.y <451) && (player.position.y > -1)){
            player.position.add(player.speed, factor)
        }
        else {
            if ((player.position.x > 1050) && (player.speed.x < 0)){
                player.position.add(player.speed, factor)
            }
            if (player.position.x < 0 && (player.speed.x > 0)){
                player.position.add(player.speed, factor)
            }
            if ((player.position.y > 45) && (player.speed.y < 0)){
                player.position.add(player.speed, factor)
            }
            if ((player.position.y < 0) && (player.speed.y > 0)){
                player.position.add(player.speed, factor)
            }

        }
            
    }
}
Scene.prototype.processShoots = function() {
    var killedTanks = []
    for (var i in this.players) {
        var player = this.players[i]
        var killedTank
        if(player.shooting && player.status === 'alive' ) {
            player.status='cant_shoot'
            player.timeout=20
            for (var j in this.players) {
                 if (i==j) {
                     l=0;
                     h=0;
                }
                 else {
                     var x_killer=player.position.x
                     var y_killer=player.position.y
                     var angle_killer=player.position.angle*Math.PI/180
                     var l=(this.players[j].position.x-x_killer)*Math.cos(angle_killer)+(this.players[j].position.y-y_killer)*Math.sin(angle_killer)
                     var h=-(this.players[j].position.x-x_killer)*Math.sin(angle_killer)+(this.players[j].position.y-y_killer)*Math.cos(angle_killer)
                     if (l > 0) {
                         if (Math.abs(h) < 25) //-----------------------set r--------------------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                         {
                             //if (l > min_l) TODO-----------------
                                 var jNearest=j
                         }
                     }
                    killedTank = this.players[jNearest]
                }
                
            }
            
        }
        if(killedTank)
        {
            ++player.score

            killedTanks.push(killedTank)
        }
        player.shooting = false
        killedTank=undefined

    }

    for(i in killedTanks)
    {
        killedTank = killedTanks[i]
        if(killedTank.status === 'alive' || killedTank.status === 'cant_shoot') {
            //    continue
            killedTank.status = 'dead'
            killedTank.timeout = 50
            --killedTank.score
        }
        
        
    }
}

Scene.prototype.advance = function()
{
    this.processTimeouts()
    this.move()
    this.processShoots()
}


var scene = new Scene

var stepTime = 0

var sessionToPlayer = {}

setInterval(scene.advance.bind(scene), 40)

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
