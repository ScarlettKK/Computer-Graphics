///////////////////////shader绑定流程(静态3D图)///////////////////////////

/*
创建静态3D图[针对webgl绘图环境类型]流程总结:
1. 获取html canvas dom元素
2. 通过该dom元素的 getContext方法, 获取到用于在画布上绘图的环境, 该环境才具有在canvas上绘制的能力
   这个环境可以由传入的参数指定类型, 具体有如下类型:
     "2d", 建立一个 CanvasRenderingContext2D 二维渲染上下文。
     "webgl" (或"experimental-webgl") 这将创建一个 WebGLRenderingContext 三维渲染上下文对象。只在实现WebGL 版本1(OpenGL ES 2.0)的浏览器上可用。
     "webgl2" (或 "experimental-webgl2") 这将创建一个 WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用。
     "bitmaprenderer" 这将创建一个只提供将canvas内容替换为指定ImageBitmap功能的ImageBitmapRenderingContext。
3. 在webgl绘图环境中, 创建一个 WebGLProgram (一个webgl绘图环境中可以创建多个WebGLProgram, 每个WebGLProgram有自己的顶点着色器、片元着色器, 也就是对眼不同的静态图像)
   WebGLProgram 是 WebGL API 的一部分，它由两个WebGLShaders （webgl 着色器）组成，
   分别为顶点着色器和片元着色器（两种着色器都是采用 GLSL 语言编写的）。
   创建一个 WebGLProgram 需要调用 GL 绘图环境的createProgram() 方法.
4. 定义 顶点着色器、片元着色器 (要在哪里画什么图像, 什么颜色)
5. 然后调用 GL 绘图环境的attachShader()方法给 WebGLProgram 附加上如上所述两个着色器, 一个完整的 WebGLProgram 就此创建完成
6. 调用 GL 绘图环境的 linkProgram、useProgram 方法, 将这个完整的 WebGLProgram 连接 和 使用到 GL 绘图环境中
7. (附加)可以给GL 绘图环境扩展属性program值为WebGLProgram, 便于访问
*/




// 获取canvas dom元素, 但这个dom元素并没有绘制的能力, 只有长宽的属性
var canvas = document.getElementById('myCanvas')
// 需要通过canvas dom元素的getContext方法获取到 -> 用于在画布上绘图的环境, 该环境才具有在canvas上绘制的能力
var gl = canvas.getContext('webgl')

/*
WebGLProgram 是 WebGL API 的一部分，
它由两个WebGLShaders （webgl 着色器）组成，
分别为 顶点着色器 和 片元着色器（两种着色器都是采用 GLSL 语言编写的）。

创建一个 WebGLProgram 需要调用 GL 环境的createProgram() 方法，
然后调用attachShader()方法附加上着色器，
之后你才能将它们连接到一个可用的程序。
*/
var program = gl.createProgram()

// 后面的大体流程..

// 定义 顶点着色器、片元着色器

// 通过 gl环境 的 attachShader 方法, 将 program 和 顶点着色器、片元着色器 绑定起来
// gl.attachShader(program, vertexShader)
// gl.attachShader(program, fragmentShader)

// 然后再到 linkProgram 、 useProgram
// gl.linkProgram(program)
// gl.useProgram(program)

// 更好地访问到program
// gl.program = program

///////////////////// 创建两个 shader ////////////////////////
var VSHADER_SOURCE, FSHADER_SOURCE

// 顶点着色器源代码
VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + 
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' + 
  'void main () {\n' + 
    'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + 
  '}\n'

// 片元着色器源代码
FSHADER_SOURCE =
  'void main () {\n' + 
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + 
  '}\n'

var vertexShader, fragmentShader

// 创建 顶点着色器、片元着色器 的函数
function createShader (gl, sourceCode, type) {
  // create shader
  // 根据传递进来的type 创建对应的shader
  var shader = gl.createShader(type)
  // shader 挂载相关的 source 代码
  gl.shaderSource(shader, sourceCode)
  // 编译相关的 shader 代码
  gl.compileShader(shader)
  // shader return出去
  return shader
}

// 创建 顶点着色器、片元着色器
// define vertex shader
vertexShader = createShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER)
// define frament shader
fragmentShader = createShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER)

///////////////////// 创建两个 shader ////////////////////////

// attach shader to program
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

// link program to context
gl.linkProgram(program)
gl.useProgram(program)
gl.program = program
///////////////////////shader绑定流程(静态3D图)///////////////////////////




///////////////////////动态3D图部分///////////////////////////
var currentAngle = 0
var g_last = Date.now()

var tick = function () {
  // update the new rotation angle
  animate()
  // draw
  draw()
  requestAnimationFrame(tick)
}

function initVertexBuffers (gl) {
  var vertices = new Float32Array([
    0, 0.5, -0.5, -0.5, 0.5, -0.5
  ])
  var n = 3
  var vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  // get attribute a_Position address in vertex shader
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  // enable a_Position variable
  gl.enableVertexAttribArray(a_Position)
  return n
}

// write the positions of vertices to a vertex shader
var n = initVertexBuffers(gl)

gl.clearColor(0, 0, 0, 1)

var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
var modelMatrix = new Matrix4()

var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
var viewMatrix = new Matrix4()
viewMatrix.lookAt(100, 100, 100, 0, 0, 0, 0, 1, 0)

var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
var projectionMatrix = new Matrix4()
// projectionMatrix.perspective(120, 1, 0.1, 1000)
projectionMatrix.ortho(-1, 1, -1, 1, 0.1, 1000)

function animate () {
  var now = Date.now()
  var duration = now - g_last
  g_last = now
  currentAngle = currentAngle + duration / 1000 * 180
}

function draw () {
  // clear canvas and add background color
  modelMatrix.setRotate(currentAngle, 0, 1, 0)
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

tick()
///////////////////////动态3D图部分///////////////////////////
