/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
   return window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
     return window.setTimeout(callback, 1000/30);
   };
 })();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
                                 return window.cancelCancelRequestAnimationFrame ||
                                 window.webkitCancelRequestAnimationFrame ||
                                 window.mozCancelRequestAnimationFrame ||
                                 window.oCancelRequestAnimationFrame ||
                                 window.msCancelRequestAnimationFrame ||
                                 window.clearTimeout;
                                 })();

Array.prototype.clone = function() {
  return this.slice(0);
}

/*
  Vector addition 
 */
Array.prototype.v_add_v = function(b) {
  var a = this;
  var c = [];
  for (var i = 0; i < a.length; i++) {
    c[i] = a[i] + b[i];
  }
  return c;
};

/*
  Vector subtraction 
 */
Array.prototype.v_sub_v = function(b) {
  var a = this;
  var c = [];
  for (var i = 0; i < a.length; i++) {
    c[i] = a[i] - b[i];
  }
  return c;
};

/*
  Vector scale 
 */
Array.prototype.v_scale = function(s) {
  return map(function(a) { return a*s;}, this);
};

Array.prototype.m_cols = function(m) {
  if(this[0] instanceof Array)
    return this[0].length;
  else
    console.debug("Not a matrix");
};

Array.prototype.m_rows = function(m) {
  if(this instanceof Array)
    return this.length;
  else
    console.debug("Not a matrix");
};

/* 
  Same as m_mul_m, but accepts a vector in transpose notation on the right,
  and returns transformed vector in transpose notation back(for convenience)
 */
Array.prototype.m_mul_v = function(b) { 
  return this.m_mul_m([b].m_transpose()).m_transpose()[0];
};

/* 
  Matrix multiplication
 */
Array.prototype.m_mul_m = function(b) {
  var a = this;
  var c = [[]];
  var rows = this.m_rows();
  var cols = this.m_cols();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      c[i] = c[i] || new Array(cols);
      c[i][j] = 0;
      for (var k = 0; k < rows; k++) {
        c[i][j] += a[i][k]*b[k][j];
      };
    };
  };
  return c;
};

Array.prototype.m_transpose = function(m) {
  var rows = this.length;
  var cols = this[0].length;
  var mt = [[]];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if(i==0) mt[j] = [];
      mt[j][i] = this[i][j];
    }
  }
  return mt;
};

// Vector, Vector -> Vector
function vector_add(a,b)
{
  var c = [];
  for (var i = 0; i < a.length; i++) {
    c[i] = a[i] + b[i];
  };
  return c;
}

// Matrix, Vector -> Vector
function vector_xfrom(m,v) {
  return matrix_transpose(matrix_mul(m, matrix_transpose([v])))[0];
}

// Matrix -> Matrix
function matrix_transpose(a) {
  var rows = a.length;
  var cols = a[0].length;
  var b = [[]];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if(i==0) b[j] = [];
      b[j][i] = a[i][j];
    }
  }
  return b;
}

// Matrix, Matrix -> Matrix
function matrix_mul(a,b) {
  var rows = a.length;
  var cols = a[0].length;
  var c = [[]];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      c[i] = c[i] || new Array(cols);
      c[i][j] = 0;
      for (var k = 0; k < rows; k++) {
        c[i][j] += a[i][k]*b[k][j];
      };
    };
  };
  return c;
}

// Number -> Matrix
function Scale(a) {
  return [[a, 0, 0, 0],
          [0, a, 0, 0],
          [0, 0, a, 0],
          [0, 0, 0, 1]];
}

// Vector -> Matrix
function Translation(v) {
  return [[1, 0, 0, v[0]],
          [0, 1, 0, v[1]],
          [0, 0, 1, v[2]],
          [0, 0, 0, 1  ]];
}

// Number -> Matrix
function RotationX(a) {
  var c = Math.cos(a), s = Math.sin(a);
  return [[1, 0, 0, 0],
          [0, c,-s, 0],
          [0, s, c, 0],
          [0, 0, 0, 1]];
}

// Number -> Matrix
function RotationY(a) {
  var c = Math.cos(a), s = Math.sin(a);
  return [[c, 0, s, 0],
          [0, 1, 0, 0],
          [-s, 0, c, 0],
          [0, 0, 0, 1]];
}

