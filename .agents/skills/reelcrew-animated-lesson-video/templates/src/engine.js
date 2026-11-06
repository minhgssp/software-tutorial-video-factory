// Hand-drawn crayon canvas engine, (paper textures, wobbly strokes, hatch fills, mascot).
// Deterministic: renderFrame(t) draws the frame at time t (seconds).
const W = 1920, H = 1080, FPS = 24;
const main = document.getElementById('c');
const mainCtx = main.getContext('2d');
let ctx = mainCtx;
const buf = document.createElement('canvas'); buf.width = W; buf.height = H;
const bufCtx = buf.getContext('2d');

const INK = '#2B2320', CREAM = '#F3EBDD', PAPER = '#ECE9E2';
const ORANGE = '#D97757', ORANGE_D = '#A9532F';
const WHITE = '#EFEBE2', WHITE_H = '#A9A498', DARK = '#34323A';
const LOX_C = '#5AA9E6', RP_C = '#E8A33D', GOLD = '#F6C343';
const FONT = '"Marker Felt","Chalkboard SE","Comic Sans MS",cursive';

// ---------- math + seeded randomness ----------
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R = mulberry(1), B = 0, T = 0, GA = 1, SC = 1, LWM = 1;
const rnd = (a=0,b=1) => a + (b-a)*R();
function hash(...a){let h=2166136261>>>0;for(const v of a)h=Math.imul(h^(v|0),16777619);return h>>>0}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const prog=(u,a,b)=>clamp((u-a)/(b-a));
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eo=t=>1-Math.pow(1-t,3);
const back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const frac=x=>x-Math.floor(x);
const hx=h=>[0,2,4].map(i=>parseInt(h.slice(1+i,3+i),16));
function mix(a,b,t){const pa=hx(a),pb=hx(b);return '#'+pa.map((v,i)=>Math.round(lerp(v,pb[i],t)).toString(16).padStart(2,'0')).join('')}

// ---------- geometry ----------
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
function ell(cx,cy,rx,ry,n=28){const o=[];for(let i=0;i<n;i++){const a=Math.PI*2*i/n;o.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}return o}
function blob(cx,cy,rx,ry,k=0,n=30){const o=[];for(let i=0;i<n;i++){const a=Math.PI*2*i/n;const m=1+.18*Math.sin(3*a+k)+.1*Math.sin(5*a+k*2);o.push([cx+Math.cos(a)*rx*m,cy+Math.sin(a)*ry*m])}return o}
function subdiv(p,closed,step){const out=[],n=p.length,m=closed?n:n-1;
  for(let i=0;i<m;i++){const a=p[i],b=p[(i+1)%n];const k=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/step));
    for(let j=0;j<k;j++)out.push([lerp(a[0],b[0],j/k),lerp(a[1],b[1],j/k)])}
  if(!closed)out.push(p[n-1]);return out}
const jit=(p,j)=>p.map(q=>[q[0]+rnd(-j,j),q[1]+rnd(-j,j)]);
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function seedPts(p,x){R=mulberry(hash(Math.round(p[0][0]),Math.round(p[0][1]),p.length,B,x))}
function path(p,closed){ctx.beginPath();
  if(p.length<3){ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);if(closed)ctx.closePath();return}
  if(closed){const m0=mid(p[p.length-1],p[0]);ctx.moveTo(m0[0],m0[1]);
    for(let i=0;i<p.length;i++){const a=p[i],m=mid(a,p[(i+1)%p.length]);ctx.quadraticCurveTo(a[0],a[1],m[0],m[1])}ctx.closePath()}
  else{ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length-1;i++){const m=mid(p[i],p[i+1]);ctx.quadraticCurveTo(p[i][0],p[i][1],m[0],m[1])}const l=p[p.length-1];ctx.lineTo(l[0],l[1])}}

