window.addEventListener("load", main);
const iterBound = 30;

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

function render_frame(gl, uniform, x, y, zoom)
{
    gl.uniform1i(uniform.IterBound, iterBound);
    gl.uniform2f(uniform.CanvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uniform.Center, x, y);
    gl.uniform1f(uniform.Zoom, zoom);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function draw_main(gl, uniform)
{
    var x = document.getElementById('x_coord').value;
    var y = document.getElementById('y_coord').value;
    var zoom = document.getElementById('zoom').value;

    render_frame(gl, uniform, x, y, zoom);
    // window.requestAnimationFrame(ts => draw_main(gl, u_IterBound, u_CanvasDimensions););
}

function draw_target(gl, uniform)
{
    var a = 0;
    var b = 0;
    var zoom = 1;
    render_frame(gl, uniform, a, b, zoom);
    for(var i = 0; i < 8; i++){
        var height = gl.drawingBufferHeight;
        var width = gl.drawingBufferWidth;
        var pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        boundary = [];
        for(var x = 1; x < width - 1; x++) {
            for(var y = 1; y < height - 1; y++) {
                if(pixels[(x + y * width)*4 + 3] == 255) {
                    var left = pixels[((x - 1) + y * width)*4 + 3];
                    var right = pixels[((x + 1) + y * width)*4 + 3];
                    var up = pixels[(x + (y + 1)*width)*4 + 3];
                    var down = pixels[(x + (y - 1)*width)*4 + 3];
                
                    if(left+right+up+down < 255*4 ){
                        boundary.push([x, y]);
                    }
                }
            }
        }
        var center_px = boundary[Math.floor(Math.random() * boundary.length)];
    
        a = (4 * center_px[0] / width - 2) / zoom + a;
        b = (4 * center_px[1] / height - 2) / zoom + b;
        zoom *= 1 +  Math.random();
        render_frame(gl, uniform, a, b, zoom);
    }
    console.log(`target: ${a}, ${b}, ${zoom}`);
}

/* Setup program and return uniform locations */
function setup_canvas(gl)
{
    var mandelbrot_program = initShaderProgram(gl, vertex_shader_source, fragment_shader_source);
    gl.useProgram(mandelbrot_program);

    var vertex_buf = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var a_ComplexCoords = gl.getAttribLocation(mandelbrot_program, "a_ComplexCoords");
    gl.enableVertexAttribArray(a_ComplexCoords);
    gl.vertexAttribPointer(a_ComplexCoords, 2, gl.FLOAT, false, 0, 0);

    return {
        IterBound: gl.getUniformLocation(mandelbrot_program, "u_IterBound"),
        CanvasDimensions: gl.getUniformLocation(mandelbrot_program, "u_CanvasDimensions"),
        Center: gl.getUniformLocation(mandelbrot_program, "u_Center"),
        Zoom: gl.getUniformLocation(mandelbrot_program, "u_Zoom")
    };
}

function main()
{
    var target_canvas = document.getElementById("target_canvas");
    var target_gl = target_canvas.getContext("webgl");
    var target_uniform = setup_canvas(target_gl);
    document.getElementById("new_target").onclick = () => draw_target(target_gl, target_uniform);
    draw_target(target_gl, target_uniform);

    var main_canvas = document.getElementById("main_canvas");
    var main_gl = main_canvas.getContext("webgl");
    var main_uniform = setup_canvas(main_gl);

    var redraw = () => draw_main(main_gl, main_uniform);
    document.getElementById("x_coord").oninput = redraw;
    document.getElementById("y_coord").oninput = redraw;
    document.getElementById("zoom").oninput = redraw;
    redraw();
}
