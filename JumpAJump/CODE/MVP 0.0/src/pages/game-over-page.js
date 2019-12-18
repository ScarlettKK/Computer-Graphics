export default class GameOverPage {
	constructor(callbacks){
		this.callbacks = callbacks;
	}
	init (options) {
		// 这里我们要绘制一个2d的button,将其绘制到屏幕上
		// 原理是: 创建一个离屏的canvas,生成一张canvas的图片
		// 然后将这张图片作为一个纹理,贴到three.js的某一个obj上
		// 让camera去正前方看着这个obj
		// 最终效果显示就像一个2d的btn
		
		this.initGameOverCanvas(options)
	}

	initGameOverCanvas (options) {
		// 按照比例创建,以防文字变形
		const aspect = window.innerHeight / window.innerWidth;
		this.scene = options.scene;
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		// 纹理部分
		this.textture = new THREE.Texture(this.canvas)
		// 生成透明obj
		this.material = new THREE.MeshBasicMaterial({
			map: this.textture,
			transparent: true,
			side: THREE.DoubleSide
		}) // 设置双面后才可见
		this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight)
		this.obj = new THREE.Mesh(this.geometry, this.material)
		this.obj.position.z = 1;

		// 拿到画布
		this.context = this.canvas.getContext('2d')
		this.context.fillStyle = '#333'
		this.context.fillRect(0,0,(window.innerWidth - 200) / 2, (window.innerHeight - 100) / 2)

		// this.context.glTexParameter(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
		// this.context.glTexParameter(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);

		this.textture.needUpdate = true;
		this.context.fillStyle = '#eee'

		this.scene.add(this.obj)

		// 按钮画到哪个位置上
		//...明日待续
	}
	show () {
		console.log("gameOverPage show")
	}
}