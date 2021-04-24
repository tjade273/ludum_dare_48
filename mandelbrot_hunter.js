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


function renderFrame(gl, u_IterBound, u_CanvasDimensions)
{
    gl.uniform1i(u_IterBound, iterBound);
    gl.uniform2f(u_CanvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // window.requestAnimationFrame(ts => renderFrame(gl, u_IterBound, u_CanvasDimensions););
}

function main()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    
    console.log(vertex_shader_source);
    var mandelbrot_program = initShaderProgram(gl, vertex_shader_source, fragment_shader_source);
    gl.useProgram(mandelbrot_program);

    var vertex_buf = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var a_ComplexCoords = gl.getAttribLocation(mandelbrot_program, "a_ComplexCoords");
    gl.enableVertexAttribArray(a_ComplexCoords);
    gl.vertexAttribPointer(a_ComplexCoords, 2, gl.FLOAT, false, 0, 0);
 

    var u_IterBound = gl.getUniformLocation(mandelbrot_program, "u_IterBound");
    var u_CanvasDimensions = gl.getUniformLocation(mandelbrot_program, "u_CanvasDimensions"); 
    renderFrame(gl, u_IterBound, u_CanvasDimensions);
}
