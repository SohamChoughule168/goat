// Hero Monolith - Vertex Shader
// Cinematic icosahedron with noise-based displacement, mouse parallax, and scroll-driven fragmentation

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;
uniform float uHover;
uniform float uDisplace;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vFresnel;
varying float vDisplacement;

// 4-octave FBM noise
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float n = mix(
    mix(
      mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
      f.y
    ),
    f.z
  );
  return n;
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 pos = position;
  
  // === 1. Floating Animation ===
  pos.y += sin(uTime * 0.5) * 0.08;
  pos.x += cos(uTime * 0.3) * 0.04;
  
  // === 2. Mouse Parallax Tilt ===
  // Tilts the geometry slightly toward the cursor (uMouse in NDC)
  pos.xy += uMouse * 0.15 * uHover;
  
  // === 3. Noise-based Displacement ===
  float n = fbm(pos * 1.5 + uTime * 0.2);
  pos += normal * n * uDisplace;
  
  // === 4. Scroll-driven Fragmentation ===
  // As the user scrolls, pieces of the geometry fly outward
  float frag = smoothstep(0.0, 0.3, uScroll);
  vec3 dirFromCenter = normalize(pos - vec3(0.0));
  pos += dirFromCenter * frag * 3.0;
  
  // Scale down as it fragments
  pos *= 1.0 - frag * 0.5;
  
  // === 5. Compute Varyings ===
  vNormal = normalize(normalMatrix * normal);
  vPosition = pos;
  
  // Fresnel for edge glow
  vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  vec3 viewPos = (viewMatrix * vec4(worldPos, 1.0)).xyz;
  vec3 viewDir = normalize(-viewPos);
  vFresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
  
  vDisplacement = n;
  
  gl_Position = projectionMatrix * vec4(viewPos, 1.0);
}
