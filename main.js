log = console.log.bind(console);

var WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;

var canvas = document.getElementById('canvas');

canvas.width = WIDTH;
canvas.height = HEIGHT;

var context = canvas.getContext('2d');

function Screen(context) {
  this.context = context;
  this.imageData = context.getImageData(0, 0,
      context.canvas.width, context.canvas.height);
  this.data = this.imageData.data;
  this.rowSize = context.canvas.width * 4;
}
Screen.prototype.putPixel = function(x, y, r, g, b, a) {
  a = a === void 0 ? 255 : a;
  var offset = WIDTH * 4 * y + x * 4;
  this.imageData.data[offset + 0] = r;
  this.imageData.data[offset + 1] = g;
  this.imageData.data[offset + 2] = b;
  this.imageData.data[offset + 3] = a;
};
Screen.prototype.clear = function() {
  this.context.fillStyle = '#00000';
  this.context.fillRect(0, 0, WIDTH, HEIGHT);
  this.imageData = this.context.getImageData(0, 0, WIDTH, HEIGHT);
};
Screen.prototype.draw = function() {
  this.context.putImageData(this.imageData, 0, 0);
};

function julia(screen, opt) {
  var palette, color;
  palette = opt.palette;
  var cre = 0.285, cim = 0.01;
  var _cr = (opt.centerColor >> 16) & 0xff,
      _cg = (opt.centerColor >>  8) & 0xff,
      _cb = (opt.centerColor >>  0) & 0xff;
  var r = opt.radius, r2 = r * r;
  var w1_2 = WIDTH >> 1, h1_2 = HEIGHT >> 1;
  for (var y = 0; y < HEIGHT; y++) {
    var _zim = (y - h1_2) / (opt.scale * h1_2) + opt.yoff;
    for (var x = 0; x < WIDTH; x++) {
      var zre = 1.5 * ((WIDTH - x) - w1_2) / (opt.scale * w1_2) - opt.xoff,
          zim = _zim;
      var iter = 0;
      var zre2 = zre * zre, zim2 = zim * zim;
      for (var _zre = 0; zre2 + zim2 < r2 && iter < opt.m_iter; iter++) {
        _zre = zre2 - zim2 + cre;
        zim = 2 * zre * zim + cim;
        zre = _zre;
        zre2 = zre * zre;
        zim2 = zim * zim;
      }
      if (iter < opt.m_iter) {
        /* clean up banding */ {
          for (var j = 0; j < 2; j++, iter++) {
            _rez = zre * zre - zim * zim + cre;
            zim = 2 * zre * zim + cim;
            zre = _rez;
          }
        }
        var _r, _g , _b;
        if (opt.smooth) {
          var log_zn = Math.log(zre * zre + zim * zim) / 2;
          var nu = Math.log(log_zn / Math.log(r)) / Math.LN2;
          iter = (palette.length - 1) * (iter + 1 - nu) / opt.m_iter;
          var c1 = palette[~~iter % palette.length],
              c2 = palette[~~(iter + 1) % palette.length];
          var w2 = iter % 1, w1 = 1 - w2;
          _r = c1[0] * w1 + c2[0] * w2;
          _g = c1[1] * w1 + c2[1] * w2;
          _b = c1[2] * w1 + c2[2] * w2;
        } else {
          color = palette[iter % palette.length];
          _r = color[0]; _g = color[1]; _b = color[2];
        }
        screen.putPixel(x, y, _r, _g, _b);
      } else {
        screen.putPixel(x, y, _cr, _cg, _cb);
      }
    }
  }
}

