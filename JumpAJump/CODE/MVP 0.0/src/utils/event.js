// 一个接一个触发回调函数
class Event {
	constructor(sender) {
		this._sender = sender;
		this._listeners = [];
	}

	attach (callback) {
		this._listeners.push(callback)
	}

	notify (args) {
		for(let i = 0; i < this._listeners.length; i++) {
			this._listeners[i](sender, args)
		}
	}
}

export default Event