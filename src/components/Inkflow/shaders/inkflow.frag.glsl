precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec2  u_res;

// lightweight value noise (no heavy simplex)
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(in vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
}

vec3 palette(float t){
  // phthalo -> emerald -> olive
  vec3 a = vec3(0.043, 0.239, 0.180); // #0B3D2E
  vec3 b = vec3(0.118, 0.498, 0.360); // #1E7F5C
  vec3 c = vec3(0.333, 0.420, 0.184); // #556B2F
  return mix(mix(a,b, smoothstep(0.0,0.6,t)), c, smoothstep(0.4,1.0,t));
}

void main(){
  vec2 uv = vUv;
  // keep aspect-ratio consistent
  uv.x *= u_res.x / u_res.y;

  // slow flow field
  float t = u_time * 0.03;
  float n = 0.0;
  vec2 p = uv * 2.4;
  for(int i=0;i<4;i++){
    n += noise(p + t);
    p *= 1.7;
  }
  n /= 4.0; // 0..1

  // soft inky contrast
  float ink = smoothstep(0.25, 0.85, n);
  vec3 col = palette(ink);

  // ultra subtle paper grain
  float grain = noise(uv * u_res * 0.35) * 0.04;
  col += grain;

  gl_FragColor = vec4(col, 0.95); // translucent so it sits on cream
}
