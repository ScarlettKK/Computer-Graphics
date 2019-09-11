# three.js -- 仿微信小游戏跳一跳

## Charpter1 项目背景 

### 微信小游戏

微信小游戏是微信小程序SDK的升级, 是微信小程序环境中支持游戏的形式

(SDK即“软体开发工具包”，一般是一些被软件工程师用于为特定的软件包、软件框架、硬件平台、操作系统等建立应用软件的开发工具的集合。通俗点是指由第三方服务商提供的实现软件产品某项功能的工具包。)

运行在微信客户端内 借助小程序 实现游戏形态

轻量级 传播快 小程序平台 社交属性

一个微信APP嵌套了多个游戏APP,用户不需要再去额外下载专门的游戏APP

#### 技术背景

从技术层面看, 微信小游戏是对H5小游戏的性能升级

<img src="https://img2018.cnblogs.com/blog/1147701/201908/1147701-20190821170129663-947712028.png">

<img src="https://img2018.cnblogs.com/blog/1147701/201908/1147701-20190821170149501-79718206.png">

之前canvas元素不是在微信的webkit内核中渲染的, 而是在微信原生组件中进行渲染, 原生组件由于没有webkit引擎, 对webGL是不支持的. 所以微信小游戏是微信小程序SDK的升级, 让原生的canvas组件去支持webGL.

微信小游戏与基于DOM的H5小游戏不同, 因为[微信小程序并不具备DOM和BOM的能力]. 

但对于基于canvas的H5小游戏, 我们是可以把它迁移到微信小程序上的, 因为微信小程序在SDK升级之后支持了canvas API.

还有一类基于游戏引擎的H5小游戏, 在游戏引擎中开发完成后, 直接编译成H5游戏代码. 好处是很多基础功能都已经在游戏引擎中集成好了, 开发人员只需要专注于业务逻辑的开发, 并且这类H5小游戏也是可以迁移到微信小程序上的.

在微信小游戏中, 所有的游戏界面都是canvas绘制出来的, 所以微信小程序的page(WXML、WXSS)是不需要用到的. 所以在微信小游戏中, page的概念被直接删除, 而是引入了game.js来作为整个程序的启动入口.

但在微信小程序中, 为开发人员提供了Adapter.js来模拟DOM、BOM的操作

#### 产品形态

分为 2D游戏(canvas) 与 3D游戏(webGL)

#### 微信小游戏的优点



### three.js

webGL API -> three.js API(封装) -> 3D应用(业务需求)

如果使用原生的webGL API来开发 效率较低 没有对3D应用业务需求进行封装和抽象 开发成本过高

three.js 可以应用于 3D游戏 3D可视化 webAI

### 学习目的

掌握微信小游戏平台特性

深入实战three.js框架并理解原理

加深对前端对浏览器渲染的理解

为后续技术的职业发展拓宽道路

## Charpter2 微信小游戏平台与特性 

### 微信开发者工具

微信小游戏是微信小程序的一种类型,所以同样使用微信开发者工具

但其中的区别是,当我们通过微信小游戏进行开发的时候, 微信小程序的page(WXML、WXSS)是不需要用到的, 在微信小游戏中page的概念被直接删除, 而是引入了game.js来作为整个程序的启动入口.

微信开发者工具界面:

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6fifijdaxj31ds0n0mzk.jpg">

游戏开发过程中也应该关注内存占用的问题, 避免性能低下

### 小游戏特性

### 小游戏相关API使用方式

### ES6相关特性使用

## Charpter3 Three.js核心概念

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6nkkkdr1kj31ds0n07ku.jpg">

为什么不使用webGL直接进行开发?

webGL是相对底层的代码, 相当于不用框架用原生的JS进行开发, 对于大型项目组织架构和开发思路不利. 而使用Three.js进行开发, 相当于使用了框架, 进行了底层的抽象和设计模式的封装.

### 什么是webGL?

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6nkkp4ig3j31ds0n0to2.jpg">

OpenGL ES (OpenGL for Embedded Systems) 是 OpenGL三维图形 API 的子集，针对手机、PDA和游戏主机等嵌入式设备而设计. 

OpenGL ES提供了控制移动端显卡的一系列接口, 移除了OpenGL中一些低效的API, 并针对移动端作出了优化.

webGL是OpenGL ES标准在 JS上的一个绑定, 基本标准与OpenGL相同, 并且在浏览器环境下运行.

在实际游戏场景中, 需要很大的矩阵变换运算量, 所以需要高性能的显卡, 以及代码能力的调优.

### GPU

GPU(图形处理器)的ALU(计算单元)部分非常多, 但相对CPU没有很强的控制能力(control)与缓存能力(cache), 不适用于执行复杂的控制逻辑指令集, 适用于数量巨大重复较多的简单运算指令(如矩阵运算)

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6telwrv9aj31ds0n0q44.jpg">

如何对GPU进行编程?

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6vwri6dp8j31ds0n0dhr.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6vwrpppmuj31ds0n0q4g.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g6vwrvai86j31ds0n076h.jpg">

### 游戏开发与调优

## 需求分析

## 面向对象设计

## 项目结构

## 迭代优化
