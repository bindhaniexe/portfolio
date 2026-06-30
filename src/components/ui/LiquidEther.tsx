import { useEffect, useRef } from "react";
import "./LiquidEther.css";

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  style = {},
  className = "",
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number>(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── dynamic import keeps THREE out of SSR ─────────────────────────────
    let cancelled = false;
    let cleanupFn: (() => void) | undefined;

    import("three").then((THREE) => {
      if (cancelled || !mountRef.current) return;
      const container = mountRef.current;
      // ── palette texture ─────────────────────────────────────────────────
      function makePaletteTexture(stops: string[]) {
        const arr = stops.length === 0 ? ["#ffffff","#ffffff"] : stops.length === 1 ? [stops[0], stops[0]] : stops;
        const w = arr.length;
        const data = new Uint8Array(w * 4);
        for (let i = 0; i < w; i++) {
          const c = new THREE.Color(arr[i]);
          data[i*4]   = Math.round(c.r * 255);
          data[i*4+1] = Math.round(c.g * 255);
          data[i*4+2] = Math.round(c.b * 255);
          data[i*4+3] = 255;
        }
        const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
        return tex;
      }
      const paletteTex = makePaletteTexture(colors);
      const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

      // ── shaders ──────────────────────────────────────────────────────────
      const face_vert = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`;
      const line_vert = `attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 pos=position;uv=0.5+pos.xy*0.5;vec2 n=sign(pos.xy);pos.xy=abs(pos.xy)-px*1.0;pos.xy*=n;gl_Position=vec4(pos,1.0);}`;
      const mouse_vert = `precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
      const advection_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio=max(fboSize.x,fboSize.y)/fboSize;if(!isBFECC){vec2 vel=texture2D(velocity,uv).xy;vec2 uv2=uv-vel*dt*ratio;gl_FragColor=vec4(texture2D(velocity,uv2).xy,0.0,0.0);}else{vec2 vel_old=texture2D(velocity,uv).xy;vec2 spot_old=uv-vel_old*dt*ratio;vec2 vel_new1=texture2D(velocity,spot_old).xy;vec2 spot_new2=spot_old+vel_new1*dt*ratio;vec2 error=spot_new2-uv;vec2 spot_new3=uv-error/2.0;vec2 vel_2=texture2D(velocity,spot_new3).xy;vec2 spot_old2=spot_new3-vel_2*dt*ratio;gl_FragColor=vec4(texture2D(velocity,spot_old2).xy,0.0,0.0);}}`;
      const color_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;vec3 outRGB=mix(bgColor.rgb,c,lenv);float outA=mix(bgColor.a,1.0,lenv);gl_FragColor=vec4(outRGB,outA);}`;
      const divergence_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,uv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0.0,px.y)).y;gl_FragColor=vec4((x1-x0+y1-y0)/2.0/dt);}`;
      const externalForce_frag = `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle=(vUv-0.5)*2.0;float d=1.0-min(length(circle),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
      const poisson_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r;float div=texture2D(divergence,uv).r;gl_FragColor=vec4((p0+p1+p2+p3)/4.0-div);}`;
      const pressure_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y)).r;vec2 v=texture2D(velocity,uv).xy;gl_FragColor=vec4(v-vec2(p0-p1,p2-p3)*0.5*dt,0.0,1.0);}`;
      const viscous_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old=texture2D(velocity,uv).xy;vec2 n0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy;vec2 n1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy;vec2 n2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy;vec2 n3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy;gl_FragColor=vec4((4.0*old+v*dt*(n0+n1+n2+n3))/(4.0*(1.0+v*dt)),0.0,0.0);}`;

      // ── Common ───────────────────────────────────────────────────────────
      const Common: any = {
        width:0, height:0, aspect:1, pixelRatio:1, time:0, delta:0,
        container:null, renderer:null, clock:null,
        init(c: HTMLElement) {
          this.container = c;
          this.pixelRatio = Math.min(window.devicePixelRatio||1,2);
          this.resize();
          this.renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
          this.renderer.autoClear = false;
          this.renderer.setClearColor(new THREE.Color(0),0);
          this.renderer.setPixelRatio(this.pixelRatio);
          this.renderer.setSize(this.width,this.height);
          this.renderer.domElement.style.width='100%';
          this.renderer.domElement.style.height='100%';
          this.renderer.domElement.style.display='block';
          this.clock = new THREE.Clock(); this.clock.start();
        },
        resize() {
          if(!this.container) return;
          const r=this.container.getBoundingClientRect();
          this.width=Math.max(1,Math.floor(r.width));
          this.height=Math.max(1,Math.floor(r.height));
          this.aspect=this.width/this.height;
          if(this.renderer) this.renderer.setSize(this.width,this.height,false);
        },
        update() { this.delta=this.clock.getDelta(); this.time+=this.delta; }
      };

      // ── Mouse ────────────────────────────────────────────────────────────
      const Mouse: any = {
        mouseMoved:false, coords:new THREE.Vector2(), coords_old:new THREE.Vector2(),
        diff:new THREE.Vector2(), timer:null as any, container:null as any,
        listenerTarget:null as any, docTarget:null as any, isHoverInside:false,
        hasUserControl:false, isAutoActive:false, autoIntensity:2.0,
        takeoverActive:false, takeoverStartTime:0, takeoverDuration:0.25,
        takeoverFrom:new THREE.Vector2(), takeoverTo:new THREE.Vector2(),
        onInteract:null as any,
        init(c: HTMLElement) {
          this.container=c; this.docTarget=c.ownerDocument;
          const win=(this.docTarget?.defaultView)||(typeof window!=='undefined'?window:null);
          if(!win) return; this.listenerTarget=win;
          win.addEventListener('mousemove',this._onMouseMove=this.onDocumentMouseMove.bind(this));
          win.addEventListener('touchstart',this._onTouchStart=this.onDocumentTouchStart.bind(this),{passive:true});
          win.addEventListener('touchmove',this._onTouchMove=this.onDocumentTouchMove.bind(this),{passive:true});
          win.addEventListener('touchend',this._onTouchEnd=this.onTouchEnd.bind(this));
          this.docTarget?.addEventListener('mouseleave',this._onDocumentLeave=this.onDocumentLeave.bind(this));
        },
        dispose() {
          if(this.listenerTarget){
            this.listenerTarget.removeEventListener('mousemove',this._onMouseMove);
            this.listenerTarget.removeEventListener('touchstart',this._onTouchStart);
            this.listenerTarget.removeEventListener('touchmove',this._onTouchMove);
            this.listenerTarget.removeEventListener('touchend',this._onTouchEnd);
          }
          this.docTarget?.removeEventListener('mouseleave',this._onDocumentLeave);
          this.listenerTarget=null; this.docTarget=null; this.container=null;
        },
        isPointInside(x:number,y:number){
          if(!this.container) return false;
          const r=this.container.getBoundingClientRect();
          return r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
        },
        updateHoverState(x:number,y:number){ this.isHoverInside=this.isPointInside(x,y); return this.isHoverInside; },
        setCoords(x:number,y:number){
          if(!this.container) return;
          if(this.timer) clearTimeout(this.timer);
          const r=this.container.getBoundingClientRect();
          if(!r.width||!r.height) return;
          this.coords.set((x-r.left)/r.width*2-1,-((y-r.top)/r.height*2-1));
          this.mouseMoved=true;
          this.timer=setTimeout(()=>{this.mouseMoved=false;},100);
        },
        setNormalized(nx:number,ny:number){ this.coords.set(nx,ny); this.mouseMoved=true; },
        onDocumentMouseMove(e:MouseEvent){
          if(!this.updateHoverState(e.clientX,e.clientY)) return;
          if(this.onInteract) this.onInteract();
          if(this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive){
            const r=this.container?.getBoundingClientRect();
            if(!r||!r.width||!r.height) return;
            this.takeoverFrom.copy(this.coords);
            this.takeoverTo.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));
            this.takeoverStartTime=performance.now(); this.takeoverActive=true;
            this.hasUserControl=true; this.isAutoActive=false; return;
          }
          this.setCoords(e.clientX,e.clientY); this.hasUserControl=true;
        },
        onDocumentTouchStart(e:TouchEvent){
          if(e.touches.length!==1) return; const t=e.touches[0];
          if(!this.updateHoverState(t.clientX,t.clientY)) return;
          if(this.onInteract) this.onInteract();
          this.setCoords(t.clientX,t.clientY); this.hasUserControl=true;
        },
        onDocumentTouchMove(e:TouchEvent){
          if(e.touches.length!==1) return; const t=e.touches[0];
          if(!this.updateHoverState(t.clientX,t.clientY)) return;
          if(this.onInteract) this.onInteract();
          this.setCoords(t.clientX,t.clientY);
        },
        onTouchEnd(){ this.isHoverInside=false; },
        onDocumentLeave(){ this.isHoverInside=false; },
        update(){
          if(this.takeoverActive){
            const t=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1000);
            if(t>=1){this.takeoverActive=false;this.coords.copy(this.takeoverTo);this.coords_old.copy(this.coords);this.diff.set(0,0);}
            else{const k=t*t*(3-2*t);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,k);}
          }
          this.diff.subVectors(this.coords,this.coords_old);
          this.coords_old.copy(this.coords);
          if(this.coords_old.x===0&&this.coords_old.y===0) this.diff.set(0,0);
          if(this.isAutoActive&&!this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
        }
      };

      // ── AutoDriver ───────────────────────────────────────────────────────
      class AutoDriver {
        mouse:any; manager:any; enabled:boolean; speed:number; resumeDelay:number;
        rampDurationMs:number; active:boolean; current:any; target:any;
        lastTime:number; activationTime:number; margin:number; _tmpDir:any;
        constructor(mouse:any,manager:any,opts:any){
          this.mouse=mouse; this.manager=manager; this.enabled=opts.enabled;
          this.speed=opts.speed; this.resumeDelay=opts.resumeDelay||3000;
          this.rampDurationMs=(opts.rampDuration||0)*1000;
          this.active=false; this.current=new THREE.Vector2(0,0);
          this.target=new THREE.Vector2(); this.lastTime=performance.now();
          this.activationTime=0; this.margin=0.2; this._tmpDir=new THREE.Vector2();
          this.pickNewTarget();
        }
        pickNewTarget(){const r=Math.random;this.target.set((r()*2-1)*(1-this.margin),(r()*2-1)*(1-this.margin));}
        forceStop(){this.active=false;this.mouse.isAutoActive=false;}
        update(){
          if(!this.enabled) return;
          const now=performance.now();
          const idle=now-this.manager.lastUserInteraction;
          if(idle<this.resumeDelay){if(this.active) this.forceStop();return;}
          if(this.mouse.isHoverInside){if(this.active) this.forceStop();return;}
          if(!this.active){this.active=true;this.current.copy(this.mouse.coords);this.lastTime=now;this.activationTime=now;}
          this.mouse.isAutoActive=true;
          let dtSec=(now-this.lastTime)/1000; this.lastTime=now;
          if(dtSec>0.2) dtSec=0.016;
          const dir=this._tmpDir.subVectors(this.target,this.current);
          const dist=dir.length();
          if(dist<0.01){this.pickNewTarget();return;}
          dir.normalize();
          const ramp=this.rampDurationMs>0?((t:number)=>{return t*t*(3-2*t);})(Math.min(1,(now-this.activationTime)/this.rampDurationMs)):1;
          const step=this.speed*dtSec*ramp;
          this.current.addScaledVector(dir,Math.min(step,dist));
          this.mouse.setNormalized(this.current.x,this.current.y);
        }
      }

      // ── ShaderPass base ──────────────────────────────────────────────────
      class ShaderPass {
        props:any; uniforms:any; scene:any; camera:any; material:any; geometry:any; plane:any;
        constructor(props:any){this.props=props||{};this.uniforms=this.props.material?.uniforms;}
        init(){
          this.scene=new THREE.Scene(); this.camera=new THREE.Camera();
          if(this.uniforms){
            this.material=new THREE.RawShaderMaterial(this.props.material);
            this.geometry=new THREE.PlaneGeometry(2,2);
            this.plane=new THREE.Mesh(this.geometry,this.material);
            this.scene.add(this.plane);
          }
        }
        update(){
          Common.renderer.setRenderTarget(this.props.output||null);
          Common.renderer.render(this.scene,this.camera);
          Common.renderer.setRenderTarget(null);
        }
      }

      // ── Advection ────────────────────────────────────────────────────────
      class Advection extends ShaderPass {
        line:any;
        constructor(p:any){
          super({material:{vertexShader:face_vert,fragmentShader:advection_frag,uniforms:{boundarySpace:{value:p.cellScale},px:{value:p.cellScale},fboSize:{value:p.fboSize},velocity:{value:p.src.texture},dt:{value:p.dt},isBFECC:{value:true}}},output:p.dst});
          this.uniforms=this.props.material.uniforms; this.init(); this.createBoundary();
        }
        createBoundary(){
          const g=new THREE.BufferGeometry();
          g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]),3));
          this.line=new THREE.LineSegments(g,new THREE.RawShaderMaterial({vertexShader:line_vert,fragmentShader:advection_frag,uniforms:this.uniforms}));
          this.scene.add(this.line);
        }
        update(opts:any){this.uniforms.dt.value=opts.dt;this.line.visible=opts.isBounce;this.uniforms.isBFECC.value=opts.BFECC;super.update();}
      }

      // ── ExternalForce ────────────────────────────────────────────────────
      class ExternalForce extends ShaderPass {
        mouse:any;
        constructor(p:any){
          super({output:p.dst}); super.init();
          const m=new THREE.RawShaderMaterial({vertexShader:mouse_vert,fragmentShader:externalForce_frag,blending:THREE.AdditiveBlending,depthWrite:false,uniforms:{px:{value:p.cellScale},force:{value:new THREE.Vector2()},center:{value:new THREE.Vector2()},scale:{value:new THREE.Vector2(p.cursor_size,p.cursor_size)}}});
          this.mouse=new THREE.Mesh(new THREE.PlaneGeometry(1,1),m); this.scene.add(this.mouse);
        }
        update(p:any){
          const u=this.mouse.material.uniforms;
          u.force.value.set((Mouse.diff.x/2)*p.mouse_force,(Mouse.diff.y/2)*p.mouse_force);
          const csx=p.cursor_size*p.cellScale.x; const csy=p.cursor_size*p.cellScale.y;
          u.center.value.set(Math.min(Math.max(Mouse.coords.x,-1+csx+p.cellScale.x*2),1-csx-p.cellScale.x*2),Math.min(Math.max(Mouse.coords.y,-1+csy+p.cellScale.y*2),1-csy-p.cellScale.y*2));
          u.scale.value.set(p.cursor_size,p.cursor_size); super.update();
        }
      }

      // ── Viscous / Divergence / Poisson / Pressure ─────────────────────
      class Viscous extends ShaderPass {
        constructor(p:any){super({material:{vertexShader:face_vert,fragmentShader:viscous_frag,uniforms:{boundarySpace:{value:p.boundarySpace},velocity:{value:p.src.texture},velocity_new:{value:p.dst_.texture},v:{value:p.viscous},px:{value:p.cellScale},dt:{value:p.dt}}},output:p.dst,output0:p.dst_,output1:p.dst});this.init();}
        update(opts:any){
          let fi=this.props.output0,fo=this.props.output1;
          this.uniforms.v.value=opts.viscous;
          for(let i=0;i<opts.iterations;i++){[fi,fo]=i%2===0?[this.props.output0,this.props.output1]:[this.props.output1,this.props.output0];this.uniforms.velocity_new.value=fi.texture;this.props.output=fo;this.uniforms.dt.value=opts.dt;super.update();}
          return fo;
        }
      }
      class Divergence extends ShaderPass {
        constructor(p:any){super({material:{vertexShader:face_vert,fragmentShader:divergence_frag,uniforms:{boundarySpace:{value:p.boundarySpace},velocity:{value:p.src.texture},px:{value:p.cellScale},dt:{value:p.dt}}},output:p.dst});this.init();}
        update(opts:any){this.uniforms.velocity.value=opts.vel.texture;super.update();}
      }
      class Poisson extends ShaderPass {
        constructor(p:any){super({material:{vertexShader:face_vert,fragmentShader:poisson_frag,uniforms:{boundarySpace:{value:p.boundarySpace},pressure:{value:p.dst_.texture},divergence:{value:p.src.texture},px:{value:p.cellScale}}},output:p.dst,output0:p.dst_,output1:p.dst});this.init();}
        update(opts:any){
          let pi=this.props.output0,po=this.props.output1;
          for(let i=0;i<opts.iterations;i++){[pi,po]=i%2===0?[this.props.output0,this.props.output1]:[this.props.output1,this.props.output0];this.uniforms.pressure.value=pi.texture;this.props.output=po;super.update();}
          return po;
        }
      }
      class Pressure extends ShaderPass {
        constructor(p:any){super({material:{vertexShader:face_vert,fragmentShader:pressure_frag,uniforms:{boundarySpace:{value:p.boundarySpace},pressure:{value:p.src_p.texture},velocity:{value:p.src_v.texture},px:{value:p.cellScale},dt:{value:p.dt}}},output:p.dst});this.init();}
        update(opts:any){this.uniforms.velocity.value=opts.vel.texture;this.uniforms.pressure.value=opts.pressure.texture;super.update();}
      }

      // ── Simulation ───────────────────────────────────────────────────────
      class Simulation {
        options:any; fbos:any; fboSize:any; cellScale:any; boundarySpace:any;
        advection:any; externalForce:any; viscous:any; divergence:any; poisson:any; pressure:any;
        constructor(opts:any){
          this.options={iterations_poisson:32,iterations_viscous:32,mouse_force:20,resolution:0.5,cursor_size:100,viscous:30,isBounce:false,dt:0.014,isViscous:false,BFECC:true,...opts};
          this.fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null};
          this.fboSize=new THREE.Vector2(); this.cellScale=new THREE.Vector2(); this.boundarySpace=new THREE.Vector2();
          this.calcSize(); this.createAllFBO(); this.createShaderPass();
        }
        getFloatType(){return /(iPad|iPhone|iPod)/i.test(navigator.userAgent)?THREE.HalfFloatType:THREE.FloatType;}
        createAllFBO(){
          const t=this.getFloatType(),opts={type:t,depthBuffer:false,stencilBuffer:false,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,wrapS:THREE.ClampToEdgeWrapping,wrapT:THREE.ClampToEdgeWrapping};
          for(const k in this.fbos) this.fbos[k]=new THREE.WebGLRenderTarget(this.fboSize.x,this.fboSize.y,opts);
        }
        createShaderPass(){
          this.advection=new Advection({cellScale:this.cellScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1});
          this.externalForce=new ExternalForce({cellScale:this.cellScale,cursor_size:this.options.cursor_size,dst:this.fbos.vel_1});
          this.viscous=new Viscous({cellScale:this.cellScale,boundarySpace:this.boundarySpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt});
          this.divergence=new Divergence({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.vel_viscous0,dst:this.fbos.div,dt:this.options.dt});
          this.poisson=new Poisson({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0});
          this.pressure=new Pressure({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0,dst:this.fbos.vel_0,dt:this.options.dt});
        }
        calcSize(){
          const w=Math.max(1,Math.round(this.options.resolution*Common.width));
          const h=Math.max(1,Math.round(this.options.resolution*Common.height));
          this.cellScale.set(1/w,1/h); this.fboSize.set(w,h);
        }
        resize(){this.calcSize();for(const k in this.fbos) this.fbos[k].setSize(this.fboSize.x,this.fboSize.y);}
        update(){
          this.boundarySpace[this.options.isBounce?'set':'copy'](this.options.isBounce?new THREE.Vector2():this.cellScale);
          this.advection.update({dt:this.options.dt,isBounce:this.options.isBounce,BFECC:this.options.BFECC});
          this.externalForce.update({cursor_size:this.options.cursor_size,mouse_force:this.options.mouse_force,cellScale:this.cellScale});
          let vel=this.fbos.vel_1;
          if(this.options.isViscous) vel=this.viscous.update({viscous:this.options.viscous,iterations:this.options.iterations_viscous,dt:this.options.dt});
          this.divergence.update({vel});
          const pressure=this.poisson.update({iterations:this.options.iterations_poisson});
          this.pressure.update({vel,pressure});
        }
      }

      // ── Output & WebGLManager ────────────────────────────────────────────
      class Output {
        simulation:any; scene:any; camera:any; output:any;
        constructor(){
          this.simulation=new Simulation({mouse_force:mouseForce,cursor_size:cursorSize,isViscous,viscous,iterations_viscous:iterationsViscous,iterations_poisson:iterationsPoisson,dt,BFECC,resolution,isBounce});
          this.scene=new THREE.Scene(); this.camera=new THREE.Camera();
          this.output=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.RawShaderMaterial({vertexShader:face_vert,fragmentShader:color_frag,transparent:true,depthWrite:false,uniforms:{velocity:{value:this.simulation.fbos.vel_0.texture},boundarySpace:{value:new THREE.Vector2()},palette:{value:paletteTex},bgColor:{value:bgVec4}}}));
          this.scene.add(this.output);
        }
        resize(){this.simulation.resize();}
        update(){this.simulation.update();Common.renderer.setRenderTarget(null);Common.renderer.render(this.scene,this.camera);}
      }

      class WebGLManager {
        props:any; output:any; autoDriver:any; lastUserInteraction:number; running:boolean;
        _loop:any; _resize:any; _onVisibility:any;
        constructor(p:any){
          this.props=p; this.lastUserInteraction=performance.now(); this.running=false;
          Common.init(p.$wrapper); Mouse.init(p.$wrapper);
          Mouse.autoIntensity=p.autoIntensity; Mouse.takeoverDuration=p.takeoverDuration;
          Mouse.onInteract=()=>{this.lastUserInteraction=performance.now();this.autoDriver?.forceStop();};
          this.autoDriver=new AutoDriver(Mouse,this,{enabled:p.autoDemo,speed:p.autoSpeed,resumeDelay:p.autoResumeDelay,rampDuration:p.autoRampDuration});
          p.$wrapper.prepend(Common.renderer.domElement);
          this.output=new Output();
          this._loop=this.loop.bind(this); this._resize=this.resize.bind(this);
          window.addEventListener('resize',this._resize);
          this._onVisibility=()=>{document.hidden?this.pause():(isVisibleRef.current&&this.start());};
          document.addEventListener('visibilitychange',this._onVisibility);
        }
        resize(){Common.resize();this.output.resize();}
        render(){this.autoDriver?.update();Mouse.update();Common.update();this.output.update();}
        loop(){if(!this.running)return;this.render();rafRef.current=requestAnimationFrame(this._loop);}
        start(){if(this.running)return;this.running=true;this._loop();}
        pause(){this.running=false;if(rafRef.current){cancelAnimationFrame(rafRef.current);rafRef.current=0;}}
        dispose(){
          try{
            window.removeEventListener('resize',this._resize);
            document.removeEventListener('visibilitychange',this._onVisibility);
            Mouse.dispose();
            const cvs=Common.renderer?.domElement;
            if(cvs?.parentNode) cvs.parentNode.removeChild(cvs);
            Common.renderer?.dispose(); Common.renderer?.forceContextLoss();
          }catch(e){/**/}
        }
      }

      // ── boot ─────────────────────────────────────────────────────────────
      container.style.position=container.style.position||'relative';
      container.style.overflow=container.style.overflow||'hidden';
      const webgl=new WebGLManager({$wrapper:container,autoDemo,autoSpeed,autoIntensity,takeoverDuration,autoResumeDelay,autoRampDuration});
      webglRef.current=webgl;
      webgl.start();

      const io=new IntersectionObserver(entries=>{
        const e=entries[0]; const vis=e.isIntersecting&&e.intersectionRatio>0;
        isVisibleRef.current=vis;
        if(!webglRef.current) return;
        vis&&!document.hidden?webglRef.current.start():webglRef.current.pause();
      },{threshold:[0,0.01,0.1]});
      io.observe(container); intersectionObserverRef.current=io;

      const ro=new ResizeObserver(()=>{
        if(!webglRef.current) return;
        if(resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current=requestAnimationFrame(()=>webglRef.current?.resize());
      });
      ro.observe(container); resizeObserverRef.current=ro;

      cleanupFn=()=>{
        if(rafRef.current) cancelAnimationFrame(rafRef.current);
        try{resizeObserverRef.current?.disconnect();}catch(e){/**/}
        try{intersectionObserverRef.current?.disconnect();}catch(e){/**/}
        webglRef.current?.dispose(); webglRef.current=null;
      };
    }); // end import("three").then

    return ()=>{ cancelled=true; cleanupFn?.(); };
  }, [BFECC,cursorSize,dt,isBounce,isViscous,iterationsPoisson,iterationsViscous,mouseForce,resolution,viscous,colors,autoDemo,autoSpeed,autoIntensity,takeoverDuration,autoResumeDelay,autoRampDuration]);

  return <div ref={mountRef} className={`liquid-ether-container${className?' '+className:''}`} style={style} />;
}
