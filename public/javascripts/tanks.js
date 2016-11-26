$(document).ready(function() {
var dt=50
var dx=0


    function makeScene(players)
    {
        var g = $('#game')
        g.html('')
        var gpos = g.offset()
        var gsize = { width: g.width(), height: g.height() }
        var psize = { width: 50, height: 50 }
        for (var i in players) {
            var player = players[i] 
            var pos = {
                left: player.position.x,
                top: player.position.y
            }              
           // console.log(pos)
            $('<div>')
              .addClass('player')
              .offset(pos)
              .appendTo(g)
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
                if (e.key == "w"){
                    $.get('/game/move-up')
                        .done(function(){
                            console.log('move-up done')
                        })
                }
                if (e.key == "s"){
                    $.get('/game/move-down')
                        .done(function(){
                            console.log('move-down done')
                        })
                }
                if (e.key == "a"){
                    $.get('/game/move-left')
                        .done(function(){
                            console.log('move-left done')
                        })
                }
            })





    updateScene()
})
