# MVP 版本功能点:

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g93g34u38nj31ds0n0nod.jpg">

## 基本场景渲染

webGLRenderer: 将整个场景渲染到画布上

sense: 要渲染的元素, 包括光线的情况

camera: 将所有sense画出的场景坐标系转化成相机坐标系

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94lpknhvbj31ds0n018k.jpg">

渲染流程:

`对象坐标系` -> (模型变换) -> `世界坐标系`                                                  => sense的功能

-> (视觉变换) -> `相机坐标系` -> (投影变换,切割渲染区域) -> `裁剪坐标系`                        => camera的功能

-> (透视除法, 解决透视近大远小的问题) -> `NDC/规范化设备坐标系` -> (视口变换) -> `屏幕坐标系`      => webGLRenderer的功能

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94l5s5gwdj31ds0n0ay4.jpg">

当然还需要了解一些其中的线性代数原理...

线性代数基础: [WebGL学习系列-基础矩阵变换](https://blog.csdn.net/yanyan19880509/article/details/57411916)

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94l5xgo0yj31ds0n013n.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94lc88emoj31ds0n01g9.jpg">

## 透视投影推导

<img src="https://i.loli.net/2019/11/21/eYn1RQEqF7P2xSU.png">

<img src="https://i.loli.net/2019/11/21/TBRXQKHPxnJeSwd.png">

<img src="https://i.loli.net/2019/11/21/wqWbHmESu5GyANC.png">

<img src="https://i.loli.net/2019/11/21/6y8K1LeF9oSG4bB.png">

<img src="https://i.loli.net/2019/11/21/B9hyXZ8f6aVHPnt.png">

透视投影的结果与什么有关？

	透视投影前方近平面的长宽比、透视投影形成的fov视角、近平面和远平面的距离

## 正交投影推导

<img src="https://i.loli.net/2019/11/21/zuFPURYOr6JkBQt.png">

<img src="https://i.loli.net/2019/11/21/bRwLvry8ceduDBs.png">

正交投影的结果与什么相关？

	近平面和远平面的距离、近平面的大小

## 视图矩阵推导

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g975xpeswaj31ds0n0dza.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g975xtsyyij31ds0n0aya.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g975xxdwiwj31ds0n0ty0.jpg">

参考链接: [webgl开发第一道坎——矩阵与坐标变换](https://www.cnblogs.com/dojo-lzz/p/7223364.html)
