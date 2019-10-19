#创建静态3D图[针对webgl绘图环境类型]流程总结:

注: 下文用到的gl变量,为 var gl = canvas.getContext('webgl'), 也就是用于在画布上绘图的环境

1. 获取html canvas dom元素

2. 通过该dom元素的 getContext方法, 获取到用于在画布上绘图的环境, 该环境才具有在canvas上绘制的能力

    这个环境可以由传入的参数指定类型, 具体有如下类型:
    "2d" 建立一个 CanvasRenderingContext2D 二维渲染上下文。
    "webgl" (或"experimental-webgl") 这将创建一个 WebGLRenderingContext 三维渲染上下文对象。只在实现WebGL 版本1(OpenGL ES 2.0)的浏览器上可用。
    "webgl2" (或 "experimental-webgl2") 这将创建一个 WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用。
    "bitmaprenderer" 这将创建一个只提供将canvas内容替换为指定ImageBitmap功能的ImageBitmapRenderingContext。

3. 在webgl绘图环境中, 创建一个 WebGLProgram (一个webgl绘图环境中可以创建多个WebGLProgram,每个WebGLProgram有自己的顶点着色器、片元着色器, 也就是对眼不同的静态图像)
    WebGLProgram 是 WebGL API 的一部分，它由两个WebGLShaders （webgl 着色器）组成，
    分别为顶点着色器和片元着色器（两种着色器都是采用 GLSL 语言编写的）。
    创建一个 WebGLProgram 需要调用 GL 绘图环境的createProgram() 方法.

4. 创建 顶点着色器、片元着色器 -> ***操作详情见下文***

5. 然后调用 GL 绘图环境的attachShader()方法给 WebGLProgram 附加上如上所述两个着色器, 一个完整的 WebGLProgram 就此创建完成

6. 调用 GL 绘图环境的 linkProgram、useProgram 方法, 将这个完整的 WebGLProgram 连接 和 使用到 GL 绘图环境中

7. (附加)可以给GL 绘图环境扩展属性program值为WebGLProgram, 便于访问

8. 初始化一个顶点buffer,用于接收顶点数据 -> ***操作详情见下文***

9. 清空当前画布颜色
	
	gl.clearColor(0, 0, 0, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)

10. 绘制三角形

	gl.drawArrays(gl.TRIANGLES, 0, n)


## 创建 顶点着色器、片元着色器 流程

1. 定义 顶点着色器、片元着色器 源代码, 也就是你想要画什么亚子的图

	顶点着色器源代码 = 定义顶点坐标接收变量(注意这里只是变量没用值) + main函数(入口函数)

	片元着色器 = main函数(入口函数,其中定义了渲染颜色)

2. 创建 顶点着色器、片元着色器

	根据指定的type 创建对应的shader
	var shader = gl.createShader(type)

	shader 挂载相关的 source 代码
	gl.shaderSource(shader, sourceCode)

	编译相关的 shader 代码
	gl.compileShader(shader)

	至此shader创建成果


## 初始化顶点buffer的流程

为什么我们需要顶点buffer?

"之前的方式可以通过循环来绘制多个点，一次需要绘制多个点，需要同时传递进去多个点的数据。刚好，在WebGL中提供了一种机制：缓存区对象（buffer data）,缓存区对象可以同时向着色器传递多个顶点坐标。缓存区是WebGL中的一块内存区域，我们可以向里面存放大量顶点坐标数据，可随时供着色器使用。"

1. 定义顶点数据(数组, 要在哪几个地方留下点)

2. 创建buffer

	var vertexBuffer = gl.createBuffer()

3. 将buffer绑定在gl(用于在画布上绘图的环境)上

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

	第一个参数的含义:
	gl.ARRAY_BUFFER : 顶点缓冲区对象 -> 适用于简单图形界面
	gl.ELEMENT_ARRAY_BUFFER : 顶点索引缓冲区对象 -> 适用于多图形界面, 多个图形有重合的点(重复的点),使用索引来减少buffer的使用空间,相同的顶点坐标使用相同的索引即可
	参考链接: 了解OpenGL的几种Array Buffer: https://www.cnblogs.com/shenwenkai/p/6207562.html

4. 给buffer中加入第1步中定义的顶点数据

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

	最后一个参数: gl.STATIC_DRAW: 如何管理缓冲区? 一次渲染后不会对缓冲区修改的意思, 是优化策略的一种

至此缓冲区之中已经有数据了, 现在是要把缓冲区的数据传给shader的变量

5. 在 program 之中get到a_Position,这里的a_Position是我们在顶点着色器源代码中定义好的 顶点坐标接收变量 , 作为画布中展示图像的位置

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position')

6. a_Position 和 buffer data绑定, 并且定义接收策略: 几个数字作一组成为一个坐标?数据类型是什么?

	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

7. 启用a_Position
	
	gl.enableVertexAttribArray(a_Position)

缓冲区创建完毕




