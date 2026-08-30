export const SHADERS = {
  raymarchScene: {
    vertex: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      #define MAX_STEPS 100
      #define MAX_DIST 100.0
      #define SURF_DIST 0.001
      
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uProgress;
      uniform int uScene;
      
      varying vec2 vUv;
      
      // Signed Distance Functions
      float sdSphere(vec3 p, float r) { return length(p) - r; }
      float sdBox(vec3 p, vec3 b) { vec3 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0); }
      float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
      
      // Smooth operations
      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }
      
      // Domain repetition
      vec3 repeat(vec3 p, vec3 c) { return mod(p, c) - 0.5 * c; }
      vec3 repeatAng(vec3 p, float n) {
        float a = atan(p.x, p.z) * n;
        float r = length(p.xz);
        p.xz = r * vec2(sin(a), cos(a));
        return p;
      }
      
      // Noise
      float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      
      float fbm(vec3 p) {
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }
      
      // Scene 0: Organic morphing structures
      float scene0(vec3 p) {
        float t = uTime * 0.3;
        p.y += sin(t * 0.5) * 0.5;
        float d = sdSphere(p, 1.5 + sin(t) * 0.5);
        p = repeatAng(p, 3.0 + sin(t * 0.7) * 2.0);
        d = smin(d, sdTorus(p, vec2(1.2, 0.3)), 0.3);
        d = smin(d, sdBox(p, vec3(0.8 + fbm(p * 2.0 + t) * 0.4)), 0.4);
        return d;
      }
      
      // Scene 1: Crystalline formations
      float scene1(vec3 p) {
        float t = uTime * 0.2;
        vec3 q = p;
        q = repeat(q, vec3(2.5));
        q = repeatAng(q, 6.0);
        float d = sdBox(q, vec3(0.3 + fbm(q * 3.0 + t) * 0.2));
        d = smin(d, sdSphere(p, 2.0 + sin(t) * 0.3), 0.5);
        return d;
      }
      
      // Scene 2: Flowing fields
      float scene2(vec3 p) {
        float t = uTime * 0.15;
        vec3 q = p;
        q.x += sin(p.z * 2.0 + t) * 0.5;
        q.y += cos(p.x * 2.0 + t) * 0.5;
        q.z += sin(p.y * 2.0 + t) * 0.5;
        float d = sdSphere(q, 1.0 + fbm(q * 1.5 + t) * 0.5);
        return d;
      }
      
      float map(vec3 p) {
        if(uScene == 0) return scene0(p);
        else if(uScene == 1) return scene1(p);
        else return scene2(p);
      }
      
      vec3 getNormal(vec3 p) {
        vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
          map(p + e.xyy) - map(p - e.xyy),
          map(p + e.yxy) - map(p - e.yxy),
          map(p + e.yyx) - map(p - e.yyx)
        ));
      }
      
      // Soft shadows
      float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
        float res = 1.0;
        float t = mint;
        for(int i = 0; i < 32; i++) {
          float h = map(ro + rd * t);
          res = min(res, k * h / t);
          t += h;
          if(res < 0.005 || t > maxt) break;
        }
        return clamp(res, 0.0, 1.0);
      }
      
      // Ambient occlusion
      float ao(vec3 p, vec3 n) {
        float occ = 0.0;
        float sca = 1.0;
        for(int i = 0; i < 5; i++) {
          float hr = 0.01 + 0.12 * float(i) / 4.0;
          float dd = map(p + n * hr);
          occ += (hr - dd) * sca;
          sca *= 0.5;
        }
        return 1.0 - clamp(occ, 0.0, 1.0);
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
        vec2 mouse = (uMouse - 0.5 * uResolution) / uResolution.y;
        
        // Camera
        vec3 ro = vec3(0.0, 1.5, 4.0);
        ro.xz += mouse * 0.5;
        ro = vec3(ro.x * cos(uTime * 0.05) - ro.z * sin(uTime * 0.05), ro.y, ro.x * sin(uTime * 0.05) + ro.z * cos(uTime * 0.05));
        
        vec3 rd = normalize(vec3(uv, 1.0));
        rd.xz = mat2(cos(uTime * 0.02), -sin(uTime * 0.02), sin(uTime * 0.02), cos(uTime * 0.02)) * rd.xz;
        
        // Raymarch
        float t = 0.0;
        vec3 p = ro;
        for(int i = 0; i < MAX_STEPS; i++) {
          float d = map(p);
          if(d < SURF_DIST) break;
          t += d;
          p = ro + rd * t;
          if(t > MAX_DIST) break;
        }
        
        vec3 col = vec3(0.0);
        if(t < MAX_DIST) {
          vec3 n = getNormal(p);
          
          // Lighting
          vec3 lightDir = normalize(vec3(sin(uTime * 0.3), 1.0, cos(uTime * 0.2)));
          float diff = max(dot(n, lightDir), 0.0);
          float spec = pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 32.0);
          
          // Soft shadows
          float shadow = softShadow(p + n * 0.01, lightDir, 0.01, 10.0, 32.0);
          
          // Ambient occlusion
          float amb = ao(p, n);
          
          // Material
          vec3 albedo = mix(
            vec3(0.1, 0.15, 0.25),
            vec3(0.4, 0.6, 0.9),
            fbm(p * 3.0 + uTime * 0.1)
          );
          
          // Fresnel
          float fresnel = pow(1.0 - abs(dot(n, rd)), 3.0);
          
          col = albedo * (diff * 1.5 + amb * 0.5) * shadow;
          col += vec3(1.0, 0.9, 0.7) * spec * 2.0 * shadow;
          col += vec3(0.2, 0.4, 0.8) * fresnel * 0.5;
          
          // Subsurface scattering approximation
          col += albedo * 0.3 * (1.0 - diff) * amb;
        }
        
        // Atmosphere
        vec3 atm = vec3(0.02, 0.03, 0.05) * (1.0 - exp(-t * 0.1));
        col += atm;
        
        // Vignette
        float vignette = 1.0 - length(uv) * 0.5;
        col *= vignette;
        
        // Color grading
        col = pow(col, vec3(1.0/2.2));
        col = col * 1.1;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  
  volumetricClouds: {
    vertex: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      
      varying vec2 vUv;
      
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
                   mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }
      
      vec3 clouds(vec2 uv, float t) {
        vec2 p = uv * 2.0;
        float n = fbm(p + t * 0.1);
        n += fbm(p * 2.0 - t * 0.05) * 0.5;
        n += fbm(p * 4.0 + t * 0.02) * 0.25;
        return vec3(n, n * 0.8, n * 0.6);
      }
      
      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.05;
        
        vec3 col = clouds(uv * 5.0, t);
        col = mix(col, clouds(uv * 10.0 + vec2(t * 0.1, t * 0.05), t) * 0.5, 0.5);
        
        // Color palette
        vec3 color1 = vec3(0.1, 0.15, 0.3);
        vec3 color2 = vec3(0.3, 0.4, 0.7);
        vec3 color3 = vec3(0.6, 0.7, 0.95);
        vec3 color4 = vec3(1.0, 0.9, 0.8);
        
        float d = length(uv - 0.5);
        col = mix(color1, color2, col.x);
        col = mix(col, color3, smoothstep(0.3, 0.5, col.x));
        col = mix(col, color4, smoothstep(0.7, 0.85, col.x));
        
        // Vignette
        float vig = 1.0 - d * 1.2;
        col *= vig;
        
        gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
      }
    `
  },
  
  liquidMetal: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uCameraPos;
      uniform vec2 uMouse;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      
      float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) {
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }
      
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(uCameraPos - vWorldPos);
        vec3 R = reflect(-V, N);
        
        // Anisotropic distortion
        float t = uTime * 0.5;
        vec3 p = vWorldPos * 2.0 + t * 0.3;
        p.x += sin(p.z * 3.0 + t) * 0.5;
        p.y += cos(p.x * 3.0 + t) * 0.5;
        
        float n = fbm(p);
        float n2 = fbm(p * 2.0 + t);
        
        // Distort normal
        N += normalize(vec3(n * 0.1, n2 * 0.1, 0.0));
        N = normalize(N);
        
        // Environment reflection
        vec3 envDir = R;
        envDir.y = abs(envDir.y);
        
        // Metallic colors
        vec3 baseColor = mix(
          vec3(0.05, 0.08, 0.15),
          vec3(0.3, 0.4, 0.6),
          n
        );
        
        // Fresnel
        float fresnel = pow(1.0 - abs(dot(V, N)), 3.0);
        
        // Specular
        vec3 lightDir = normalize(vec3(sin(t), 1.0, cos(t)));
        float diff = max(dot(N, lightDir), 0.0);
        float spec = pow(max(dot(reflect(-lightDir, N), V), 0.0), 64.0);
        
        // Anisotropic highlight
        float aniso = pow(max(dot(cross(N, lightDir), cross(N, V)), 0.0), 32.0);
        
        vec3 col = baseColor * diff * 2.0;
        col += vec3(1.0, 0.95, 0.9) * spec * 3.0;
        col += vec3(1.0, 0.8, 0.6) * aniso * 2.0;
        col += vec3(0.5, 0.7, 1.0) * fresnel * 0.8;
        
        // Subsurface glow
        col += baseColor * 0.2 * (1.0 - diff);
        
        // Tone mapping
        col = col / (col + vec3(1.0));
        col = pow(col, vec3(1.0/2.2));
        
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  
  neuralNetwork: {
    vertex: `
      attribute float aNodeId;
      attribute vec3 aTargetPos;
      uniform float uTime;
      uniform float uProgress;
      varying float vNodeId;
      varying vec3 vPos;
      
      void main() {
        vNodeId = aNodeId;
        vec3 pos = mix(position, aTargetPos, uProgress);
        vPos = pos;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 8.0 * (1.0 / -mv.z) * uProgress;
      }
    `,
    fragment: `
      uniform float uTime;
      uniform float uProgress;
      varying float vNodeId;
      varying vec3 vPos;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float pulse = sin(uTime * 5.0 + vNodeId * 10.0) * 0.5 + 0.5;
        float a = smoothstep(0.5, 0.1, d) * pulse * uProgress;
        
        vec3 color = mix(
          vec3(0.2, 0.4, 1.0),
          vec3(0.0, 1.0, 0.8),
          fract(vNodeId * 0.1)
        );
        
        // Glow ring
        float ring = smoothstep(0.35, 0.3, d) * 0.5 * pulse;
        
        gl_FragColor = vec4(color, a + ring);
        if(gl_FragColor.a < 0.01) discard;
      }
    `
  },
  
  holographicGrid: {
    vertex: `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragment: `
      uniform float uTime;
      uniform vec3 uCameraPos;
      
      varying vec2 vUv;
      varying vec3 vWorldPos;
      
      void main() {
        vec3 pos = vWorldPos;
        float t = uTime;
        
        // Grid lines
        float grid = 0.0;
        grid += smoothstep(0.02, 0.0, abs(mod(pos.x * 0.5, 1.0) - 0.5));
        grid += smoothstep(0.02, 0.0, abs(mod(pos.z * 0.5, 1.0) - 0.5));
        
        // Pulsing
        float pulse = sin(pos.x * 2.0 + t) * sin(pos.z * 2.0 + t) * 0.5 + 0.5;
        grid *= pulse;
        
        // Perspective fade
        float dist = length(uCameraPos - pos);
        float fade = smoothstep(50.0, 10.0, dist);
        
        vec3 color = mix(
          vec3(0.1, 0.3, 0.8),
          vec3(0.0, 0.8, 1.0),
          pulse
        );
        
        float alpha = grid * fade * 0.5;
        
        gl_FragColor = vec4(color, alpha);
      }
    `
  }
};

export type ShaderName = keyof typeof SHADERS;