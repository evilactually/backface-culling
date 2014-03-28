
function load_model(url)
{
  var r = new XMLHttpRequest();
  r.open("get", url, false);
  r.send();
  if(window.JSON.parse)
  {
    return window.JSON.parse(r.responseText);
  }
  else
  {
    console.debug("Your browser doesn't support native JSON parsing, go away.");
    return null;
  }
}

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
     return window.setTimeout(callback, 1000/60);
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


function vector_add(a,b)
{
  var c = [];
  for (var i = 0; i < a.length; i++) {
    c[i] = a[i] + b[i];
  };
  return c;
}

function vector_xfrom(m,v) {
  return matrix_transpose(matrix_mul(m, matrix_transpose([v])))[0];
}

function matrix_transpose(a) {
  var rows = a.length;
  var cols = a[0].length;
  var b = [[]];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      b[j] = b[j] || new Array(cols);
      b[j][i] = a[i][j];
    }
  }
  return b;
}

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

/*
  CCW check based on reflection parity, requires points to be in screen or ndc space.

  [Vector, Vector, Vector] -> Bool */
function isCCW2D(vs)
{
  var x0 = vs[0][0];
  var y0 = vs[0][1];
  var x1 = vs[1][0];
  var y1 = vs[1][1];
  var x2 = vs[2][0];
  var y2 = vs[2][1];
  var d = x2*(y0-y1)+x0*(y1-y2)+x1*(-y0+y2);
  return d < 0; // expecting a single reflection, because y-axis is pointing down in screen coordinates
}               // otherwise we would be expecting a positive value

/*
  CCW check based on dot product between camera-triangle vector and a triangle normal.
  Requires points to be in view space(camera is assumed to be at the origin)

  [Vector, Vector, Vector] -> Bool */
function isCCW3D(vs)
{
  var x0 = vs[0][0];
  var y0 = vs[0][1];
  var z0 = vs[0][2];
  var x1 = vs[1][0];
  var y1 = vs[1][1];
  var z1 = vs[1][2];
  var x2 = vs[2][0];
  var y2 = vs[2][1];
  var z2 = vs[2][2];
  var d = x2*y1*z0-x1*y2*z0-x2*y0*z1+x0*y2*z1+x1*y0*z2-x0*y1*z2;
  return d < 0;
}

var renderer = new Object();

function main() {
  renderer.canvas = document.getElementById("main_canvas");
  renderer.focal_distance = 1;
  renderer.near_plane = 1.0;
  renderer.far_plane = 10.0;

  var model = load_model("cube.json");
  renderer.indecies = model.indecies;
  renderer.vertecies = model.vertecies;
  renderer.rotation = [0,0,0];
  renderer.position = [0,0,5];

  renderer.ccw_mode = "CCW_3D";

  renderer.init();

  renderer.draw();

  window.requestAnimFrame(update, renderer.canvas);

  var m = 
  [[2,0,0],
   [0,2,0],
   [0,0,2]];

  var m2 = 
  [[1,0,0],
   [0,2,0],
   [0,0,1]];

  //console.log(matrix_mul(m,m2));

  console.log(vector_transform(m, [1,2,3]));

  // renderer.canvas.onmousedown = function(ev) { 
  //   console.debug("click");
  //   var canvas = document.getElementById("main_canvas");
  //   var context = canvas.getContext("2d");

  //   context.beginPath();
  //   context.moveTo(10, 10);
  //   context.lineTo(200, 200);
  //   context.lineTo(100, 300);
  //   context.lineWidth = 2;
  //   context.strokeStyle = "#ffffff";
  //   context.stroke();
  // }

  // main loop

  // process input

  // (animation) modify model matrix

  // 

  // apply projection matrix

  // 



  // console.debug(V1.e(1));
//   var V2 = $V([9,-3,0]);

//   var d = V1.dot(V2);
// // d is 15

// var c = V1.cross(V2);
// // c is the vector (15,45,-45)

  console.debug("Hello");
}

