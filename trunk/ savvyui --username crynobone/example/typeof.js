var obj = {
	count: 1,
	boo: 1.5,
	world: true,
	hello: function() {
		return "world";	
	}
};
var p = SUI("h1 + p").fetch();
var data = ["hello","world","add me"];

var hello = function() {
	
};
hello.prototype.world = function() {
	
};

document.write('<ul>');
document.write('<li>obj = ' + SUI.fn.typeOf(obj) + ' = ' + typeof(obj) + ' = ' + obj.constructor + '</li>');
document.write('<li>data = ' + SUI.fn.typeOf(data) + ' = ' + typeof(data) + ' = ' + data.constructor + '</li>');
document.write('<li>obj.count = ' + SUI.fn.typeOf(obj.count) + ' = ' + typeof(obj.count) + ' = ' + obj.count.constructor + '</li>');
document.write('<li>obj.hello = ' + SUI.fn.typeOf(obj.hello) + ' = ' + typeof(obj.hello) + ' = ' + obj.hello.constructor + '</li>');
document.write('<li>obj.hello() = ' + SUI.fn.typeOf(obj.hello()) + ' = ' + typeof(obj.hello()) + ' = ' + obj.hello().constructor + '</li>');
document.write('<li>obj.world = ' + SUI.fn.typeOf(obj.world) + ' = ' + typeof(obj.world) + ' = ' + obj.world.constructor + '</li>');

document.write('<li>p = ' + SUI.fn.typeOf(p) + ' = ' + typeof(p) + ' = ' + p.constructor + '</li>');
document.write('<li>obj.boo = ' + SUI.fn.typeOf(obj.boo) + ' = ' + typeof(obj.boo) + ' = ' + obj.boo.constructor + '</li>');
document.write('<li>hello = ' + SUI.fn.typeOf(hello) + ' = ' + typeof(hello) + ' = ' + hello.constructor + '</li>');
document.write('</ul>');