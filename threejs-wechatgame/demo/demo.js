// webgl 官方文档与API https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API
///////////////////////shader绑定流程(静态3D图)///////////////////////////


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
// 详解见learn.md "glsl语法三种数据类型"
VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +  // 通过attribute类型定义顶点坐标, vec4是四维向量的意思
  // 'uniform mat4 u_ModelMatrix;\n' +
  // 'uniform mat4 u_ViewMatrix;\n' +
  // 'uniform mat4 u_ProjectionMatrix;\n' + 
  'void main () {\n' + 
    // 'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + 
    'gl_Position = a_Position;\n' + 
  '}\n' // 两个着色器都得有一个main函数(入口函数)

// 片元着色器源代码
FSHADER_SOURCE =
  'void main () {\n' + 
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +  // 全部渲染红色, gl_FragColor是内部定义好的变量
  '}\n' // 两个着色器都得有一个main函数(入口函数)

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

// var currentAngle = 0
// var g_last = Date.now()

// var tick = function () {
//   // update the new rotation angle
//   // 动态3D图部分 animate
//   // animate()
//   // draw
//   draw()
//   // requestAnimationFrame(tick)
// }






// 通过buffer往shader中传递相关的数据
function initVertexBuffers (gl) {
  // 顶点数据
  var vertices = new Float32Array([
    0, 0.5, -0.5, -0.5, 0.5, -0.5
  ])
  var n = 3
  // 创建 buffer
  var vertexBuffer = gl.createBuffer()
  // 将buffer绑定在gl(用于在画布上绘图的环境)上
  // gl.ARRAY_BUFFER : 顶点缓冲区对象 -> 适用于简单图形界面
  // gl.ELEMENT_ARRAY_BUFFER : 顶点索引缓冲区对象 -> 适用于多图形界面, 多个图形有重合的点(重复的点),使用索引来减少buffer的使用空间,相同的顶点坐标使用相同的索引即可
  // 参考链接: 了解OpenGL的几种Array Buffer: https://www.cnblogs.com/shenwenkai/p/6207562.html
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // write data into the buffer object
  // 给buffer中加入顶点数据vertices
  // gl.STATIC_DRAW: 如何管理缓冲区? 一次渲染后不会对缓冲区修改的意思, 是优化策略的一种
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // 现在缓冲区之中已经有数据了, 现在是要把缓冲区的数据传给shader的变量

  // get attribute a_Position address in vertex shader
  // 在 program 之中get到a_Position,这里的a_Position是我们在顶点着色器源代码中定义好的, 作为画布中展示图像的位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  // a_Position 和 buffer data绑定, 并且定义接收策略: 几个数字作一组成为一个坐标?数据类型是什么?
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  // enable a_Position variable
  // 启用a_Position
  gl.enableVertexAttribArray(a_Position)
  return n
}

// write the positions of vertices to a vertex shader
var n = initVertexBuffers(gl)



// 绘制工作



// clear canvas and add background color
// 用黑色清空当前画布颜色
gl.clearColor(0, 0, 0, 1)

// var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
// var modelMatrix = new Matrix4()

// var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
// var viewMatrix = new Matrix4()
// viewMatrix.lookAt(100, 100, 100, 0, 0, 0, 0, 1, 0)

// var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
// var projectionMatrix = new Matrix4()
// // projectionMatrix.perspective(120, 1, 0.1, 1000)
// projectionMatrix.ortho(-1, 1, -1, 1, 0.1, 1000)

function draw () {
  // modelMatrix.setRotate(currentAngle, 0, 1, 0)
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
  // gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

draw ()
// tick()
///////////////////////shader绑定流程(静态3D图)///////////////////////////




///////////////////////动态3D图部分///////////////////////////

// function animate () {
//   var now = Date.now()
//   var duration = now - g_last
//   g_last = now
//   currentAngle = currentAngle + duration / 1000 * 180
// }

///////////////////////动态3D图部分///////////////////////////
