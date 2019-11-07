// 自己写一遍, 理清思路
// canvasDrawEnvironment API的套路:创建一个, 绑定一个
// API基本上都是canvasDrawEnvironment出的

// get绘图环境
var canvasDOM = document.getElementById('myCanvas')
var canvasDrawEnvironment = canvasDOM.getContext('webgl')


// 整顶点着色器、片元着色器
var webglProgram = canvasDrawEnvironment.createProgram()
var Frage_Shader_Source = `void main(){
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`
var Vertex_Shader_Source = `
attribute vec4 triangle_point_Position;
void main(){
	gl_Position = triangle_point_Position;
}`
function createShader(canvasDrawEnvironment, sourceCode, type){
	var shader = canvasDrawEnvironment.createShader(type)
	canvasDrawEnvironment.shaderSource(shader, sourceCode)
	canvasDrawEnvironment.compileShader(shader);
	return shader;
}
var fragmentShader = createShader(canvasDrawEnvironment, Frage_Shader_Source, canvasDrawEnvironment.FRAGMENT_SHADER)
var vertexShader = createShader(canvasDrawEnvironment, Vertex_Shader_Source, canvasDrawEnvironment.VERTEX_SHADER)
canvasDrawEnvironment.attachShader(webglProgram, fragmentShader)
canvasDrawEnvironment.attachShader(webglProgram, vertexShader)
canvasDrawEnvironment.linkProgram(webglProgram)
canvasDrawEnvironment.useProgram(webglProgram)
canvasDrawEnvironment.webglProgram = webglProgram;



// 整顶点着色器缓冲区
function initVertexBuffer(canvasDrawEnvironment){
	var vertices =  new Float32Array([
		0, 0.5, -0.5, -0.5, 0.5, -0.5
	])
	var vertexBuffer = canvasDrawEnvironment.createBuffer()
	canvasDrawEnvironment.bindBuffer(canvasDrawEnvironment.ARRAY_BUFFER, vertexBuffer)
	canvasDrawEnvironment.bufferData(canvasDrawEnvironment.ARRAY_BUFFER, vertices, canvasDrawEnvironment.STATIC_DRAW)

	var triangle_point_Position = canvasDrawEnvironment.getAttribLocation(canvasDrawEnvironment.webglProgram, 'triangle_point_Position')
	canvasDrawEnvironment.vertexAttribPointer(triangle_point_Position, 2, canvasDrawEnvironment.FLOAT, false, 0, 0)
	canvasDrawEnvironment.enableVertexAttribArray(triangle_point_Position)
}
initVertexBuffer(canvasDrawEnvironment)



// 画图
canvasDrawEnvironment.clearColor(0, 0, 0, 1)
canvasDrawEnvironment.clear(canvasDrawEnvironment.COLOR_BUFFER_BIT)
canvasDrawEnvironment.drawArrays(canvasDrawEnvironment.TRIANGLES, 0, 3)