// Number -> Matrix
function RotationZ(a) {
  var c = Math.cos(a), s = Math.sin(a);
  return [[c,-s, 0, 0],
          [s, c, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]];
}

// [Vector], Integer -> Vector
function median(vs, d) {
  var m = [];
  for (var i = 0; i < d; i++) {
    m[i] = 0;
    for (var j = 0; j < vs.length; j++) {
      m[i] += vs[j][i];
    };
    m[i] = m[i]/d;
  };
  return m;
}

// (a->a), [a] -> [a] 
function map(f, xs) {
    var xs_out = [];
    xs.forEach(function (x) {
        xs_out[xs_out.length] = f(x);
    });
    return xs_out;
}

function to_char(i) {
  return String.fromCharCode(i);
}

/*
  CCW check based on reflection parity, requires points to be in screen or ndc space.

  [Vector, Vector, Vector] -> Bool */
function isCCW2D(vs)
{
  var x0 = vs[0][0]; var y1 = vs[1][1];
  var y0 = vs[0][1]; var x2 = vs[2][0];
  var x1 = vs[1][0]; var y2 = vs[2][1];
  var d = x2*(y0-y1)+x0*(y1-y2)+x1*(-y0+y2);
  return d < 0; // expecting a single reflection, because y-axis is pointing down in screen coordinates
}               // otherwise we would be expecting a positive value

/*
  CCW check based on dot product between camera-triangle vector and a triangle normal.
  Requires points to be in view space(camera is assumed to be at the origin)

  [Vector, Vector, Vector] -> Bool */
function isCCW3D(vs)
{
  var x0 = vs[0][0]; var x1 = vs[1][0]; var x2 = vs[2][0];
  var y0 = vs[0][1]; var y1 = vs[1][1]; var y2 = vs[2][1];
  var z0 = vs[0][2]; var z1 = vs[1][2]; var z2 = vs[2][2];  
  var d = x2*y1*z0-x1*y2*z0-x2*y0*z1+x0*y2*z1+x1*y0*z2-x0*y1*z2;
  return d < 0;
}

function load_model(url)
{
  var r = new XMLHttpRequest();
  r.open("get", url, false);
  r.send();
  if(window.JSON.parse)
  {
    var model = window.JSON.parse(r.responseText);
    if(model.vertecies && model.indecies && (model.indecies.length % 3) == 0)
      return model;
    else
      console.debug("Invalid model format");
  }
  else
  {
    console.debug("Your browser doesn't support native JSON parsing, go away.");
    return null;
  }
}

/* Data structure used to switch between modes */

function ModeRing(values, messages)
{
  this.values = values
  this.messages = messages
  this.selection = 0
}

ModeRing.prototype.Next = function () {
  this.selection = (this.selection + 1)  % this.values.length;
}

ModeRing.prototype.Previous = function () {
  this.selection = (this.selection - 1) % this.values.length;
  if(this.selection < 0)
    this.selection = (this.values.length - 1)
}

ModeRing.prototype.ModeMessage = function () {
  return this.messages[this.selection];
}

ModeRing.prototype.ModeValue = function () {
  return this.values[this.selection];
}

var renderer = new Object();
var rotate = true;
var dragging = false;
var drag_start = [];
var drag_vector = [];
var rotation_base;
var running = true;

var flash_begin_time = -1;
var flash_text = ""
var flash_duration = 1500

var CCW_MODES = ["CCW_2D", "CCW_3D", "NONE"]
var CCW_MESSAGES = ["Back-face culling by reflection parity", 
                    "Back-face culling by normal",
                    "No back-face culling"]

var MODEL_MODES = ["cube.json", "icosphere.json", "teaport.json", "torus.json", "monkey.json"]
var MODEL_MESSAGES = ["Cube", "Icosphere", "Teaport", "Torus", "Blender's Monkey"]

var culling_mode_ring = new ModeRing(CCW_MODES, CCW_MESSAGES)
var model_ring = new ModeRing(MODEL_MODES, MODEL_MESSAGES);

