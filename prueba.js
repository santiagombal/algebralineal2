var corriendo = false;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var raf;

var selectedRadius = 5;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function desviacion(a) {
	var offX = offY = 0;
	if (a.offsetParent) {
		do {
			offX += a.offsetLeft;
			offY += a.offsetTop;
		} while (a = a.offsetParent);
		return {x:offX,y:offY}
	}
}

// Clase de vectores
vectores = []

function vector(x,y) {
	this.x = x;
	this.y = y;
	this.color = getRandomColor();
	this.potSelected = false;
	this.selected = false;

	this.draw = function() {

		ctx.save();
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.translate(canvas.width/2,canvas.height/2);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(this.x,-this.y);
		ctx.stroke();
		

		if (this.potSelected) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x,-this.y,selectedRadius,0, Math.PI *2);
			ctx.fill()
		}
		ctx.restore();
	};

	vectores.push(this);
};

function clear() {
	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}


// Clase de rectangulos
rectangulos = []
function rectangulo(x1,y1,x2,y2) {
	this.vec1 = new vector(x1,y1);
	this.vec2 = new vector(x2,y2);

	this.colorO = 'rgba(255,0,0,.5)';
	this.colorNO = 'rgba(0,0,255,.5)';

	rectangulos.push(this);
	this.draw = function() {
		ctx.save();
		var x = this.vec1.x;
		var y = this.vec1.y;
		var z = this.vec2.x;
		var w = this.vec2.y;
		console.log(det(x,y,z,w));
		if (det(x,y,z,w)>= 0) {
			ctx.fillStyle = this.colorO;
		} else {
			ctx.fillStyle = this.colorNO;
		}
		
		ctx.translate(canvas.width/2,canvas.height/2);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(x,-y);
		ctx.lineTo(x + z, -y - w);
		ctx.lineTo(z,-w);
		ctx.closePath();
		ctx.fill();
		ctx.restore()
	};
}

function draw() {

	offset = desviacion(canvas);

	clear();

	for (var i=0; i < rectangulos.length; i++) {
		rectangulos[i].draw();
	};

	for (var i=0; i < vectores.length; i++) {
		vectores[i].draw();	
	};
}

function det(x,y,z,w) {
	return x*w - y*z
}

function init() {
	// Aqui va todo lo que requiere cargarse al inicio.
	rectPrincipal = new rectangulo(0,100,100,0);

	offset = desviacion(canvas);

	raf = window.requestAnimationFrame(draw);
}

function distancia(x1,y1,x2,y2) {
	return Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

function updatePotSelection(e) {
	x = e.clientX-offset.x;
	y = e.clientY-offset.y;
	relX = x - canvas.width/2;
	relY = canvas.height/2 - y;

	for (var i=0; i < vectores.length; i++) {
		if (distancia(relX,relY,vectores[i].x,vectores[i].y) <= selectedRadius) {
			vectores[i].potSelected = true;
		} else {
			vectores[i].potSelected = false;
		}

	}
}

function updateSelection(e) {
	x = e.clientX-offset.x;
	y = e.clientY-offset.y;
	relX = x - canvas.width/2;
	relY = canvas.height/2 - y;

	for (var i=0; i < vectores.length; i++) {
		if (distancia(relX,relY,vectores[i].x,vectores[i].y) <= selectedRadius) {
			vectores[i].selected = true;
			break;
		} 

	}
}

function removeSelection() {
	for (var i=0; i < vectores.length; i++) {
		vectores[i].selected = false;
	}
}

function updateVectPos(e) {
	x = e.clientX-offset.x;
	y = e.clientY-offset.y;
	relX = x - canvas.width/2;
	relY = canvas.height/2 - y;

	for (var i=0; i< vectores.length; i++) {
		if (vectores[i].selected) {
			vectores[i].x = relX;
			vectores[i].y = relY;
		}
	}
}

canvas.addEventListener('mousedown',function(e) {
	draw();
	updateSelection(e);
});

canvas.addEventListener('mousemove',function(e) {
	updatePotSelection(e);
	updateVectPos(e);
	draw();
});

canvas.addEventListener('mouseup', function(e) {
	removeSelection();
})
