$(document).ready(function() {
    function Cell(x, y, id) {
        this.w = $('#'+id)
        this.move(x, y)
    }

    Cell.prototype.move = function(x, y) {
        this.x = x
        this.y = y
        var parentOffset = this.w.parent().offset()
        this.w.offset({
            left: x*100 + 5 + parentOffset.left,
            top: y*100 + 5 + parentOffset.top
        })
    }

    Cell.prototype.moveToNeighboringFreeSpace = function() {
        var point = neighboringFreeSpace(this)
        if (point)
            this.move(point.x, point.y)
    }

    var cells = []

    function neighboringFreeSpace(point) {
        var occupied = Array(16).fill(false)
        for (var ic=0; ic<15; ++ic) {
            var cell = cells[ic]
            occupied[cell.x + cell.y*4] = true
        }

        var xfree, yfree
        for (ic=0; ic<16; ++ic) {
            if (!occupied[ic]) {
                xfree = ic % 4
                yfree = Math.floor(ic / 4)
                break
            }
        }

        if (Math.abs(point.x-xfree) + Math.abs(point.y-yfree) === 1)
            return { x: xfree, y: yfree }
    }

    function initCells() {
        for (var i=0; i<15; ++i)
            cells[i] = new Cell(i%4, Math.floor(i/4), i)
    }

    $('.game>div').click(function() {
        cells[this.id].moveToNeighboringFreeSpace()
    })

    initCells()
})
