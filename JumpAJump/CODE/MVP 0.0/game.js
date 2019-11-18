// 小游戏入口
import adapter from './libs/weapp-adapter.js'
import * as THREE from './libs/three.js'

// 设置canvas长宽
var width = 400
var height = 400



// 获取webgl渲染器

// 微信小程序里面没有dom操作接口, 下面代码不可用
// var canvas = document.getElementById('demo-canvas')
// 此时需要adapter
// 参考链接: https://developers.weixin.qq.com/minigame/dev/guide/best-practice/adapter.html

// 可以使用 wx.createCanvas 和 wx.createImage 来封装一个 document(如下代码)
// 也可以把官方提供的代码包编译打包后的代码(weapp-adapter.js)导入到项目中(官方实现了一个 Adapter 名为 weapp-adapter， 并提供了完整的源码，供开发者使用和参考。)
// var document = {
//     createElement: function (tagName) {
//         tagName = tagName.toLowerCase()
//         if (tagName === 'canvas') {
//             return wx.createCanvas()
//         }
//         else if (tagName === 'image') {
//             return wx.createImage()
//         }
//     }
// }
// var canvas = document.createElement('canvas')

var renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
// 获取scene
var scene = new THREE.Scene()
// 获取camera,使用正交相机(2d平面效果),设置上下左右前后的坐标情况,以便可以被相机截取
var camera = new THREE.OrthographicCamera(-width / 2, width / 2,
height / 2, -height / 2, -1000, 1000)



// 给canvas绘画屏幕用黑色清空
renderer.setClearColor(new THREE.Color(0x000000, 1.0))
// 给renderer本身设置一个大小
renderer.setSize(400, 400)



// 画三角形, Shape可以基于路线画出各种形状的图形
var triangleShape = new THREE.Shape()
// 起始画笔移动到0, 100)
triangleShape.moveTo(0, 100)
// 画一条线到(-100, -100)
triangleShape.lineTo(-100, -100)
// 再画一条线到(100, -100)
triangleShape.lineTo(100, -100)
// 再画一条线到(0, 100)
triangleShape.lineTo(0, 100)



// 使用Shape创建geometry几何体
var geometry = new THREE.ShapeGeometry(triangleShape)
// 几何体用什么素材material来进行绘制(光面?哑光?)
var material = new THREE.MeshBasicMaterial({
  color: 0xff0000, // 颜色:红色
  side: THREE.DoubleSide // 单面/双面? 默认是单面
})
// 整合几何体和材质(类似于结合vertex与fragment)
var mesh = new THREE.Mesh(geometry, material)
// 设置mesh的位置
mesh.position.x = 0
mesh.position.y = 0
// 相机一般设置在原点
mesh.position.z = 1
// 将mesh添加在sence中
scene.add(mesh)



// 设置camera的位置
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
// 相机望向哪
camera.lookAt(new THREE.Vector3(0, 0, 1))



// 让三角形动起来的部分
var currentAngle = 0
var lastTimestamp = Date.now()

// 获取每秒钟的旋转角度
var animate = function () {
  var now = Date.now()
  var duration = now - lastTimestamp
  lastTimestamp = now
  currentAngle = currentAngle + duration / 1000 * Math.PI
}

var render = function () {
  // 计算角度
  animate()
  // 将mesh旋转 指定的角度, 通过rotation.set即可设定
  mesh.rotation.set(0, 0, currentAngle)
  // 画图指令
  renderer.render(scene, camera)
  // 进行动画逐帧的渲染
  requestAnimationFrame(render)
}

render()