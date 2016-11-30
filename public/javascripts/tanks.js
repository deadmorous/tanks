$(document).ready(function() {
var dt=100
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
            }
            $('<div>')
              .addClass('player')
              .offset(pos)
              .appendTo(g)

            $('<div id=tow>')
              .addClass('tower')
              .offset(pos_tower)
              .appendTo(g)
            $("#tow")
                .rotate(player.position.angle)
        }
    }



    function updateScene() {
        $.get('/game/scene')
            .done(function(data) {
                $('#dbg').text(data)
                makeScene(JSON.parse(data))
                setTimeout(updateScene, dt)
            })
    }

        $(window)
            .keydown(function(e) {
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
                    $.get('/game/move-top')
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





    updateScene()
})
