$(document).ready(function() {
var dt=100
var dx=0

var pos = {
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
        for (var i in players) {
            var player = players[i]
                    
                


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
            })





    updateScene()
})
