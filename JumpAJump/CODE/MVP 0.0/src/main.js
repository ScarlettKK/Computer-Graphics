/*
 * 游戏主函数
 */
import * as THREE from '../libs/three.js'
// 因为后续要使用three.js的场景比较多,所以这里直接把three挂载到window上
window.THREE = THREE
import game from './game/game.js'

class Main {
  constructor(){

  }

  // ES6 新语法,静态函数
  // 类的所有方法都定义在类的prototype属性上面，所有类中定义的方法都会被实例继承，
  // 如果在类方法前面加上static关键字就不会被实例继承了。
  static init(){
    game.init()
  }
}

// 返回一个main函数的实例
export default Main


