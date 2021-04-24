const vertex_shader_source = `

precision highp float;
attribute vec2 a_ComplexCoords;

void main()
{
    gl_Position = vec4(a_ComplexCoords.x, a_ComplexCoords.y, 0, 1);
}
`
