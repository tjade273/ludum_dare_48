// Shader code adapted from https://gpfault.net/posts/mandelbrot-webgl.txt.html 
const fragment_shader_source = `

precision highp float;
uniform int u_IterBound;
uniform vec2 u_CanvasDimensions;
uniform vec2 u_Center;
uniform float u_Zoom;

const int max_iters = 1000000;
const vec3 a = vec3(0.5,0.5,0.5);
const vec3 b = vec3(0.5,0.5,0.5);
const vec3 c = vec3(2.0, 1.0, 0.0);
const vec3 d = vec3(0.5,0.2,0.25);


vec2 f(vec2 c, vec2 z){
    return mat2(z.x, z.y, -z.y, z.x) * z + c;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
    vec2 z = vec2(0.0);
    vec2 x = (4.0 * gl_FragCoord.xy / u_CanvasDimensions) - vec2(2.0);
    x /= u_Zoom;
    x += u_Center;
 
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    for(int i = 0; i < max_iters; i++) {
        if (i >= u_IterBound)
            break;

        z = f(x, z);
        if(length(z) > 2.0) {
            gl_FragColor = vec4(palette(float(i) / float(u_IterBound), a, b, c, d), 0.9);
            break;
        }
    }
}
`
