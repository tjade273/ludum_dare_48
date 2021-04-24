window.addEventListener("load", main);

const iterBound = 500;

function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    return null;
    }

    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}


function renderFrame(gl, uniform, )
{
    var x = document.getElementById('x_coord').value;
    var y = document.getElementById('y_coord').value;
    var zoom = document.getElementById('zoom').value;
    gl.uniform1i(uniform.IterBound, iterBound);
    gl.uniform2f(uniform.CanvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uniform.Center, x, y);
    gl.uniform1f(uniform.Zoom, zoom);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // window.requestAnimationFrame(ts => renderFrame(gl, u_IterBound, u_CanvasDimensions););
}

function main()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    
    var mandelbrot_program = initShaderProgram(gl, vertex_shader_source, fragment_shader_source);
    gl.useProgram(mandelbrot_program);

    var vertex_buf = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var a_ComplexCoords = gl.getAttribLocation(mandelbrot_program, "a_ComplexCoords");
    gl.enableVertexAttribArray(a_ComplexCoords);
    gl.vertexAttribPointer(a_ComplexCoords, 2, gl.FLOAT, false, 0, 0);
 
    var uniform = {
        IterBound: gl.getUniformLocation(mandelbrot_program, "u_IterBound"),
        CanvasDimensions: gl.getUniformLocation(mandelbrot_program, "u_CanvasDimensions"),
        Center: gl.getUniformLocation(mandelbrot_program, "u_Center"),
        Zoom: gl.getUniformLocation(mandelbrot_program, "u_Zoom")
    };
    renderFrame(gl, uniform);


    document.getElementById("x_coord").oninput = () => renderFrame(gl, uniform);
    document.getElementById("y_coord").oninput = () => renderFrame(gl, uniform);
    document.getElementById("zoom").oninput = () => renderFrame(gl, uniform);

    let zoomXBegin = 0;
    let zoomYBegin = 0;
    let zoomXEnd = 0;
    let zoomYEnd = 0;
    let isZoomDragging = false;

    let mouseCoords = {x: 0, y: 0};

    function setMouseCoords (e) {
	let xVal = Number(document.getElementById("x_coord").value);
	let yVal = Number(document.getElementById("y_coord").value);
	let zoomVal = document.getElementById("zoom").value;
	var widthOffset =  canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;
	var heightOffset =  canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
	let zoomScaleOffset = 4.0/(zoomVal * widthOffset);
	let topLeftX = xVal - 2.0/zoomVal;
	let topLeftY = yVal + 2.0/zoomVal;
	let mouseX = topLeftX + (e.offsetX * zoomScaleOffset);
	let mouseY = topLeftY - (e.offsetY * zoomScaleOffset);
	mouseCoords = {x: mouseX, y: mouseY};
	return mouseCoords;
    }
    
    canvas.addEventListener('mousemove', e => {
	let coords = setMouseCoords(e);
	document.getElementById("coords").textContent = "(" + coords.x.toFixed(6) + "," + coords.y.toFixed(6) + ")";
    });
        
    canvas.addEventListener('mousedown', e => {
	let coords = setMouseCoords(e);
	zoomXBegin = coords.x;
	zoomYBegin = coords.y;
	isZoomDragging = true;
    });

    canvas.addEventListener('mouseout', e => {
	isZoomDragging = false;
    });
    
    canvas.addEventListener('mouseup', e => {
	let minZoom = 0.0000001;
	let xDiff = Math.abs(zoomXBegin - zoomXEnd);
	let yDiff = Math.abs(zoomYBegin - zoomYEnd);
	if (isZoomDragging & (xDiff > minZoom)  & (yDiff > minZoom) ) {
	    let coords = setMouseCoords(e);
	    
	    zoomXEnd = coords.x;
	    zoomYEnd = coords.y;
	    isZoomDragging = false;
	    
	    let newX = Math.min(zoomXBegin, zoomXEnd) + xDiff / 2.0;
	    let newY = Math.min(zoomYBegin, zoomYEnd) + yDiff / 2.0;

	    let newZoom = 4.0 / Math.max(xDiff, yDiff);				 
	    
	    document.getElementById('x_coord').value = newX;
	    document.getElementById('y_coord').value = newY;
	    document.getElementById('zoom').value = newZoom;
	    
	    renderFrame(gl, uniform);	    
	}
    });   
}
