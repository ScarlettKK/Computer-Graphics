# MVP 版本功能点:

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g93g34u38nj31ds0n0nod.jpg">

## 基本场景渲染

webGLRenderer: 将整个场景渲染到画布上

sense: 要渲染的元素, 包括光线的情况

camera: 将所有sense画出的场景坐标系转化成相机坐标系

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94l5jd2h9j31ds0n0ay4.jpg">

渲染流程:

`对象坐标系` -> (模型变换) -> `世界坐标系`                                                  => sense的功能

-> (视觉变换) -> `相机坐标系` -> (投影变换,切割渲染区域) -> `裁剪坐标系`                        => camera的功能

-> (透视除法, 解决透视近大远小的问题) -> `NDC/规范化设备坐标系` -> (视口变换) -> `屏幕坐标系`      => webGLRenderer的功能

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94l5s5gwdj31ds0n0ay4.jpg">

当然还需要了解一些其中的线性代数原理...

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94l5xgo0yj31ds0n013n.jpg">

<img src="https://tva1.sinaimg.cn/large/006y8mN6gy1g94lc88emoj31ds0n01g9.jpg">