// ---------- crayon primitives ----------
// Wobbly double-pass line; widths are in screen pixels regardless of local scale.
function stroke(p,{c=INK,w=4,closed=false,j=1.4,a=.92,sub=true}={}){
  const q=sub?subdiv(p,closed,14/SC):p; seedPts(q,7);
  ctx.save();ctx.strokeStyle=c;ctx.lineCap='round';ctx.lineJoin='round';
  for(let k=0;k<2;k++){ctx.globalAlpha=GA*a*(k?.5:1);ctx.lineWidth=w*LWM*(k?.55:1)*rnd(.85,1.1)/SC;path(jit(q,j/SC),closed);ctx.stroke()}
  ctx.restore()}
// Filled shape with crayon hatching clipped inside and a misregistered outline.
function fillC(p,fill,{hatch=null,ang=-.7,sp=9,ha=.35,hw=2,line=INK,w=4,j=1.2}={}){
  const q=subdiv(p,true,14/SC); seedPts(q,3);
  ctx.save();ctx.globalAlpha=GA;ctx.fillStyle=fill;path(jit(q,j/SC),true);ctx.fill();
  if(hatch){ctx.clip();let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(const[a,b]of q){x0=Math.min(x0,a);x1=Math.max(x1,a);y0=Math.min(y0,b);y1=Math.max(y1,b)}
    const cx=(x0+x1)/2,cy=(y0+y1)/2,rr=Math.hypot(x1-x0,y1-y0)/2+10/SC,dx=Math.cos(ang),dy=Math.sin(ang),nx=-dy,ny=dx,s=sp/SC;
    ctx.strokeStyle=hatch;ctx.lineCap='round';ctx.globalAlpha=GA*ha;ctx.lineWidth=hw*LWM/SC;ctx.beginPath();
    for(let d=-rr;d<=rr;d+=s*rnd(.7,1.3)){let t=-rr;while(t<rr){const L=rnd(20,90)/SC,ox=cx+nx*d,oy=cy+ny*d;
      ctx.moveTo(ox+dx*t,oy+dy*t);ctx.lineTo(ox+dx*(t+L)+nx*rnd(-2,2)/SC,oy+dy*(t+L)+ny*rnd(-2,2)/SC);t+=L+rnd(4,30)/SC}}
    ctx.stroke()}
  ctx.restore();
  if(line)stroke(q,{c:line,w,closed:true,sub:false})}
