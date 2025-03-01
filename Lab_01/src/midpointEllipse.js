// Initialize

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 800;
var height = 600;

var bgRgba = [240, 240, 200, 255];
var pointRgba = [0, 0, 255, 255];
var lineRgba = [0, 0, 0, 255];
var vlineRgba = [255, 0, 0, 255]; // Preview line

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

function Painter(context, width, height) {

    this.context = context;
    this.imageData = context.createImageData(width, height);
    this.points = [];
    this.now = [-1, -1];
    this.width = width;
    this.height = height;
    
    this.getPixelIndex = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return -1;
        return (x + y * width) << 2;
    }

    this.setPixel = function(x, y, rgba) {
        pixelIndex = this.getPixelIndex(x, y);
        if (pixelIndex == -1) return;
        for (var i = 0; i < 4; i++) {
            this.imageData.data[pixelIndex + i] = rgba[i];
        }
    }

    // 1 điểm được thể hiện dưới dạng bởi ô 3x3 pixel
    this.drawPoint = function(p, rgba){
        var x = p[0];
        var y = p[1];
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                this.setPixel(x + i, y + j, rgba);
    }

    // thuật toán Midpoint vẽ elip
    this.midpoint = function(p, rgba) {
        var a = 150;
        var b = 80;
        var q = a * a / Math.sqrt(a * a + b * b);
        var x = 0;
        var y = -b; // sử dụng tọa độ màn hình --> trục y hướng xuống
        var m = 3 * b * b;
        var n = 2 * a * a - 2 * a * a * b + 3 * b * b;
        var f = a * a / 4 + b * b - a * a * b;

        while (x < q) {
            if (f < 0) {
                f += m;
                m += 2 * b * b;
                n += 2 * b *b;
            }
            else {
                f += n;
                m += 2 * b * b;
                n += 2 * a * a + 2 * b * b;
                y++;
            }
            x++;
            this.setPixel(p[0] + x, p[1] + y, rgba);
            this.setPixel(p[0] - x, p[1] + y, rgba);
            this.setPixel(p[0] + x, p[1] - y, rgba);
            this.setPixel(p[0] - x, p[1] - y, rgba);
        }

        var e = Math.round(b * b * (x + 0.5) * (x + 0.5) + a * a * (y + 1) * (y + 1) - a * a * b * b);
        while (y < 0) {
            if (e < 0) {
                e += b * b * (2 * x + 2) + a * a * (3 + 2 * y)
                x++;
            }
            else {
                e += a * a * (3 + 2 * y);
            }
            y++;
            this.setPixel(p[0] + x, p[1] + y, rgba);
            this.setPixel(p[0] - x, p[1] + y, rgba);
            this.setPixel(p[0] + x, p[1] - y, rgba);
            this.setPixel(p[0] - x, p[1] - y, rgba);
        }
    }

    this.drawBkg = function(rgba) {
        for (var i = 0; i < this.width; i++)
            for (var j = 0; j < this.height; j++)
                this.setPixel(i, j, rgba);
    }   

    this.clear = function() {
        this.points.length = 0;
        this.drawBkg(bgRgba);
        this.context.putImageData(this.imageData, 0, 0);
    }

    this.addPoint = function(p) {
        this.points.push(p);
    }

    this.draw = function(p) {
        var n = this.points.length;
        this.drawBkg(bgRgba);
        for (var i = 0; i < n; i++)
            this.drawPoint(this.points[i], pointRgba);

        for (var i = 0; i < n; i++)
            this.midpoint(this.points[i], lineRgba);

        if (n > 0 && (this.points[n - 1][0] != p[0] || this.points[n - 1][1] != p[1])) {
            this.midpoint(p, vlineRgba); // draw red line while moving mouse cursor
        }
        
        this.context.putImageData(this.imageData, 0, 0);
    }

    this.clear();
    this.draw();
}

state = 0; // 0: waiting 1: drawing 2: finished
clickPos = [-1, -1];
var painter = new Painter(context, width, height);

getPosOnCanvas = function(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
            Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)];
}

doMouseMove = function(e) {
    if (state == 0 || state == 2) {
        return;
    }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.draw(p);
}

doMouseDown = function(e) {
    if (state == 2 || e.button != 0) {
        return;
    }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.addPoint(p);
    painter.draw(p);
    if (state == 0) {
        state = 1;
    }
}

doKeyDown = function(e) {
    if (state == 2) {
        return;
    }
    var keyId = e.keyCode ? e.keyCode : e.which;
    if (keyId == 27 && state == 1) { // esc
        state = 2;
        painter.draw(painter.points[painter.points.length - 1]); // clear red line
    }
}

doReset = function() {
    if (state == 0) {
        return;
    }
    state = 0;
    painter.clear();
}

canvas.addEventListener("mousedown", doMouseDown, false);
canvas.addEventListener("mousemove", doMouseMove, false);
window.addEventListener("keydown", doKeyDown, false);

var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", doReset, false);
