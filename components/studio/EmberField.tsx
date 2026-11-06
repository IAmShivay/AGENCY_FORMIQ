'use client';

import { useEffect, useRef } from 'react';
import { isFinePointer, isLowEnd, prefersReducedMotion } from '@/lib/studio-motion';

const RENDER_SCALE = 0.5;
const TIME_PER_MS = 0.00005;
const STILL_TIME = 14;
const POINTER_LEAN = 0.1;
const POINTER_EASE = 0.04;
const PALETTE_VARS = ['--ink', '--ember-deep', '--ember'] as const;

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG = `precision mediump float;
uniform vec2 r;uniform vec2 o;uniform float t;uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;
vec2 q=vec2(fbm(p+t*.9),fbm(p+vec2(5.2,1.3)-t*.7));
float f=fbm(p+2.2*q+t*.4);
vec2 a=vec2(r.x/r.y,1.);float d=distance(uv*a,(vec2(.92,1.05)+o)*a)/length(a);
float m=smoothstep(.8,.0,d);
float g=clamp(f*f*1.7*m,0.,1.);
vec3 col=mix(c0,c1,smoothstep(.08,.7,g));col=mix(col,c2,smoothstep(.6,1.,g));
gl_FragColor=vec4(col,1.);}`;

const tokenToRgb = (token: string): [number, number, number] => {
  const [h, s, l] = token.trim().split(/\s+/).map(parseFloat);
  const sat = s / 100, lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
};

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
};

export default function EmberField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!canvas || !gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const css = getComputedStyle(document.documentElement);
    PALETTE_VARS.forEach((v, i) => gl.uniform3fv(gl.getUniformLocation(prog, `c${i}`), tokenToRgb(css.getPropertyValue(v))));
    const uRes = gl.getUniformLocation(prog, 'r');
    const uTime = gl.getUniformLocation(prog, 't');
    const uOffset = gl.getUniformLocation(prog, 'o');

    const still = prefersReducedMotion() || isLowEnd();
    const follow = !still && isFinePointer();
    const lean = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (ev: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      lean.tx = ((ev.clientX - b.left) / b.width - 0.5) * 2 * POINTER_LEAN;
      lean.ty = -((ev.clientY - b.top) / b.height - 0.5) * 2 * POINTER_LEAN;
    };
    if (follow) window.addEventListener('pointermove', onPointer, { passive: true });
    const start = performance.now();
    let raf = 0;
    let running = false;

    const draw = (time: number) => {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      lean.x += (lean.tx - lean.x) * POINTER_EASE;
      lean.y += (lean.ty - lean.y) * POINTER_EASE;
      gl.uniform2f(uOffset, lean.x, lean.y);
      draw(STILL_TIME + (now - start) * TIME_PER_MS);
      raf = requestAnimationFrame(frame);
    };
    const play = () => { if (!running && !still) { running = true; raf = requestAnimationFrame(frame); } };
    const pause = () => { running = false; cancelAnimationFrame(raf); };

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * RENDER_SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      if (!running) draw(STILL_TIME);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? play() : pause()));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