function label(txt,x,y,{size=46,c=CREAM,a=1,align='center',pop=1}={}){
  if(a<=0)return;ctx.save();ctx.globalAlpha=GA*a;ctx.translate(x,y);R=mulberry(hash(B,txt.length,Math.round(x)));
  ctx.rotate(rnd(-.012,.012));const s=lerp(.6,1,back(pop));ctx.scale(s,s);
  ctx.font=`${size}px ${FONT}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=c;ctx.fillText(txt,0,0);ctx.restore()}
function tlabel(txt,x,y,u,t0,t1=99,o={}){const a=prog(u,t0,t0+.3)*(1-prog(u,t1,t1+.3));label(txt,x,y,{...o,a,pop:prog(u,t0,t0+.45)})}
function arrow(x0,y0,x1,y1,p=1,{c=CREAM,w=4,head=18}={}){
  if(p<=0)return;const xe=lerp(x0,x1,p),ye=lerp(y0,y1,p),mx=(x0+xe)/2+(ye-y0)*.06,my=(y0+ye)/2-(xe-x0)*.06;
  const sh=[];for(let i=0;i<=12;i++){const t=i/12;sh.push([(1-t)**2*x0+2*(1-t)*t*mx+t*t*xe,(1-t)**2*y0+2*(1-t)*t*my+t*t*ye])}stroke(sh,{c,w,sub:false});const a=Math.atan2(ye-my,xe-mx);
  for(const s of[-.5,.5])stroke([[xe-Math.cos(a+s)*head,ye-Math.sin(a+s)*head],[xe,ye]],{c,w})}
const tarrow=(u,t0,x0,y0,x1,y1,t1=99,o={})=>{GA=1-prog(u,t1,t1+.3);arrow(x0,y0,x1,y1,eo(prog(u,t0,t0+.4)),o);GA=1};
function puff(x,y,r,a=1,col=CREAM,h='#B8B0C8'){if(a<=0||r<=0)return;const g=GA;GA*=a;fillC(blob(x,y,r,r*.85,x*.01,18),col,{hatch:h,ha:.4,line:null,sp:7});GA=g}

// ---------- textures + backgrounds ----------
function makeTex(light){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');R=mulberry(light?99:42);
  const col=light?'255,255,255':'110,95,80';
  for(let i=0;i<140;i++){const x=rnd(0,W),y=rnd(0,H),r=rnd(80,320),gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${col},${rnd(.015,light?.03:.05)})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r)}
  for(let i=0;i<70000;i++){const v=light?255:(rnd(60,150)|0);g.fillStyle=`rgba(${v},${v},${v},${rnd(.015,light?.05:.09)})`;g.fillRect(rnd(0,W),rnd(0,H),rnd(.8,2.2),rnd(.8,2.2))}
  g.strokeStyle=`rgba(${col},${light?.035:.05})`;g.lineWidth=1.3;g.beginPath();
  for(let i=0;i<4000;i++){const x=rnd(0,W),y=rnd(0,H),L=rnd(10,40);g.moveTo(x,y);g.lineTo(x+L*.94,y-L*.34)}g.stroke();return c}
let TEX_D, TEX_L;
const STARS=(()=>{R=mulberry(7);return Array.from({length:260},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(.8,2.4),p:rnd(0,6.28),sp:R()<.07}))})();
function stars(a){if(a<=0)return;ctx.save();ctx.fillStyle='#F5EEDB';
  for(const s of STARS){ctx.globalAlpha=GA*a*(.55+.45*Math.sin(T*2.2+s.p));
    if(s.sp){const r=s.r*4;ctx.beginPath();ctx.moveTo(s.x,s.y-r);ctx.quadraticCurveTo(s.x,s.y,s.x+r,s.y);ctx.quadraticCurveTo(s.x,s.y,s.x,s.y+r);ctx.quadraticCurveTo(s.x,s.y,s.x-r,s.y);ctx.quadraticCurveTo(s.x,s.y,s.x,s.y-r);ctx.fill()}
    else ctx.fillRect(s.x,s.y,s.r,s.r)}ctx.restore()}
function paperBG(){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);ctx.drawImage(TEX_D,0,0)}
function spaceBG(sa=1){const g=ctx.createRadialGradient(W/2,H*.42,40,W/2,H/2,1250);g.addColorStop(0,'#211E4E');g.addColorStop(1,'#07071A');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalAlpha=.8;ctx.drawImage(TEX_L,0,0);ctx.globalAlpha=1;stars(sa)}

// ---------- characters ----------
function mascot(x,y,s,{walk=0,moving=false,lookX=0,lookY=0,happy=0,arms=0,eyeCol=INK}={}){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);const pS=SC;SC=s;
  [-80,-52,40,68].forEach((lx,i)=>{const ph=moving?Math.sin(walk*Math.PI*2+(i%2?Math.PI:0)):0,lift=Math.max(0,ph)*14;
    fillC(rect(lx,-60,18,60-lift),ORANGE,{hatch:ORANGE_D,w:4})});
  ctx.translate(0,moving?-Math.abs(Math.sin(walk*Math.PI*2))*5:0);
  for(const sd of[-1,1]){ctx.save();ctx.translate(sd*100,-134);ctx.rotate(-sd*arms*.9);
    fillC(rect(sd>0?-2:-32,-16,34,32),ORANGE,{hatch:ORANGE_D,w:4});ctx.restore()}
  fillC(rect(-100,-192,200,136),ORANGE,{hatch:ORANGE_D,ang:-.8,sp:7,ha:.4,w:5});
  for(const ex of[-46,46]){
    if(happy>.5)stroke([[ex-15,-124],[ex,-142],[ex+15,-124]],{w:6});
    else fillC(rect(ex-9+lookX,-152-lookY,18,34),eyeCol,{line:null})}
  SC=pS;ctx.restore()}

