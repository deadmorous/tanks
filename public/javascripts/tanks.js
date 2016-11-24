$(document).ready(function() {
    setInterval(function(){
        $.get('/game/circle')
          .done(function() {
         // location.reload()
          })
      },100)

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
                left: /*gpos.left + */0.5*(1+player.position.x)*(gsize.width - psize.width),
                top: /*gpos.top + */0.5*(1+player.position.y)*(gsize.height - psize.height)
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
                setTimeout(updateScene, 100)
            })
    }

    $(window)
        .keydown(function(e) {
            console.log('Key down: ' + e.key)
        })
        .keyup(function(e) {
            console.log('Key up: ' + e.key)
        })

    updateScene()
})
