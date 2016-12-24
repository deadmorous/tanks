$(document).ready(function() {
var dt=40
var dx=0

var pos = {
                left: 100,
                top: 100
            }
var pos_tower = {
                left: 100,
                top: 100
            }
    function makeScene(players)
    {
        var g = $('#game')
        g.html('')
        var gpos = g.offset()
        var gsize = { width: g.width(), height: g.height() }
        var psize = { width: 50, height: 50 }
        var bsize = { width: 10, height: 30 }
        for (var i in players) {
            var player = players[i]
            // console.log(pos)
            pos = {
                left: player.position.x,
                top:  player.position.y
            }
            pos_tower = {
                left: player.position.x+25-20*(1-Math.cos(Math.PI*player.position.angle/180)),
                top:  player.position.y+20+20*Math.sin(Math.PI*player.position.angle/180)
                //left: player.position.x-20*(1-Math.cos(Math.PI*player.position.angle/180)),
                //top:  player.position.y+20*Math.sin(Math.PI*player.position.angle/180)
            }
            $('<div>')
              .addClass('player')
              .addClass(player.status)
              .offset(pos)
              .appendTo(g)
              .html(player.name)

            $('<div id=tow>')
              .addClass('tower')
              .offset(pos_tower)
              .appendTo(g)
              .rotate({angle: player.position.angle})
        }
    }



    function updateScene() {
        $.get('/scene')
            .done(function(data) {
                $('#dbg').text(data)
                makeScene(JSON.parse(data))
                setTimeout(updateScene, dt)
            })
    }

    (function() {
        var down = {}
        function processMotionKey(e, dir) {
            var path, q
            switch (e.key) {
            case 'a':
                path = '/set-motion-dir'
                q = { x: -dir }
                break
            case 'd':
                path = '/set-motion-dir'
                q = { x: dir }
                break
            case 'w':
                path = '/set-motion-dir'
                q = { y: -dir }
                break
            case 's':
                path = '/set-motion-dir'
                q = { y: dir }
                break
            case 'ArrowLeft':
                path = '/set-turret-rotation-dir'
                q = { angle: -dir }
                break
            case 'ArrowRight':
                path = '/set-turret-rotation-dir'
                q = { angle: dir }
                break
            }
            if (path) {
                e.preventDefault()
                $.get(path, q).done(function() {
                    console.log('Moved: ' + path + JSON.stringify(q))
                })
            }
        }
        $(window)
            .keydown(function(e) {
                if (down[e.keyCode]) {
                    e.preventDefault()
                    return
                }
                down[e.keyCode] = true
                console.log(e)
                if (e.key == ' ')
                    $.get('/shoot')
                        .done(console.log.bind(console, 'shot'))
                else
                    processMotionKey(e, 1)
            })
            .keyup(function(e) {
                delete down[e.keyCode]
                //console.log(e)
                processMotionKey(e, 0)
            })
    })()

        /*$(window)
            .keydown(function(e) {
                console.log(e.key)
                if (e.key == "d"){
                    $.get('/game/move-right')
                        .done(function(){
                            console.log('move-rigth done')
                        })
                }
                if (e.key == "a"){
                    $.get('/game/move-left')
                        .done(function(){
                            console.log('move-left done')
                        })
                }
                if (e.key == "w"){
                    $.get('/game/move-up')
                        .done(function(){
                            console.log('move-top done')
                        })
                }
                if (e.key == "s"){
                    $.get('/game/move-down')
                        .done(function(){
                            console.log('move-down done')
                        })
                }                 
            })
        $(window)
            .keydown(function(e) {
                console.log(e.key)
                if (e.key == "ArrowLeft"){
                    $.get('/game/rotate-tower-left')
                        .done(function(){
                            console.log('rotate-left-done')
                        })
                }
                if (e.key == "ArrowRight"){
                    $.get('/game/rotate-tower-right')
                        .done(function(){
                            console.log('rotate-right-done')
                        })
                }                 
            })
            */
    updateScene()
})
