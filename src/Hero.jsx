import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
// Domain-warped noise graded teal (shadows) to amber (highlights), the classic colour-grade look.
const FS = `precision mediump float;
uniform vec2 r; uniform vec2 m; uniform float t;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + 1.), f.x), f.y); }
void main(){
  vec2 p = (gl_FragCoord.xy / r - .5) * vec2(r.x / r.y, 1.) * 3. + (m - .5) * .6;
  float v = 0.;
  for (int i = 0; i < 4; i++) { p += vec2(n(p + t*.15), n(p.yx - t*.12)) - .5; v += n(p * float(i + 1)) / float(i + 1); }
  vec3 c = mix(vec3(.055, .09, .15), vec3(.95, .62, .25), smoothstep(.55, 1.15, v));
  c += vec3(.1, .55, .55) * smoothstep(.3, .9, n(p * 2. - t*.1)) * .3;
  gl_FragColor = vec4(c, 1.);
}`;

export default function Hero() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current, gl = cv.getContext('webgl');
    if (!gl) return; // the canvas CSS gradient is the fallback
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pg = gl.createProgram();
    gl.attachShader(pg, shader(gl.VERTEX_SHADER, VS));
    gl.attachShader(pg, shader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pg); gl.useProgram(pg);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pg, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (k) => gl.getUniformLocation(pg, k);
    const mouse = [0.5, 0.5], still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const size = () => {
      const d = Math.min(devicePixelRatio, innerWidth < 700 ? 1 : 1.5);
      cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; gl.viewport(0, 0, cv.width, cv.height);
    };
    const move = (e) => { mouse[0] = e.clientX / innerWidth; mouse[1] = 1 - e.clientY / innerHeight; };
    const draw = (t) => {
      gl.uniform2f(u('r'), cv.width, cv.height); gl.uniform2f(u('m'), mouse[0], mouse[1]); gl.uniform1f(u('t'), t / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(draw);
    };
    size(); addEventListener('resize', size); addEventListener('pointermove', move);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move); };
  }, []);

  return (
    <section id="top" className="hero">
      <canvas ref={ref} aria-hidden="true" />
      <div className="hero-copy">
        <motion.h1 initial={{ clipPath: 'inset(0 0 100% 0)', y: 40 }} animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          Sharp cuts. Clean timing. Your best moments, made better.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Good footage deserves an edit that brings out its best moments.
        </motion.p>
        <motion.a className="btn" href="#contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} whileHover={{ scale: 1.04 }}>
          Contact me
        </motion.a>
      </div>
    </section>
  );
}
