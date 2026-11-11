'use client';

import { useEffect, useRef } from 'react';
import { isFinePointer, isLowEnd, prefersReducedMotion } from '@/lib/studio-motion';
import { LEAD_SHEET_OPEN_CLASS } from '@/lib/lead-sheet';
import { CASE_OVERLAY_OPEN_CLASS } from '@/lib/work';

const RENDER_SCALE = 0.5;
const TIME_PER_MS = 0.00005;
const STILL_TIME = 14;
const POINTER_LEAN = 0.1;
const POINTER_EASE = 0.04;
const PALETTE_VARS = ['--ink', '--ember-deep', '--ember'] as const;
const PHONE_QUERY = '(max-width: 767px)';
const PHONE_RENDER_SCALE = 0.75;
const PHONE_SOFTEN = 'blur(2.5px)';
const PHONE_BLEED = 'scale(1.03)';
const PHONE_LEAN = 0.18;
const TILT_RANGE_DEG = 30;
const TILT_REST_BETA = 45;

const clampUnit = (v: number) => Math.max(-1, Math.min(1, v));
const needsTiltPermission = () =>
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;uniform vec2 o;uniform float t;uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;
vec2 q=vec2(fbm(p+t*.9),fbm(p+vec2(5.2,1.3)-t*.7));
float f=fbm(p+2.2*q+t*.4);
vec2 a=vec2(r.x/r.y,1.);float d=distance(uv*a,(vec2(.92,1.05)+o)*a)/length(a);
float m=smoothstep(mix(.8,1.,step(r.x,r.y)),.0,d);
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
    if (!canvas || getComputedStyle(canvas).display === 'none') return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const phone = window.matchMedia(PHONE_QUERY).matches;
    const html = document.documentElement;
    const high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (phone && (!high || high.precision === 0)) { canvas.style.display = 'none'; return; }
    const scale = phone ? PHONE_RENDER_SCALE : RENDER_SCALE;
    if (phone) { canvas.style.filter = PHONE_SOFTEN; canvas.style.transform = PHONE_BLEED; }
    const leanAmount = phone ? PHONE_LEAN : POINTER_LEAN;

    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uOffset: WebGLUniformLocation | null = null;
    let ready = false;

    const init = () => {
      ready = false;
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) { canvas.style.display = 'none'; return; }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
      gl.useProgram(prog);

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const css = getComputedStyle(document.documentElement);
      PALETTE_VARS.forEach((v, i) => gl.uniform3fv(gl.getUniformLocation(prog, `c${i}`), tokenToRgb(css.getPropertyValue(v))));
      uRes = gl.getUniformLocation(prog, 'r');
      uTime = gl.getUniformLocation(prog, 't');
      uOffset = gl.getUniformLocation(prog, 'o');
      ready = true;
    };

    const still = prefersReducedMotion() || (!phone && isLowEnd());
    const lean = { x: 0, y: 0, tx: 0, ty: 0 };
    const leanTo = (clientX: number, clientY: number) => {
      const b = canvas.getBoundingClientRect();
      lean.tx = clampUnit(((clientX - b.left) / b.width - 0.5) * 2) * leanAmount;
      lean.ty = clampUnit(-((clientY - b.top) / b.height - 0.5) * 2) * leanAmount;
    };
    const onPointer = (ev: PointerEvent) => leanTo(ev.clientX, ev.clientY);
    const onTouch = (ev: TouchEvent) => { const t = ev.touches[0]; if (t) leanTo(t.clientX, t.clientY); };
    const onTilt = (ev: DeviceOrientationEvent) => {
      if (ev.gamma == null || ev.beta == null) return;
      lean.tx = clampUnit(ev.gamma / TILT_RANGE_DEG) * leanAmount;
      lean.ty = clampUnit((TILT_REST_BETA - ev.beta) / TILT_RANGE_DEG) * leanAmount;
    };
    const mouse = !still && !phone && isFinePointer();
    const touch = !still && phone;
    const tilt = touch && !needsTiltPermission();
    if (mouse) window.addEventListener('pointermove', onPointer, { passive: true });
    if (touch) {
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
    }
    if (tilt) window.addEventListener('deviceorientation', onTilt, { passive: true });
    const start = performance.now();
    let raf = 0;
    let running = false;
    let visible = false;

    const draw = (time: number) => {
      if (!ready) return;
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (html.classList.contains(LEAD_SHEET_OPEN_CLASS) || html.classList.contains(CASE_OVERLAY_OPEN_CLASS)) return;
      lean.x += (lean.tx - lean.x) * POINTER_EASE;
      lean.y += (lean.ty - lean.y) * POINTER_EASE;
      if (ready) gl.uniform2f(uOffset, lean.x, lean.y);
      draw(STILL_TIME + (now - start) * TIME_PER_MS);
    };
    const play = () => { if (!running && !still && ready) { running = true; raf = requestAnimationFrame(frame); } };
    const pause = () => { running = false; cancelAnimationFrame(raf); };

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (!ready) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      if (!running) draw(STILL_TIME);
    };

    const onLost = (e: Event) => { e.preventDefault(); pause(); ready = false; };
    const onRestored = () => { init(); resize(); if (visible && !document.hidden) play(); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    if (gl.isContextLost()) gl.getExtension('WEBGL_lose_context')?.restoreContext();
    else init();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) play(); else pause();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? pause() : visible && play());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('deviceorientation', onTilt);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className || 'block'}`} />;
}
