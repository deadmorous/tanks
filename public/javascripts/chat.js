$(document).ready(function() {
    var n = 0
    function update() {
        $.get('/messages', {first: n})
        .done(function(data) {
            var messages = JSON.parse(data)
            if (messages.length > 0) {
                $('#chat').append(
                    messages.join('<br/>')+'<br/>')
                n += messages.length
            }
            setTimeout(update, 2000)
        })
        .fail(function(xhr) {
            $('#chat').text('get /messages failed')
        })
    }
    update()

    $('#sendMessage').click(function(e) {
        e.preventDefault()
        var msgInput = $('#msg')
        var msg = msgInput.val()
        $.post('/message', {msg: msg})
        .done(function(){
            msgInput.val('')
        })
        .fail(function(xhr) {
            $('#chat').text('post /message failed')
        })
    })
})