function main() {
  renderer.canvas = document.getElementById("main_canvas");
  renderer.focal_distance = 1.0;
  renderer.near_plane = 0.1;
  renderer.far_plane = 10.0;

  var model = load_model("cube.json");
  renderer.indecies = model.indecies;
  renderer.vertecies = model.vertecies;
  renderer.rotation = [-0.3,0,0];
  renderer.position = [0,0,5];

  renderer.ccw_mode = "CCW_2D";
  renderer.marker_mode = true;

  renderer.init();

  // setup drag events
  renderer.canvas.onmousedown = function(ev) { 
    dragging = true;
    drag_start = [ev.clientX, ev.clientY];
    rotation_base = renderer.rotation.clone();
  }

  window.onmouseup = function(ev) {
    if(dragging)
      dragging = false;
  }

  // zoom
  var on_mouse_wheel_handler = function(ev) {
    var firefox_scale = (-ev.detail)/50;
    var normal_scale = (ev.wheelDelta)/4000;
    renderer.scale += (normal_scale || firefox_scale);
  }

  if (renderer.canvas.addEventListener) { 
    // IE9, Chrome, Safari, Opera 
    renderer.canvas.addEventListener("mousewheel", on_mouse_wheel_handler, false); 
    // Firefox 
    renderer.canvas.addEventListener("DOMMouseScroll", on_mouse_wheel_handler, false); 
  } 
  // IE 6/7/8 
  else renderer.canvas.attachEvent("onmousewheel", on_mouse_wheel_handler);

  // setup mode switches
  window.onkeydown = function(ev) {
    switch (to_char(ev.keyCode)) {
      case 'R':
        rotate = !rotate
        flash_message(rotate ? "Rotation On" : "Rotation Off")
        break
      case 'C':
        culling_mode_ring.Next()
        renderer.ccw_mode = culling_mode_ring.ModeValue()
        flash_message(culling_mode_ring.ModeMessage());
        break
      case 'D':
        renderer.marker_mode = !renderer.marker_mode
        flash_message(renderer.marker_mode ? "Marking culled triangles" : "Hiding culled triangles")
        break
      case 'M':
        model_ring.Next()
        var model = load_model(model_ring.ModeValue());
        renderer.indecies = model.indecies;
        renderer.vertecies = model.vertecies;
        flash_message(model_ring.ModeMessage())
        break
    }
  }

  // start main loop
  window.requestAnimFrame(update, renderer.canvas);
}

window.onmousemove = function(ev) {
    if(dragging)
    {
      drag_vector = [ev.clientX, ev.clientY].v_sub_v(drag_start).v_scale(0.004);;
      var rotation_x_old = renderer.rotation[0];
      renderer.rotation[1] = rotation_base[1] - drag_vector[0];
      renderer.rotation[0] = rotation_base[0] - drag_vector[1];
      if(Math.abs(renderer.rotation[0]) > Math.PI/2) {
        renderer.rotation[0] = rotation_x_old;
      }
    }
  }

/* Flashes a message on canvas for a few seconds */
function flash_message(msg)
{
  flash_begin_time = (new Date()).getTime()
  flash_text = msg
}

