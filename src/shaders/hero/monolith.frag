// Hero Monolith - Fragment Shader
// Internal volumetric color with fresnel rim, chromatic edges, and scroll fade

uniform float uTime;
uniform float uScroll;
uniform float uHover;
uniform vec3  uColorA; // brand teal
uniform vec3  uColorB; // accent purple
uniform vec3  uColorC; // white core
uniform float uIntensity;
uniform float uChromaticAberration; // NEW: gated by quality tier

varying vec3  vNormal;
varying vec3  vPosition;
varying float vFresnel;
varying float vDisplacement;

// Simple smoothstep-based band pattern
float bands(float y) {
  return smoothstep(0.0, 0.5, fract(y * 3.0 + uTime * 0.2)) * 
         (1.0 - smoothstep(0.5, 1.0, fract(y * 3.0 + uTime * 0.2)));
}

void main() {
  // === Color Mixing based on vertical position + noise ===
  float t = vNormal.y * 0.5 + 0.5 + vDisplacement * 0.2;
  vec3 base = mix(uColorA, uColorB, t);
  
  // === Internal "data" texture - animated bands ===
  float bandPattern = bands(vPosition.y * 2.0);
  base += uColorC * bandPattern * 0.15;
  
  // === Fresnel edge glow ===
  base += vFresnel * mix(uColorA, uColorB, 0.5) * 2.0;
  
  // === Hover intensity boost ===
  base *= 1.0 + uHover * 0.3;
  
  // === Internal volumetric depth ===
  // Simulates light scattering through the crystal
  float depth = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  base += uColorC * depth * 0.2;
  
  // === Scroll-driven fade ===
  base *= (1.0 - uScroll * 0.7);
  
  // === Intensity multiplier ===
  base *= uIntensity;
  
  // === Subtle pulse for life ===
  base *= 1.0 + sin(uTime * 0.8) * 0.05;
  
  // === Subtle chromatic aberration (quality-gated) ===
  // Small RGB offset based on time and mouse position.
  // Strength controlled by uChromaticAberration uniform (0 on medium/low, 1 on high).
  const float CHROMATIC_AMOUNT = uChromaticAberration * 0.02;
  vec2 offset = vec2(
    sin(uTime * 0.3) * CHROMATIC_AMOUNT,
    cos(uTime * 0.7) * CHROMATIC_AMOUNT
  );
  vec3 rgbShifted = base;
  rgbShifted.r += offset.x;
  rgbShifted.g += offset.y;
  base = rgbShifted;
  
  gl_FragColor = vec4(base, 1.0);
}
