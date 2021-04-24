const fragment_shader_source = `

precision highp float;
uniform int u_IterBound;
uniform vec2 u_CanvasDimensions;

const int max_iters = 1000000;

vec2 f(vec2 c, vec2 z){
    return mat2(z.x, z.y, -z.y, z.x) * z + c;
}

void main(){
    vec2 z = vec2(0.0);
    vec2 c = (4.0 * gl_FragCoord.xy / u_CanvasDimensions) - vec2(2.0);

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    for(int i = 0; i < max_iters; i++) {
        if (i >= u_IterBound)
            break;

        z = f(c, z);
        if(length(z) > 2.0) {
            color = vec4(1.0);
            break;
        }
    }
    gl_FragColor = color; 
}
`