function update(){
  //console.log("!!");
  renderer.rotation = vector_add(renderer.rotation, [0.01,0.01,0.01]);
  window.requestAnimFrame(update, renderer.canvas); 
  renderer.draw();
}

renderer.init = function(){
  this.aspect = this.canvas.width/this.canvas.height;
  // set defaults 
  renderer.color = renderer.color || "#ffffff";
  renderer.focal_distance = renderer.focal_distance || 1.0;
  renderer.near_plane = renderer.near_plane || 1.0;
  renderer.far_plane = renderer.far_plane || 1000.0;
  renderer.indecies = renderer.indecies || [];
  renderer.vertecies = renderer.vertecies || [];
  renderer.rotation = renderer.rotation || [0,0,0];
  renderer.position = renderer.position || [0,0,5];
}

renderer.clear = function(){
  var context = this.canvas.getContext("2d");
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

renderer.draw = function() {
   // clean canvas
    this.clear();
  var context = this.canvas.getContext("2d");
  context.strokeStyle = this.color;

  for (var i = 0; i < this.indecies.length; i+=3) {
    var triangle = [this.vertecies[this.indecies[i]].concat(1), 
                    this.vertecies[this.indecies[i+1]].concat(1), 
                    this.vertecies[this.indecies[i+2]].concat(1)];
    
    // apply model transformation matrix
    triangle = this.xform_object(triangle);

    if(this.ccw_mode == "CCW_3D" && !isCCW3D(triangle))
      continue;

    // convert points to clip space
    triangle = this.xform_ndc(triangle);

    // convert points to screen space
    triangle = this.xform_screen(triangle);

    if(this.ccw_mode != "CCW_3D" && !isCCW2D(triangle))
      continue;

    // draw the triangle
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
  };
}

/* 
  Take coordinates in view space and produces coordinates in clip space.
  Although no clipping is done in this demo, it's still a useful logical step before
  producing final screen coordinates. Think of this function as taking the whole 3d space
  that contains imaginary frustum and squashing it into a cube with sides from -1 to 1.

// [Vector] -> [Vector] */
renderer.xform_ndc = function(vs) {
  var vs_out = [];
  var d = this.focal_distance;
  var np = this.near_plane;
  var fp = this.far_plane;
  var a = this.aspect;
  for (var i = 0; i < vs.length; i++) {
    var x = vs[i][0];
    var y = vs[i][1];
    var z = vs[i][2];
    // Apply perspective distortion to x and y,
    // normalize frustum to a perfect cube -1 to 1 on every side   
    vs_out[i] = [d*x/(z*a), d*y/z, (z-np)/(fp-np)];
  };
  return vs_out;
}

/* 
  Constructs a matrix for model transformation and applies it

  [Vector] -> [Vector] */
renderer.xform_object = function(vs) {
  var r = this.rotation;
  var RX = RotationX(r[0]);
  var RY = RotationY(r[1]);
  var RZ = RotationZ(r[2]);
  var RXYZ = matrix_mul(matrix_mul(RX, RY), RZ);
  var T = Translation(this.position);
  var vs_out = [];
  for (var i = 0; i < vs.length; i++) {
    vs_out[i] = vector_xfrom(RXYZ, vs[i]);
    vs_out[i] = vector_xfrom(T, vs_out[i]);
  }
  return vs_out;
}

/* 
  Takes vertecies in NDC space and stretches their x and y values to fit the screen
  Ignores depth, but passes it through.

  [Vector] -> [Vector] */
renderer.xform_screen = function(vs) {
  if(vs == null)
    return null;
  var w = this.canvas.width;
  var h = this.canvas.height;
  var vs_out = [];
  for (var i = 0; i < vs.length; i++) {
    vs_out[i] = [w/2 + vs[i][0]*w, h/2 - vs[i][1]*h, vs[i][2]];
  };                              //        ^
  return vs_out;                  //      This is the reflection in screen space - 
}                                 //      that's why CCW2D expects a single reflection

