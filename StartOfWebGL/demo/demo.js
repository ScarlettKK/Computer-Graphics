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
// 一开始源代码写的是传人的a_Position,直接用于画图,没有任何变换
// 后面我们传入一个旋转矩阵,这样就可以得到旋转后的a_Position
VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +  // 通过attribute类型定义顶点坐标, vec4是四维向量的意思
  'uniform mat4 u_ModelMatrix;\n' + // 旋转矩阵,定义为常量uniform类型
  'uniform mat4 u_ViewMatrix;\n' + // 应用视图变换矩阵
  'uniform mat4 u_ProjectionMatrix;\n' + // 应用投影矩阵
  'void main () {\n' + 
    // 'gl_Position =  u_ViewMatrix * u_ModelMatrix * a_Position;\n' +  
    'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + // a_position的位置乘以旋转矩阵, 现在加上乘以视图矩阵以及投影矩阵
    // 'gl_Position = a_Position;\n' + 
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
  // 给a_Position每一个顶点乘以一个旋转矩阵,就可以得到旋转后的坐标
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

// 旋转矩阵定义
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
// 用matrix.js(依赖文件)获取变换矩阵的值(直接返回)
// 通过一些设定,就可以得到沿着某轴旋转的变换矩阵 如modelMatrix.setRotate(75,0,1,0)为绕y轴旋转75度的效果
var modelMatrix = new Matrix4()

// 视图矩阵定义
var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')

// 视图矩阵
var viewMatrix = new Matrix4()
// LookAt()，定义： 其定义在UnityEngine.Transform类中，
// public void LookAt(Vector3 worldPosition);
// public void LookAt(Transform target);
// 用法： 一：transform.LookAt(new Vector3(1,1,1));
// 使游戏对象看向该坐标点（游戏对象的z轴指向（1，1，1）点）；
// 二：transform.LookAt(gameobject.transform)
// 使游戏对象看向gameobject的transform的position;
// 在场景中创建cube与Sphere两个游戏对象，将脚本挂载到Cube上；

// 这里我们在matrix.js中自定义lookAt方法,应用矩阵变换
viewMatrix.lookAt(100, 100, 100, 0, 0, 0, 0, 1, 0)

// 投影矩阵
var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
var projectionMatrix = new Matrix4()
// 这里我们在matrix.js中自定义perspective方法,应用矩阵变换
projectionMatrix.perspective(120, 1, 0.1, 1000)
// 这里我们在matrix.js中自定义ortho方法,应用矩阵变换
projectionMatrix.ortho(-1, 1, -1, 1, 0.1, 1000)
// 旋转矩阵定义

function draw () {
  // 画图, 更新旋转角度
  modelMatrix.setRotate(currentAngle, 0, 1, 0)
  // 往u_ModelMatrix变量中传递数据
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  // 将视图矩阵的数据传递到顶点着色器中, viewMatrix就是我们在js代码中需要计算的视图矩阵
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

// draw ()
tick()
///////////////////////shader绑定流程(静态3D图)///////////////////////////




///////////////////////动态3D图部分///////////////////////////

// 原理: 给三角形每一个顶点乘以一个旋转矩阵,就可以得到旋转后的坐标

// 每秒钟转多少,动起来,更新旋转角度
// 初始化角度为0
var currentAngle = 0
// 初始化现在的时间
var g_last = Date.now()

function tick() {
  // update the new rotation angle
  // 动态3D图部分 animate, 更新新的旋转角
  animate()
  // draw 绘制旋转后的三角形
  draw()
  // requestAnimationFrame: 通用自带API
  // 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
  // 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
  requestAnimationFrame(tick)
}

// 更新新的旋转角
function animate () {
  var now = Date.now()
  var duration = now - g_last
  g_last = now
  currentAngle = currentAngle + duration / 1000 * 180
}

///////////////////////动态3D图部分///////////////////////////