function mandelbrot(screen, opt) {
  var palette, color;
  palette = opt.palette;
  var _cr = (opt.centerColor >> 16) & 0xff,
      _cg = (opt.centerColor >>  8) & 0xff,
      _cb = (opt.centerColor >>  0) & 0xff;
  var r = opt.radius, r2 = r * r;
  var w1_2 = WIDTH >> 1, h1_2 = HEIGHT >> 1;
  for (var y = 0; y < HEIGHT; y++) {
    var cim = (y - h1_2) / (opt.scale * h1_2) + opt.yoff;
    for (var x = 0; x < WIDTH; x++) {
      var cre = (x - w1_2) / (opt.scale * w1_2) + opt.xoff;
      var zre = 0, zim = 0, iter = 0;
      var zre2 = zre * zre, zim2 = zim * zim;
      for (var _zre = 0; zre2 + zim2 < r2 && iter < opt.m_iter; iter++) {
        _zre = zre2 - zim2 + cre;
        zim = 2 * zre * zim + cim;
        zre = _zre;
        zre2 = zre * zre;
        zim2 = zim * zim;
      }
      if (iter < opt.m_iter) {
        /* clean up banding */ {
          for (var j = 0; j < 7; j++, iter++) {
            _zre = zre * zre - zim * zim + cre;
            zim = 2 * zre * zim + cim;
            zre = _zre;
          }
        }
        var _r, _g , _b;
        if (opt.smooth) {
          var log_zn = Math.log(zre * zre + zim * zim) / 2;
          var nu = Math.log(log_zn / Math.log(r)) / Math.LN2;
          iter = (palette.length - 1) * (iter + 1 - nu) / opt.m_iter;
          var c1 = palette[~~iter % palette.length],
              c2 = palette[~~(iter + 1) % palette.length];
          var w2 = iter % 1, w1 = 1 - w2;
          _r = c1[0] * w1 + c2[0] * w2;
          _g = c1[1] * w1 + c2[1] * w2;
          _b = c1[2] * w1 + c2[2] * w2;
        } else {
          color = palette[iter % palette.length];
          _r = color[0]; _g = color[1]; _b = color[2];
        }
        screen.putPixel(x, y, _r, _g, _b);
      } else {
        screen.putPixel(x, y, _cr, _cg, _cb);
      }
    }
  }
}

var screen = new Screen(context);

var opt = {
  m_iter: 128,
  scale: 0.67,
  width: WIDTH,
  height: HEIGHT,
  xoff: -0.7,
  yoff: 0,
  type: mandelbrot,
  radius: 2,
  smooth: true,
  centerColor: 0x000000,
  palette: [
    0x19071a,
    0x09012f,
    0x040449,
    0x000764,
    0x0c2c8a,
    0x1852b1,
    0x397dd1,
    0x86b5e5,
    0xd3ecf8,
    0xf1e9bf,
    0xf8c95f,
    0xffaa00,
    0xcc8000,
    0x995700,
    0x6a3403,
    0x421e0f,
  ]
}; (function() {
  opt.palette.push(opt.centerColor);
  opt.palette = opt.palette.map(function(rgb) {
    return [
      (rgb >> 16) & 0xff,
      (rgb >>  8) & 0xff,
      (rgb >>  0) & 0xff,
    ];
  });
})();

var quality = 1;
var step = 0.05;
var scaleStep = 1.05;
var savedQuality = 0.1;

var doneDrawing = true;

function refresh() {
  WIDTH = document.documentElement.clientWidth * quality;
  HEIGHT = document.documentElement.clientHeight * quality;
  HEIGHT = ~~HEIGHT; WIDTH = ~~WIDTH;
  canvas.width = WIDTH; canvas.height = HEIGHT;
  screen.imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
  screen.clear();
  opt.type(screen, opt);
  setTimeout(() => {
    doneDrawing = true;
  }, 10);
  screen.draw();
}
refresh();

document.addEventListener('keydown', event => {
  if (!doneDrawing)
    return true;
  // log(event.which);
  doneDrawing = false;
  switch (event.which) {
  case 74: // j
    opt.yoff += step / opt.scale;
    break;
  case 75: // k
    opt.yoff -= step / opt.scale;
    break;
  case 72: // h
    opt.xoff -= step / opt.scale;
    break;
  case 76: // l
    opt.xoff += step / opt.scale;
    break;
  case 73: // i
    opt.scale *= scaleStep;
    break;
  case 79: // o
    opt.scale /= scaleStep;
    break;
  case 70: // f
    opt.m_iter += 5;
    break;
  case 68: // f
    opt.m_iter -= 5;
    break;
  case 81: // q
    if (event.shiftKey)
      quality *= 1.05;
    else
      quality /= 1.05;
    break;
  case 83: // s
    opt.smooth = !opt.smooth;
    break;
  case 77: // m
    opt.type = opt.type === julia ? mandelbrot : julia;
    break;
  case 87: // w
    if (savedQuality === null) {
      savedQuality = quality;
      quality = 1;
    } else {
      quality = savedQuality;
      savedQuality = null;
    }
    break;
  default:
    return doneDrawing = true;
  }
  var q = quality;
  quality = q;
  refresh();
});
window.onblur = function() {
  doneDrawing = true;
};
