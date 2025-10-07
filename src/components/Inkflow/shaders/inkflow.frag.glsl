precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec2  u_res;

// Improved smooth noise
float hash(vec2 p) { 
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion for smoother patterns
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for(int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Beautiful flowing gradient palette - aurora inspired
vec3 palette(float t) {
  // Smooth color transitions: deep purple -> vibrant teal -> soft pink -> golden
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = vUv;
  vec2 uvOriginal = uv;
  
  // Aspect ratio correction
  uv.x *= u_res.x / u_res.y;
  
  // Slow, elegant time evolution
  float t = u_time * 0.08;
  
  // Create flowing distortion field
  vec2 q = vec2(0.0);
  q.x = fbm(uv * 2.0 + vec2(0.0, t * 0.3));
  q.y = fbm(uv * 2.0 + vec2(t * 0.2, 0.0));
  
  vec2 r = vec2(0.0);
  r.x = fbm(uv * 3.0 + 4.0 * q + vec2(1.7, 9.2) + t * 0.15);
  r.y = fbm(uv * 3.0 + 4.0 * q + vec2(8.3, 2.8) + t * 0.12);
  
  float f = fbm(uv * 2.0 + r);
  
  // Create flowing color
  vec3 color = palette(f + 0.2);
  
  // Add secondary color layer for depth
  float f2 = fbm(uv * 1.5 - r * 0.5 + t * 0.1);
  vec3 color2 = palette(f2 + 0.5);
  
  // Blend the layers
  color = mix(color, color2, 0.3);
  
  // Add gentle vignette
  float vignette = 1.0 - length(uvOriginal - 0.5) * 0.6;
  color *= vignette;
  
  // Enhance contrast and vibrancy
  color = pow(color, vec3(0.85));
  color = color * 1.2;
  
  // Add subtle shimmer
  float shimmer = noise(uv * 40.0 + t * 2.0) * 0.03;
  color += shimmer;
  
  // Smooth gradient overlay for elegance
  float gradientOverlay = smoothstep(0.0, 1.0, uvOriginal.y) * 0.15;
  color += gradientOverlay;
  
  gl_FragColor = vec4(color, 0.85);
}