function draw_flash_message() {
  var time_delta = (new Date()).getTime() - flash_begin_time 
  if(time_delta > 0 && time_delta < flash_duration) {
    var canvas = document.getElementById("main_canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.textAlign = 'center';
    context.font = "bold italic 14px sans-serif";
    context.fillText(flash_text, canvas.width/2, canvas.height-20);
  }
}

function draw_text_overlay()
{
  // draw key legend
  var context = document.getElementById("main_canvas").getContext("2d");
  context.fillStyle = "#ffffff";
  context.font = "bold 12px sans-serif";
  context.textAlign = 'left';
  context.fillText("R - rotation", 10, 20);
  context.fillText("C - culling method", 10, 40);
  context.fillText("D - display mode", 10, 60);
  context.fillText("M - switch model", 10, 80);
}

function update(){
  if(rotate && !dragging) 
    renderer.rotation = renderer.rotation.v_add_v([0.0,0.01,0.0]);
  
  renderer.draw();
  draw_text_overlay();
  draw_flash_message();

  if(running)
    window.requestAnimFrame(update, renderer.canvas); 
}

renderer.init = function(){
  this.aspect = this.canvas.width/this.canvas.height;
  // set defaults 
  this.color = this.color || "#ffffff";
  this.focal_distance = this.focal_distance || 1.0;
  this.near_plane = this.near_plane || 1.0;
  this.far_plane = this.far_plane || 1000.0;
  this.indecies = this.indecies || [];
  this.vertecies = this.vertecies || [];
  this.rotation = this.rotation || [0,0,0];
  this.position = this.position || [0,0,5];
  this.scale = this.scale || 1.0;
  this.marker_mode = this.marker_mode || true;
  this.marker_culled_color = this.marker_culled_color || "#ff0000";
  this.marker_non_culled_color = this.marker_non_culled_color || "#ffffff";
}

renderer.clear = function(){
  var context = this.canvas.getContext("2d");
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/* Convert vertex to Normalized Device Coordinates (or clip space)
   Essentially this function distorts a frustum of arbitrary dimensions 
   into a neat cube -1 to 1 on all sides. This makes it easier to convert 
   to screen space later. No actual clipping is performed in this demo. */
renderer.xform_ndc = function(v) {
    var d = renderer.focal_distance;
    var np = renderer.near_plane;
    var fp = renderer.far_plane;
    var a = renderer.aspect;

    var x = v[0];
    var y = v[1];
    var z = v[2];
    var out = [d*x/(z*a), d*y/z, (z-np)/(fp-np)];
    return out;
  };

/* Apply object transformation to vertex */
renderer.xform_object = function(v) {
    var RX = RotationX(renderer.rotation[0]);
    var RY = RotationY(renderer.rotation[1]);
    var RZ = RotationZ(renderer.rotation[2]);
    var T = Translation(renderer.position);
    var S = Scale(renderer.scale);
    var M = T.m_mul_m(S).m_mul_m(RX).m_mul_m(RY).m_mul_m(RZ);

    return M.m_mul_v([v[0], v[1], v[2], 1]);
  };                                //  ^
                                    //  |_ Padding with 1 to convert vector to homogeneous coordinates

/* Transform vector from ndc space to screen space */
renderer.xform_screen = function(v) {
  var w = renderer.canvas.width;
  var h = renderer.canvas.height;

  return [w/2 + v[0]*w, h/2 - v[1]*h, v[2]];
};                   //     ^
                     //     |_ This is the reflection in screen space - 
                     //        that's why CCW2D expects a single reflection             

renderer.draw = function() {

  // clear canvas
  this.clear();

  var context = this.canvas.getContext("2d");
  context.strokeStyle = this.color;

  for (var i = 0; i < this.indecies.length; i+=3) {
    var culled = false;

    var triangle = [this.vertecies[this.indecies[i]], 
                    this.vertecies[this.indecies[i+1]], 
                    this.vertecies[this.indecies[i+2]]];
 
    // apply model transformation matrix
    triangle = map(this.xform_object, triangle);

    // calculate marker position
    var marker;
    if(this.marker_mode) {
      marker = median(triangle, 3);
      marker = this.xform_screen(this.xform_ndc(marker));
    }

    if(this.ccw_mode == "CCW_3D") {
      culled = !isCCW3D(triangle);
    }
    
    // convert points to clip space
    triangle = map(this.xform_ndc, triangle);
    
    // convert points to screen space
    triangle = map(this.xform_screen, triangle);

    if(this.ccw_mode == "CCW_2D") {
      culled = !isCCW2D(triangle);
    }

    // draw the triangle
    if(!culled || this.marker_mode) {
      var v1 = triangle[0];
      var v2 = triangle[1];
      var v3 = triangle[2]; 
      context.beginPath();
      context.moveTo(v1[0], v1[1]);
      context.lineTo(v2[0], v2[1]);
      context.lineTo(v3[0], v3[1]);
      context.lineTo(v1[0], v1[1]);
      context.lineWidth = 1; 
      context.stroke();
    }  
    
    // draw markers
    if(this.marker_mode) {
      context.fillStyle = culled ? this.marker_culled_color : this.marker_non_culled_color;
      context.beginPath();
      context.arc(marker[0],marker[1],2,0*Math.PI,2*Math.PI);
      context.fill();
    }
  };
}