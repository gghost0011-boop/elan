/* Ma journée — noyau de l’application : données, vues Jour/Semaine/Mois/Bilan, réglages */
var LANG="fr",LOC="fr-CA",K="planner-v2",S={tasks:[],tpls:[],gen:{}},view="d",editId=null,opened=null,notified={},DUR=[15,30,45,60,90,120,180,240,300,360,480,600,720],ST={done:"⟦Terminée⟧",int:"⟦Interrompue⟧",stop:"⟦Arrêtée⟧"},CATS=["Cours","Business","Travail","Sport","Perso","Autre"],WD=["L","M","M","J","V","S","D"],undo=null,pm=null,q="",fc="",tl=0,sh=0,opt=0,sel=null,sp="m",sdet=null,wopen={},odo=0,gf=null,gid=null,gco=0,gopn={},GSC={},GDM=null,jro=0,gwo=0,wnow=null,dnOpen=0;
function p2(n){return String(n).padStart(2,"0")}
function iso(d){return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())}
function parse(s){var a=s.split("-");return new Date(+a[0],a[1]-1,+a[2])}
var cur=iso(new Date()),lastDay=cur;
try{var r=JSON.parse(localStorage.getItem(K));if(r&&r.tasks)S=r;else{JSON.parse(localStorage.getItem("planner-v1")||"[]").forEach(function(t){t.date=cur;t.st=t.done?"done":"";delete t.done;S.tasks.push(t)})}}catch(e){}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function uid(){return Date.now()+Math.floor(Math.random()*1e4)}
function mins(s){var p=s.split(":");return +p[0]*60+ +p[1]}
function fmt(m){m%=1440;return p2(Math.floor(m/60))+(LANG=="fr"?"h":":")+p2(m%60)}
function hhmm(m){return p2(Math.floor(m/60)%24)+":"+p2(m%60)}
function dl(m){return m<60?m+" min":Math.floor(m/60)+" h"+(m%60?" "+p2(m%60):"")}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function find(id){return S.tasks.filter(function(t){return t.id==id})[0]}
function wdi(d){return(parse(d).getDay()+6)%7}
function ensure(d){if(d>=iso(new Date())&&!S.gen[d]){S.gen[d]=1;S.tpls.forEach(function(t){if(t.until&&d>t.until||t.wk)return;var gz=t.gl&&goalOf(t.gl);if(gz&&gz.pz&&d>=gz.pz)return;if((t.days||[0,1,2,3,4,5,6]).indexOf(wdi(d))>-1&&!S.tasks.some(function(x){return x.date==d&&(x.tp==t.id||(t.gl&&x.gl==t.gl&&x.title.trim().toLowerCase()==t.title.trim().toLowerCase()))}))S.tasks.push({id:uid(),title:t.title,start:t.start,dur:t.dur,pri:t.pri,cat:t.cat,note:(t.note||"").replace(/^x /gm,"- "),date:d,st:"",tp:t.id,gl:t.gl,q:t.q})});save()}}
function day(d){ensure(d);return S.tasks.filter(function(t){return t.date==d}).sort(function(a,b){return mins(a.start)-mins(b.start)})}
function over(t,l){return l.filter(function(o){return o.id!=t.id&&t.dur&&o.dur&&mins(o.start)<mins(t.start)+t.dur&&mins(t.start)<mins(o.start)+o.dur})}
function opts(a,sel,lab){return a.map(function(v){return'<option value="'+v+'"'+(v==sel?" selected":"")+'>'+lab(v)+'</option>'}).join("")}
function nowHM(){var n=new Date();return fmt(n.getHours()*60+n.getMinutes())}
function toast(x,cb){var t=document.getElementById("toast");t.textContent=mk(x);t.className="on"+(cb?" cb":"");t.onclick=cb?function(){cb();t.className=""}:null;clearTimeout(toast.h);toast.h=setTimeout(function(){t.className=""},cb?8000:5000)}
var STY={classic:["Classique"],
ocean:["Océan","#eef6f6","#fff","#d3e4e4","#0e8a8a","#0f1a1b","#172526","#264041","#3cc4c4","#062222"],
forest:["Forêt","#f1f5ee","#fff","#dbe5d4","#2e7d46","#121a14","#1a251d","#2a3b2f","#5cc47d","#07210f"],
twilight:["Crépuscule","#f4f1f8","#fff","#e1daec","#7048c8","#17141f","#211d2c","#342d45","#a98bff","#1a0d3b"],
midnight:["Minuit","#f2f2f2","#fff","#dddddd","#222222","#000000","#111111","#262626","#6b9bff","#000000"],
brown:["Marron","#f4ede6","#fffaf5","#e4d5c7","#7b4a2d","#1c1511","#261d18","#3c2e25","#c58a5e","#231106"]},
CATC={Cours:"#4c8bf5",Business:"#e07b39",Travail:"#d4568a",Sport:"#2fa36b",Perso:"#b85fd0",Autre:"#8a8f98"};
function cc(c){return CATC[c]||"#8a8f98"}
function dot(c){return c?'<i class="cd" style="background:'+cc(c)+'"></i>':""}
function isDark(){try{return S.theme=="dark"||(!S.theme&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){return false}}
function applyTheme(){
  if(S.style&&!STY[S.style])delete S.style;
  var r=document.documentElement,st=STY[S.style]||STY.classic,dk=isDark(),ks=["bg","card","line","accent","act"];
  if(S.theme)r.setAttribute("data-theme",S.theme);else r.removeAttribute("data-theme");
  ks.forEach(function(k){r.style.removeProperty("--"+k)});
  if(st.length>1)ks.slice(0,dk?5:4).forEach(function(k,i){r.style.setProperty("--"+k,st[(dk?5:1)+i])});
  try{var m=document.querySelector("meta[name=theme-color]"),b=getComputedStyle(r).getPropertyValue("--bg").trim();if(m&&b)m.content=b}catch(e){}}
function styleBtns(){var dk=isDark();return Object.keys(STY).map(function(k){var a=STY[k],c=a.length>1?(dk?[a[5],a[8]]:[a[1],a[4]]):(dk?["#161615","#6b9bff"]:["#f6f5f1","#2f6fed"]);return'<button class="sty'+((S.style||"classic")==k?" on":"")+'" data-act="sty" data-id="'+k+'" style="background:'+c[0]+";color:"+(dk?"#f0efea":"#1d1d1b")+'"><i style="background:'+c[1]+'"></i><span>⟦'+a[0]+'⟧</span></button>'}).join("")}
function dlf(n,t,ty){var f=new File([t],n,{type:ty});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f]}).catch(function(){})}else{var a=document.createElement("a");a.href=URL.createObjectURL(f);a.download=n;a.click()}}
function restore(f){if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o.tasks||!o.tpls)throw 0;if(!confirm(mk("⟦Remplacer toutes les données actuelles par la sauvegarde ({0} tâches)?|"+o.tasks.length+"⟧")))return;S=o;save();applyTheme();setLang();render();toast("⟦Sauvegarde restaurée⟧")}catch(e){toast("⟦Fichier invalide⟧")}};r.readAsText(f)}
function ics(){
  var f=function(x){return iso(x).replace(/-/g,"")+"T"+p2(x.getHours())+p2(x.getMinutes())+"00"},q2=function(z){return String(z||"").replace(/[\\;,]/g,"\\$&").replace(/\n/g,"\\n")},
  L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ma journee//FR","CALSCALE:GREGORIAN"],td=iso(new Date()),stamp=new Date().toISOString().replace(/[-:]|\.\d+/g,""),
  ev=function(t,date,rule){var a=parse(date),b=parse(date);a.setMinutes(mins(t.start));b.setMinutes(mins(t.start)+t.dur);L.push("BEGIN:VEVENT","UID:"+t.id+"@majournee","DTSTAMP:"+stamp,"DTSTART:"+f(a),(t.dur?"DTEND:"+f(b):"X-POINT:1"),"SUMMARY:"+q2(t.title));if(rule)L.push(rule);if(t.note)L.push("DESCRIPTION:"+q2(t.note));if(t.cat)L.push("CATEGORIES:"+q2(t.cat));L.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+tr("Rappel"),"TRIGGER:-PT5M","END:VALARM","END:VEVENT")};
  S.tasks.filter(function(t){return!t.tp&&t.date>=td}).forEach(function(t){ev(t,t.date)});
  S.tpls.forEach(function(p){if(p.wk||(p.until&&p.until<td))return;var gg=p.gl&&goalOf(p.gl);if(gg&&gg.pz)return;var ds=S.tasks.filter(function(t){return t.tp==p.id}).map(function(t){return t.date}).sort();ev(p,ds[0]||td,"RRULE:FREQ=WEEKLY;BYDAY="+(p.days||[0,1,2,3,4,5,6]).map(function(i){return["MO","TU","WE","TH","FR","SA","SU"][i]}).join(",")+(p.until?";UNTIL="+p.until.replace(/-/g,"")+"T235959":""))});
  var evd=function(id,title,date,trig){L.push("BEGIN:VEVENT","UID:"+id+"@majournee","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+date.replace(/-/g,""),"SUMMARY:"+q2(title),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+tr("Rappel"),"TRIGGER:"+trig,"END:VALARM","END:VEVENT")};
  (S.goals||[]).forEach(function(g){if(g.date>=td)evd("goal"+g.id,"🎯 "+g.title,g.date,"-P1D");(g.ms||[]).forEach(function(m){if(!m.done&&m.date>=td)evd("ms"+m.id,"🏁 "+m.title+" ("+g.title+")",m.date,"-P1D")})});
  L.push("END:VCALENDAR");dlf("planning.ics",L.join("\r\n"),"text/calendar")}
function pmTick(){if(!pm)return;var r=Math.round((pm.end-Date.now())/1000);if(r<=0){pm.work=!pm.work;pm.end=Date.now()+(pm.work?25:5)*6e4;ping("⟦"+(pm.work?"Pause finie : au travail (25 min)":"Bravo ! Pause de 5 min")+"⟧");r=Math.round((pm.end-Date.now())/1000)}var s=tr(pm.work?"Travail":"Pause")+" "+p2(Math.floor(r/60))+":"+p2(r%60),e=document.getElementById("pmv");if(e)e.textContent=s;document.title="⏱ "+s}
function noteHTML(t){return(t.note||"").split("\n").map(function(x,i){var m=/^(-|x) (.*)/.exec(x);return m?'<label class="sb"><input type="checkbox" data-act="sub" data-id="'+t.id+'" data-i="'+i+'"'+(m[1]=="x"?" checked":"")+'> '+esc(m[2])+'</label>':(x.trim()?'<div class="mut">'+esc(x)+'</div>':"")}).join("")}
function tlHTML(l){if(!l.length)return"";var k=.8,s0=Math.floor(Math.min.apply(null,l.map(function(t){return mins(t.start)}))/60),e0=Math.min(24,Math.ceil(Math.max.apply(null,l.map(function(t){return Math.min(1440,mins(t.start)+Math.max(t.dur,30))}))/60)),h='<div class="tl" style="height:'+(e0-s0)*60*k+'px">';
  for(var i=s0;i<=e0;i++)h+='<div class="hl" style="top:'+(i-s0)*60*k+'px"><span>'+p2(i)+'h</span></div>';
  l.forEach(function(t){h+='<div class="tb p'+t.pri+" "+(t.st||"")+'" data-act="edit" data-id="'+t.id+'" style="top:'+(mins(t.start)-s0*60)*k+'px;height:'+Math.max(22,t.dur*k)+'px">'+dot(t.cat)+fmt(mins(t.start))+" "+esc(t.title)+'<span class="grip" data-act="grip">⋮⋮</span></div>'});return h+"</div>"}
function addd(x,n){var d=parse(x);d.setDate(d.getDate()+n);return iso(d)}
function qp(o){var x=o.title,st=null,du=null;
  x=x.replace(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i,function(a,h,mi,ap){st=(+h%12+(/pm/i.test(ap)?12:0))*60+(+mi||0);return" "});
  x=x.replace(/\b(\d{1,3})\s*min\b/i,function(a,n){du=+n;return" "});
  x=x.replace(/\b(\d{1,2})\s*[h:]\s*(\d{2})?\b/gi,function(a,h,mi){var v=+h*60+(+mi||0);if(+h<24&&st===null)st=v;else if(du===null&&v>0)du=v;else return a;return" "});
  if(st!==null||du!==null){o.title=x.replace(/\s+/g," ").trim()||o.title;if(st!==null)o.start=hhmm(st);if(du!==null&&o.dur)o.dur=Math.min(720,Math.max(5,du))}}
function topCards(td){
  var gc=goalChips(td);if(cur!=td)return gc;var h=gc,od=S.tasks.filter(function(t){return t.date<td&&t.date>=addd(td,-7)&&!t.st&&!t.tp}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:mins(a.start)-mins(b.start)});
  if(od.length)h+='<div class="card odc"><button class="odh" data-act="odt"><span>⟦En retard⟧ ('+od.length+')</span><span>'+(odo?"▴":"▾")+'</span></button>'+(odo?od.slice(0,8).map(function(t){return'<div class="od"><span class="odt"><span class="mut">'+parse(t.date).toLocaleDateString(LOC,{weekday:"short",day:"numeric"})+" "+fmt(mins(t.start))+"</span> "+esc(t.title)+'</span><span><button data-act="od" data-k="mv" data-id="'+t.id+'">→ ⟦Aujourd’hui⟧</button><button data-act="od" data-k="dn" data-id="'+t.id+'">✓</button><button data-act="od" data-k="ig" data-id="'+t.id+'">⟦Ignorer⟧</button></span></div>'}).join("")+(od.length>8?'<div class="mut">+'+(od.length-8)+'</div>':""):"")+'</div>';
  var lb=S.bk,dd=lb?Math.round((parse(td)-parse(lb))/864e5):0;
  if(S.tasks.length>=3&&(!lb||dd>=14)&&(!S.bkz||S.bkz<=td))h+='<div class="od" style="margin:0 0 12px"><span class="mut">'+(lb?"⟦Dernière sauvegarde il y a {0} jours|"+dd+"⟧":"⟦Aucune sauvegarde pour l’instant⟧")+'</span><span><button data-act="bk">⟦Sauvegarder⟧</button><button data-act="bkz">⟦Plus tard⟧</button></span></div>';
  return h}
function mdHTML(){var ms=S.models||[],wm=S.wm||[];return'<div class="tools"><button data-act="mdsave">⟦Enregistrer comme modèle⟧</button><button data-act="wmsave">⟦Enregistrer la semaine comme modèle⟧</button></div>'+ms.map(function(m,i){return'<div class="tools" style="margin-top:0"><button data-act="mdapply" data-i="'+i+'">⟦Appliquer⟧ : '+esc(m.name)+" ("+m.tasks.length+')</button><button data-act="mddel" data-i="'+i+'" aria-label="✕">✕</button></div>'}).join("")+wm.map(function(m,i){return'<div class="tools" style="margin-top:0"><span>📅 '+esc(m.name)+" ("+m.tasks.length+')</span><button data-act="wmapply" data-i="'+i+'" data-k="0">⟦Cette semaine⟧</button><button data-act="wmapply" data-i="'+i+'" data-k="1">⟦Semaine prochaine⟧</button><button data-act="wmdel" data-i="'+i+'" aria-label="✕">✕</button></div>'}).join("")}
function habHTML(){
  var td=iso(new Date()),g={},act=[],brk=[];
  S.tasks.forEach(function(t){var k=(t.title||"").trim().toLowerCase();if(!k)return;var o=g[k]=g[k]||{title:t.title,by:{},p:null};o.by[t.date]=t;if(t.tp&&!o.p)o.p=S.tpls.filter(function(p){return p.id==t.tp})[0]||null});
  Object.keys(g).forEach(function(k){var o=g[k],dys=o.p?(o.p.days||[0,1,2,3,4,5,6]):[0,1,2,3,4,5,6],seq=[];o.dys=dys;
    for(var i=0;i<60;i++){var d=addd(td,-i);if(dys.indexOf(wdi(d))<0)continue;var t=o.by[d];if(i==0&&!(t&&t.st=="done"))continue;seq.push({d:d,ok:!!(t&&t.st=="done")})}
    var n=0;while(n<seq.length&&seq[n].ok)n++;
    if(n>=2)act.push({o:o,n:n});
    else if(n==0&&seq.length){var j=0;while(j<seq.length&&!seq[j].ok)j++;var r=0;while(j+r<seq.length&&seq[j+r].ok)r++;if(r>=2&&seq[j].d>=addd(td,-14))brk.push({o:o,n:r,end:seq[j].d})}});
  if(!act.length&&!brk.length)return"";
  var sq=function(o){var q="";for(var i=0;i<14;i++){var d=addd(td,-i),sc=o.dys.indexOf(wdi(d))>-1,t=o.by[d];q='<i class="sq '+(!sc?"x":t&&t.st=="done"?"d":t&&t.st?"i":"")+'"></i>'+q}return'<div class="sqs">'+q+'</div>'};
  act.sort(function(a,b){return b.n-a.n});
  return'<div class="card"><b>⟦Habitudes⟧</b>'+act.map(function(x){return'<div class="hab"><b>'+esc(x.o.title)+'</b> <span class="mut">⟦'+(x.n==1?"{0} jour d’affilée":"{0} jours d’affilée")+"|"+x.n+'⟧</span>'+sq(x.o)+'</div>'}).join("")+brk.map(function(x){return'<div class="hab"><b>'+esc(x.o.title)+'</b> <span class="mut">⟦Rythme cassé : {0} jours d’affilée, dernière fois le {1}|'+x.n+"|"+parse(x.end).toLocaleDateString(LOC,{day:"numeric",month:"short"})+'⟧</span>'+sq(x.o)+'</div>'}).join("")+'</div>'}
function dbt(a,b){return Math.round((parse(b)-parse(a))/864e5)}
function nf(x){var r=Math.abs(x)<1?100:10;return(Math.round(x*r)/r).toLocaleString(LOC)}
function durOpts(v,z){var l=(z?[0]:[]).concat(DUR);if(l.indexOf(v)<0)l.push(v);return l.sort(function(a,b){return a-b})}
function wk0(d){return addd(d,-wdi(d))}
function rng(k){var d=parse(cur),a,b;if(sp=="m"){a=new Date(d.getFullYear(),d.getMonth()+k,1);b=new Date(d.getFullYear(),d.getMonth()+k+1,0)}else{a=new Date(d);a.setDate(d.getDate()-((d.getDay()+6)%7)+7*k);b=new Date(a);b.setDate(a.getDate()+6)}return[iso(a),iso(b)]}
function tin(r){return S.tasks.filter(function(t){return t.date>=r[0]&&t.date<=r[1]})}
function rate(l){return l.length?Math.round(l.filter(function(t){return t.st=="done"}).length/l.length*100):null}
function real(t){if(t.st=="done"&&t.as&&t.ae){var r=mins(t.ae)-mins(t.as);return r<0?r+1440:r}return t.st=="done"?t.dur:(t.st&&t.at?Math.max(0,Math.min(t.dur,mins(t.at.replace("h",":"))-mins(t.start))):0)}
function evs(t){return(t.hist||[]).map(function(h){return{w:h.w,a:h.a,t:t}}).concat(t.st=="int"||t.st=="stop"?[{w:t.why||"",a:t.at,t:t}]:[])}
function hr(a){return a?parseInt(a):-1}
function best(a){var m={},b=-1,n=0;a.forEach(function(h){if(h>=0){m[h]=(m[h]||0)+1;if(m[h]>n){n=m[h];b=h}}});return b>=0?b+" h":null}
function nd(x){var d=parse(x);d.setDate(d.getDate()+1);return iso(d)}
function streak(){var ds={};S.tasks.forEach(function(t){if(t.st=="done")ds[t.date]=1});var k=Object.keys(ds).sort(),bs=0,run=0,pv=null;k.forEach(function(x){run=pv&&nd(pv)==x?run+1:1;bs=Math.max(bs,run);pv=x});var c=0,x=new Date();if(!ds[iso(x)])x.setDate(x.getDate()-1);while(ds[iso(x)]){c++;x.setDate(x.getDate()-1)}return[c,bs]}
function statsHTML(){
  var r=rng(0),d=parse(cur),dm=function(x){return parse(x).toLocaleDateString(LOC,{day:"numeric",month:"short"})},
  tg='<div class="tools" style="margin-top:0"><button data-act="sp" data-id="w" class="'+(sp=="w"?"on":"")+'">⟦Semaine⟧</button><button data-act="sp" data-id="m" class="'+(sp=="m"?"on":"")+'">⟦Mois⟧</button></div>';
  document.getElementById("lbl").textContent=sp=="m"?d.toLocaleDateString(LOC,{month:"long",year:"numeric"}):tr("Semaine du")+" "+dm(r[0])+" "+tr("au")+" "+dm(r[1]);
  var l=tin(r);if(!l.length)return tg+(jrStats(r)||'<div class="mut" style="text-align:center;padding:20px 0">⟦Aucune donnée pour cette période.⟧</div>');
  var c={done:0,int:0,stop:0,"":0},plan=0,rl=0,ni=0,bc={},bp={1:[0,0],2:[0,0],3:[0,0]},why={},byd={},hd=[],hi=[],evl=[],dif=[];
  l.forEach(function(t){c[t.st||""]++;plan+=t.dur;var x=real(t);rl+=x;(byd[t.date]=byd[t.date]||[]).push(t);
    var k=t.cat||"Sans catégorie";bc[k]=bc[k]||[0,0,0,0];bc[k][0]++;bc[k][1]+=t.dur;bc[k][3]+=x;bp[t.pri][0]++;
    if(t.st=="done"){bc[k][2]++;bp[t.pri][1]++;if(t.at){hd.push(hr(t.at));dif.push(mins(String(t.at).replace("h",":"))-mins(t.start))}}
    evs(t).forEach(function(e){ni++;evl.push(e);hi.push(hr(e.a));if(e.w)why[e.w]=(why[e.w]||0)+1})});
  var r1=rate(l),r0=rate(tin(rng(-1))),cmp=r0===null?"":" · "+(r1>r0?"▲ +":r1<r0?"▼ −":"= ")+Math.abs(r1-r0)+" pts ⟦vs période précédente⟧ ("+r0+" %)";
  var h=tg+'<div class="card" style="margin-top:10px"><b>'+l.length+' ⟦tâches⟧</b> · '+r1+' % ⟦terminées⟧'+cmp+'<br><span class="mut">'+c.done+' ⟦terminées⟧ · '+c.int+' ⟦interrompues⟧ · '+c.stop+' ⟦arrêtées⟧ · '+c[""]+' ⟦sans suivi⟧ · '+ni+' ⟦'+(ni>1?"interruptions":"interruption")+'⟧'+'</span></div>';
  h+='<div class="card">⟦Temps prévu :⟧ <b>'+dl(plan)+'</b><br>⟦Temps réellement tenu :⟧ <b>'+dl(rl)+'</b> ('+(plan?Math.round(rl/plan*100):0)+' %)</div>';
  var days=[],mx=1;for(var x=parse(r[0]);iso(x)<=r[1];x.setDate(x.getDate()+1))days.push(iso(x));
  days.forEach(function(k){mx=Math.max(mx,(byd[k]||[]).length)});
  h+='<div class="card"><b>⟦Jour par jour⟧</b> <span class="mut">⟦(vert : terminées, gris : prévues)⟧</span><div class="chart">'+days.map(function(k,i){var g=byd[k]||[],dn=g.filter(function(t){return t.st=="done"}).length,n=parse(k).getDate();return'<div class="col"><div class="cb" style="height:'+g.length/mx*70+'px"><i style="height:'+(g.length?dn/g.length*100:0)+'%"></i></div><small>'+(sp=="w"?WD[i]:(n==1||n%5==0?n:""))+'</small></div>'}).join("")+'</div></div>';
  var sl=[["Nuit",0,5],["Matin",5,12],["Après-midi",12,18],["Soir",18,24]].map(function(z){var g=l.filter(function(t){var q=Math.floor(mins(t.start)/60);return q>=z[1]&&q<z[2]}),dn=g.filter(function(t){return t.st=="done"}).length,it=0;g.forEach(function(t){it+=evs(t).length});return g.length?'<div class="srow"><span>⟦'+z[0]+'⟧</span><div class="bar"><i style="width:'+dn/g.length*100+'%"></i></div><span>'+dn+"/"+g.length+" · "+it+" int.</span></div>":""}).join(""),bd=best(hd),bi=best(hi);
  h+='<div class="card"><b>⟦Moments de la journée⟧</b> <span class="mut">⟦(selon l’heure prévue)⟧</span>'+sl+(bd?'<div class="mut">⟦Tu termines le plus de tâches vers {0}.|'+bd+'⟧</div>':"")+(bi?'<div class="mut">⟦Tu interromps le plus vers {0}.|'+bi+'⟧</div>':"")+gapHTML(dif)+'</div>';
  h+=sleepHTML(l);h+=jrStats(r);
  h+='<div class="card"><b>⟦Par catégorie⟧</b> <span class="mut">⟦(terminées · temps tenu / prévu)⟧</span>';
  Object.keys(bc).forEach(function(k){var v=bc[k];h+='<div class="srow"><span>'+dot(k)+"⟦"+esc(k)+"⟧"+'</span><div class="bar"><i style="width:'+v[2]/v[0]*100+'%"></i></div><span>'+v[2]+"/"+v[0]+" · "+dl(v[3])+" / "+dl(v[1])+'</span></div>'});
  h+='</div><div class="card"><b>⟦Par priorité⟧</b> ⟦(terminées)⟧<br>'+[1,2,3].map(function(p){return"⟦"+["","Haute","Moyenne","Basse"][p]+"⟧"+" : "+bp[p][1]+"/"+bp[p][0]}).join(" · ")+'</div>';
  var st=streak(),wd=[0,0,0,0,0,0,0],wn=[0,0,0,0,0,0,0],bj=-1,br=-1;
  S.tasks.forEach(function(t){var i=wdi(t.date);wn[i]++;if(t.st=="done")wd[i]++});
  wn.forEach(function(n,i){if(n>=3&&wd[i]/n>br){br=wd[i]/n;bj=i}});
  h+='<div class="card"><b>⟦Série⟧</b><br>'+st[0]+' ⟦'+(st[0]>1?"jours d’affilée avec au moins une tâche terminée":"jour d’affilée avec au moins une tâche terminée")+'⟧ · ⟦meilleure série :⟧ '+st[1]+(bj>=0?'<br><span class="mut">⟦Meilleur jour de la semaine :⟧ '+new Date(2024,0,1+bj).toLocaleDateString(LOC,{weekday:"long"})+' ('+Math.round(br*100)+' % ⟦terminées, toutes périodes⟧)</span>':"")+'</div>';
  h+=habHTML();
  var w=Object.keys(why).sort(function(a,b){return why[b]-why[a]}).slice(0,8);
  if(w.length)h+='<div class="card"><b>⟦Raisons d’interruption⟧</b> <span class="mut">⟦(touche une raison pour voir les tâches)⟧</span>'+w.map(function(k){return'<button class="why" data-act="why" data-w="'+esc(k)+'">'+(sdet==k?"▾ ":"▸ ")+esc(k)+" ("+why[k]+")</button>"+(sdet==k?evl.filter(function(e){return e.w==k}).map(function(e){return'<div class="mut" style="margin-left:14px">'+dm(e.t.date)+" · "+esc(e.t.title)+(e.a?" · "+e.a:"")+'</div>'}).join(""):"")}).join("")+'</div>';
  return h}
function setHTML(){document.getElementById("lbl").textContent=tr("Réglages");
  return'<div class="card"><b>⟦Style⟧</b><div class="stg">'+styleBtns()+'</div></div><div class="card"><b>⟦Mode⟧</b><br><select id="th">'+[["","Auto"],["light","Clair"],["dark","Sombre"]].map(function(x){return'<option value="'+x[0]+'"'+((S.theme||"")==x[0]?" selected":"")+'>⟦'+x[1]+'⟧</option>'}).join("")+'</select><br><br><b>⟦Durée par défaut⟧</b><br><select id="dd">'+opts(DUR,S.dd||60,dl)+'</select></div>'+langCard()+'<div class="card"><b>⟦Données⟧</b><div class="tools"><button data-act="bk">⟦Sauvegarder⟧</button><button data-act="rs">⟦Restaurer⟧</button><button data-act="ics">⟦Export Calendrier (.ics)⟧</button><button data-act="dedupe">⟦Nettoyer les doublons⟧</button></div><span class="mut">⟦La sauvegarde contient toutes tes tâches. Le .ics s’importe dans l’app Calendrier, avec une alerte 5 min avant chaque tâche.⟧</span></div><input type="file" id="fi" accept=".json,application/json" hidden>'}
function formHTML(e,all){
  var last=all[all.length-1],dys=e.tp?((S.tpls.filter(function(x){return x.id==e.tp})[0]||{}).days||[0,1,2,3,4,5,6]):[];
  return'<div class="shd" data-act="cancel"></div><form id="f" class="sheet"><b class="full">'+"⟦"+(editId?"Modifier la tâche":"Nouvelle tâche")+"⟧"+'</b><input class="full" id="title" placeholder="⟦Titre… (ex. : Étude 14h 2h)⟧" required value="'+esc(e.title||"")+'"><input type="time" id="start" required value="'+(e.start||(last?hhmm(mins(last.start)+last.dur):"09:00"))+'"><select id="dur"'+(e.dur===0?" disabled":"")+'>'+opts(durOpts(e.dur||S.dd||60),e.dur||S.dd||60,dl)+'</select><label class="chk full"><input type="checkbox" id="pt"'+(e.dur===0?" checked":"")+'> ⟦Heure précise (sans durée)⟧</label><select id="pri">'+opts([1,2,3],e.pri||2,function(v){return"⟦"+["","Priorité haute","Priorité moyenne","Priorité basse"][v]+"⟧"})+'</select><select id="cat">'+opts([""].concat(CATS),e.cat||fc,function(v){return"⟦"+(v||"Sans catégorie")+"⟧"})+'</select><input type="date" id="date" class="full" required value="'+(e.date||cur)+'"><div class="full"><span class="mut">⟦Répéter les :⟧</span> <span class="wd">'+WD.map(function(x,i){return'<label><input type="checkbox" id="rd'+i+'"'+(dys.indexOf(i)>-1?" checked":"")+'>'+x+'</label>'}).join("")+'</span></div><textarea class="full" id="note" rows="2" placeholder="⟦Notes… (une ligne « - texte » crée une sous-tâche à cocher)⟧">'+esc(e.note||"")+'</textarea><button class="full" type="submit">'+"⟦"+(editId?"Enregistrer":"Ajouter")+"⟧"+'</button><button class="full ghost" type="button" data-act="cancel">⟦Annuler⟧</button></form>'}
function remHTML(all,td,nowM){if(cur!=td)return"";var n=all.filter(function(t){return!t.st&&mins(t.start)+(t.dur||5)>nowM}).length;return n?'<div class="hb">⏳ ⟦'+(n==1?"Il reste {0} tâche à partir de maintenant":"Il reste {0} tâches à partir de maintenant")+"|"+n+'⟧ <button class="wnb" data-act="wnow">⟦Que faire maintenant ?⟧</button></div>':""}
function wpick(all,nowM,skip){var best=null,bs=-1;all.forEach(function(t){if(t.st||skip.indexOf(t.id)>-1)return;var s=mins(t.start),e=s+(t.dur||5),sc=4-t.pri,r=[];if(t.pri==1)r.push("priorité haute");
    if(nowM>=s&&nowM<e){sc+=4;r.push("en cours")}else if(nowM>=e){sc+=3;r.push("Heure passée")}else if(s-nowM<=60){sc+=2;r.push("bientôt")}else sc+=Math.max(0,1-(s-nowM)/600);
    var g=t.gl&&goalOf(t.gl);if(g&&dleft(g)<=7){sc+=2;r.push("échéance d’objectif proche")}
    if(sc>bs){bs=sc;best={t:t,r:r}}});return best}
function wnowHTML(all,nowM){if(!wnow||cur!=iso(new Date()))return"";var t=all.filter(function(x){return x.id==wnow.id&&!x.st})[0];if(!t)return"";
  var r=wpick([t],nowM,[]).r;return'<div class="card sug"><b>👉 '+esc(t.title)+'</b> <span class="mut">'+fmt(mins(t.start))+'</span><div class="mut">'+(r.length?r.map(function(k){return"⟦"+k+"⟧"}).join(" · "):"")+'</div><div class="tools" style="margin:8px 0 0"><button data-act="done" data-id="'+t.id+'">✓ ⟦Terminée⟧</button><button data-act="shift" data-k="60" data-id="'+t.id+'">⟦Décaler +1 h⟧</button><button data-act="wnx">⟦Autre suggestion⟧</button></div></div>'}
function headHTML(all,td,nowM){
  var dn=all.filter(function(t){return t.st=="done"}).length,n=all.length,C=2*Math.PI*24,txt;
  var ring='<svg class="ring" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="30" cy="30" r="24" fill="none" stroke="var(--lo)" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+((n?dn/n:0)*C).toFixed(1)+" "+C.toFixed(1)+'" transform="rotate(-90 30 30)"/><text x="30" y="35" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor">'+dn+"/"+n+'</text></svg>';
  if(!n)txt="⟦Aucune tâche prévue.⟧";
  else if(cur==td){var pend=all.filter(function(t){return!t.st}),nt=pend.filter(function(t){var s=mins(t.start);return nowM>=s&&nowM<s+(t.dur||5)})[0],nx=pend.filter(function(t){return mins(t.start)>nowM})[0];
    txt=nt?"<b>⟦Maintenant :⟧</b> "+esc(nt.title)+(nt.dur?" · ⟦jusqu’à⟧ "+fmt(mins(nt.start)+nt.dur):""):nx?"<b>⟦Prochaine :⟧</b> "+esc(nx.title)+" ⟦à⟧ "+fmt(mins(nx.start)):!pend.length?"⟦Tout est réglé pour aujourd’hui.⟧":"⟦Il reste des tâches en retard.⟧"}
  else txt="⟦"+(n>1?"{0} tâches prévues":"{0} tâche prévue")+"|"+n+"⟧";
  if(S.rest&&S.rest[cur])txt="⟦Jour de repos : ces tâches ne comptent pas dans la discipline.⟧";return'<div class="hd">'+ring+'<div><div class="hs">'+"⟦"+(dn>1?"{0} sur {1} terminées":"{0} sur {1} terminée")+"|"+dn+"|"+n+"⟧"+'</div><div class="hb">'+txt+'</div>'+remHTML(all,td,nowM)+loadHTML(all)+'</div></div>'}
function cardHTML(t,all,td,nowM){
  var s=mins(t.start),now=cur==td&&!t.st&&nowM>=s&&nowM<s+(t.dur||5),late=cur==td&&!t.st&&nowM>=s+(t.dur||5),ov=over(t,all).length,
  chk=sel?'<input type="checkbox" data-act="pick" data-id="'+t.id+'"'+(sel[t.id]?" checked":"")+'>':'<input type="checkbox" data-act="done" data-id="'+t.id+'"'+(t.st=="done"?" checked":"")+'>';
  return'<div class="task p'+t.pri+" "+(t.st||"")+(now?" now":"")+'" data-id="'+t.id+'"><div class="row">'+chk+'<div class="tc"><b>'+fmt(s)+'</b>'+(t.dur?"<small>"+fmt(s+t.dur)+"</small>":"")+'</div><div class="body"><div class="t">'+esc(t.title)+'</div><div class="chips">'+(t.cat?"<span>"+dot(t.cat)+"⟦"+esc(t.cat)+"⟧"+"</span>":"")+(now?'<span class="nw">⟦en cours⟧</span>':"")+(late?'<span class="wr">⏰ ⟦Heure passée⟧</span>':"")+(ov?'<span class="wr">⟦⚠ chevauche⟧</span>':"")+(t.tp?"<span>⟦↻ répétée⟧</span>":"")+'</div>'+noteHTML(t)+(t.st?'<div class="st">'+ST[t.st]+" ⟦à⟧ "+t.at+(t.st=="done"&&t.at&&Math.abs(mins(String(t.at).replace("h",":"))-s)>30?" · ⟦prévu à⟧ "+fmt(s):"")+(t.as?" · ⟦réel {0}–{1}|"+fmt(mins(t.as))+"|"+fmt(mins(t.ae))+"⟧":"")+(t.why?" · "+esc(t.why):"")+'</div>':"")+(t.hist||[]).map(function(h){return'<div class="mut">↳ '+ST[h.s].toLowerCase()+" ⟦à⟧ "+h.a+(h.w?" · "+esc(h.w):"")+", ⟦reprise à⟧ "+h.b+'</div>'}).join("")+'</div><button class="mo" data-act="open" data-id="'+t.id+'" aria-label="⟦Options⟧">⋯</button></div>'+(opened==t.id?'<div class="acts"><button data-act="done" data-id="'+t.id+'">⟦'+(t.st=="done"?"Rouvrir":"Terminée")+'⟧</button>'+(t.st=="int"||t.st=="stop"?'<button data-act="resume" data-id="'+t.id+'">⟦Reprendre⟧</button>':'<button data-act="int" data-id="'+t.id+'">⟦Interrompue⟧</button><button data-act="stop" data-id="'+t.id+'">⟦Arrêtée⟧</button>')+'<button data-act="edit" data-id="'+t.id+'">⟦Modifier⟧</button>'+(t.st=="done"?"":'<button data-act="snz" data-id="'+t.id+'">⟦Reporter à demain⟧</button>')+(t.st=="done"?"":'<button data-act="shift" data-k="30" data-id="'+t.id+'">⟦Décaler +30 min⟧</button><button data-act="shift" data-k="60" data-id="'+t.id+'">⟦Décaler +1 h⟧</button><button data-act="shift" data-k="eve" data-id="'+t.id+'">⟦Ce soir⟧</button><button data-act="dat" data-id="'+t.id+'">⟦Fait à une autre heure⟧</button>')+'<button data-act="del" data-id="'+t.id+'">⟦Supprimer⟧</button></div>':"")+'</div>'}
function dayHTML(td){
  var all=day(cur),e=(editId&&find(editId))||{},nowM=new Date().getHours()*60+new Date().getMinutes(),
  l=all.filter(function(t){return(!fc||t.cat==fc)&&(!q||(t.title+" "+(t.note||"")).toLowerCase().indexOf(q.toLowerCase())>-1)}),ns=sel?Object.keys(sel).filter(function(k){return sel[k]}).length:0;
  var h=headHTML(all,td,nowM)+wnowHTML(all,nowM)+topCards(td);
  if(sel)h+='<div class="card"><b>'+ns+'</b> ⟦'+(ns>1?"sélectionnées":"sélectionnée")+'⟧<div class="tools" style="margin:8px 0 0"><button data-act="selok">⟦Copier⟧</button><button data-act="selall">⟦Tout⟧</button><button data-act="selno">⟦Annuler⟧</button></div></div>';
  var gdn={};
  if(!l.length)h+='<div class="mut" style="text-align:center;padding:20px 0">⟦Aucune tâche à afficher.⟧</div>';
  else if(tl)h+=tlHTML(l);
  else{
    var isT=cur==td&&!fc&&!q,items=[],dnT=[],last="",nowDone=false;
    l.forEach(function(t){if(t.gl&&!sel&&goalOf(t.gl)){if(!gdn[t.gl]){gdn[t.gl]=1;items.push({g:t.gl,s:mins(t.start)})}}else if(t.st=="done"&&!sel)dnT.push(t);else items.push({t:t,s:mins(t.start)})});
    var grp=items.length>=5,pend=l.filter(function(t){return!t.st&&mins(t.start)+(t.dur||5)>nowM}).length,
    nowLine='<div class="nowl"><span>⟦Maintenant⟧ · '+fmt(nowM)+' · ⟦'+(pend==1?"{0} restante":"{0} restantes")+"|"+pend+"⟧</span></div>";
    items.forEach(function(it){var g=it.s<300?"Nuit":it.s<720?"Matin":it.s<1080?"Après-midi":"Soir";
      if(isT&&!nowDone&&it.s>nowM){h+=nowLine;nowDone=true}
      if(grp&&g!=last){h+='<div class="grp">⟦'+g+'⟧</div>';last=g}
      h+=it.g?ggHTML(it.g,l,all,td,nowM):cardHTML(it.t,all,td,nowM)});
    if(isT&&!nowDone&&items.length)h+=nowLine;
    if(dnT.length)h+='<button class="optb" data-act="dnt">✓ ⟦Terminées⟧ ('+dnT.length+') '+(dnOpen?"▴":"▾")+'</button>'+(dnOpen?dnT.map(function(t){return cardHTML(t,all,td,nowM)}).join(""):"")}
  if(cur==td&&!sel&&!fc&&!q)(S.goals||[]).forEach(function(g){if(!(gdn&&gdn[g.id])&&g.date>=td&&!g.pz&&S.tpls.some(function(t){return t.gl==g.id&&t.wk}))h+=ggHTML(g.id,l,all,td,nowM)});
  if(S.clip&&S.clip.length)h+='<div class="tools"><button data-act="paste">⟦Coller ({0})|'+S.clip.length+'⟧</button><button data-act="clip0" aria-label="⟦Annuler la copie⟧">✕</button></div>';
  h+='<div class="row2">'+jrHTML(0)+'<button class="optb" data-act="opt">⟦Options⟧ '+(opt?"▴":"▾")+'</button></div>'+jrHTML(1);
  if(opt)h+='<div class="card flt"><div class="sec">⟦Affichage⟧</div><div class="tools" style="margin-top:0"><input id="q" placeholder="⟦Rechercher…⟧" value="'+esc(q)+'"><select id="fc">'+opts([""].concat(CATS),fc,function(v){return"⟦"+(v||"Toutes catégories")+"⟧"})+'</select><button data-act="tl" class="'+(tl?"on":"")+'">⟦Blocs horaires⟧</button></div><div class="sec">⟦Copier et modèles⟧</div><div class="tools" style="margin-top:0"><button data-act="selmode">⟦Copier des tâches⟧</button></div>'+mdHTML()+'<div class="sec">⟦Outils⟧</div><div class="tools" style="margin-top:0"><button data-act="exp">⟦Exporter⟧</button><button data-act="rem" class="'+(S.rem?"on":"")+'">⟦Rappels⟧ ⟦'+(S.rem?"activés":"désactivés")+'⟧</button><button data-act="rest" class="'+(S.rest&&S.rest[cur]?"on":"")+'">⟦Jour de repos⟧</button><button data-act="pm">⟦'+(pm?"Arrêter le minuteur":"Minuteur 25/5")+'⟧</button><span id="pmv" class="mut"></span></div></div>';
  h+='<button class="fab" data-act="add">⟦+ Ajouter⟧</button>';
  if(sh||editId)h+=formHTML(e,all);
  return h}
function wdays(){var d=parse(cur),mo=new Date(d),a=[];mo.setDate(d.getDate()-((d.getDay()+6)%7));for(var i=0;i<7;i++){var x=new Date(mo);x.setDate(mo.getDate()+i);a.push(iso(x))}return a}
function wop(ds,td){return wopen[ds]!==undefined?wopen[ds]:ds==td}
function render(){GSC={};GDM=null;
  var td=iso(new Date()),el=document.getElementById("v"),L=document.getElementById("lbl"),d=parse(cur),h="";
  document.querySelectorAll(".tabs button").forEach(function(b){b.className=b.dataset.v==view?"on":"";if(b.dataset.v!="s"&&b.dataset.v!="g")b.textContent=tr({d:"Jour",w:"Semaine",m:"Mois",b:"Bilan"}[b.dataset.v])});
  document.querySelector(".gear").className="gear"+(view=="s"?" on":"");document.querySelector(".gear").setAttribute("aria-label",tr("Réglages"));
  document.querySelector(".nav").className="nav"+(view=="s"||view=="g"?" solo":"");
  document.getElementById("td").textContent=tr({d:"Aujourd’hui",w:"Cette semaine",m:"Ce mois-ci",b:sp=="w"?"Cette semaine":"Ce mois-ci"}[view]||"");
  if(view=="d"){L.textContent=d.toLocaleDateString(LOC,{weekday:"long",day:"numeric",month:"long"});h=dayHTML(td)}
  else if(view=="w"){
    var wd0=wdays();L.textContent=tr("Semaine du")+" "+parse(wd0[0]).toLocaleDateString(LOC,{day:"numeric",month:"short"});
    var ao=wd0.every(function(ds){return wop(ds,td)});
    h+='<div class="tools" style="margin-top:0"><button data-act="wall">⟦'+(ao?"Tout replier":"Tout déplier")+'⟧</button></div>';
    wd0.forEach(function(ds){var x=parse(ds),l=day(ds),dn=l.filter(function(t){return t.st=="done"}).length,op=wop(ds,td),
      hd=(l.length?'<button class="wh" data-act="wtog" data-d="'+ds+'">':'<button class="wh" data-go="'+ds+'">')+'<span><b>'+x.toLocaleDateString(LOC,{weekday:"long"})+"</b> "+x.getDate()+(ds==td?" <em>⟦Aujourd’hui⟧</em>":"")+(GD(ds)?" 🎯":"")+'</span><span class="wc">'+(l.length?dn+"/"+l.length+" "+(op?"▴":"▾"):"+")+'</span></button>';
      h+='<div class="wk'+(ds==td?" today":"")+'">'+hd+(l.length?'<div class="bar"><i style="width:'+dn/l.length*100+'%"></i></div>'+(op?l.map(function(t){return'<div class="wi p'+t.pri+(t.st=="done"?" done":"")+'" data-go="'+ds+'"><span class="time">'+fmt(mins(t.start))+"</span><span>"+dot(t.cat)+esc(t.title)+"</span>"+(t.st=="done"?'<span class="ck">✓</span>':t.st?'<span class="ck">'+(t.st=="int"?"⏸":"■")+"</span>":"")+"</div>"}).join("")+'<button class="wgo" data-go="'+ds+'">⟦Ouvrir le jour⟧ →</button>':'<div class="wsum">'+l.slice(0,3).map(function(t){return'<span class="ws">'+dot(t.cat)+esc(t.title)+"</span>"}).join("")+(l.length>3?"<span>+"+(l.length-3)+"</span>":"")+"</div>"):'<div class="mut">⟦Rien de prévu⟧</div>')+"</div>"})}
  else if(view=="g")h=goalsHTML();
  else if(view=="b")h=statsHTML();
  else if(view=="s")h=setHTML();
  else{
    var y=d.getFullYear(),m=d.getMonth(),off=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
    L.textContent=d.toLocaleDateString(LOC,{month:"long",year:"numeric"});
    h='<div class="mg">'+["L","M","M","J","V","S","D"].map(function(x){return'<div class="mh">'+x+'</div>'}).join("");
    for(var j=0;j<off;j++)h+="<div></div>";
    for(var k=1;k<=n;k++){var dk=y+"-"+p2(m+1)+"-"+p2(k),lk=day(dk);
      h+='<button class="mc'+(dk==td?" today":"")+(dk==cur?" sel":"")+'" data-go="'+dk+'"><b>'+k+'</b>'+(GD(dk)?'<span class="gf">🎯</span>':GM(dk)?'<span class="gf">🏁</span>':"")+'<div class="dots">'+(lk.some(function(t){return t.pri==1&&!t.st})?'<i class="d p1"></i>':"")+'</div>'+(lk.length?"<small>"+lk.length+"</small>":"")+'</button>'}
    h+='</div><div class="lg"><i class="d p1" style="display:inline-block"></i> ⟦priorité haute⟧ · 🎯 ⟦échéance d’un objectif⟧ · ⟦Touche un jour pour l’ouvrir.⟧</div>'}
  el.innerHTML=mk(h)}
function step(n){var d=parse(cur);if(view=="m"||(view=="b"&&sp=="m")){d.setDate(1);d.setMonth(d.getMonth()+n)}else d.setDate(d.getDate()+(view=="w"||view=="b"?7*n:n));cur=iso(d);editId=null;sh=0;sel=null;render()}
function resume(t){if(t.st=="int"||t.st=="stop"){(t.hist=t.hist||[]).push({s:t.st,a:t.at,w:t.why||"",b:nowHM()});t.st="";t.at="";t.why=""}}
function setSt(t,s,why){if(t.st==s){t.st="";t.at="";t.why=""}else{t.st=s;t.at=nowHM();t.why=why||""}}
document.getElementById("pv").onclick=function(){step(-1)};
document.getElementById("nx").onclick=function(){step(1)};
document.getElementById("td").onclick=function(){cur=iso(new Date());editId=null;sh=0;sel=null;render()};
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-act],[data-v],[data-go]");if(!b)return;
  var a=b.dataset.act,id=b.dataset.id,t=id?find(id):null;
  if(b.dataset.v){view=b.dataset.v;editId=null;sh=0;sel=null;if(view=="g")gid=null;gf=null}
  else if(b.dataset.go){cur=b.dataset.go;view="d";editId=null;sh=0;sel=null}
  else if(a=="open")opened=opened==id?null:id;
  else if(a=="done"&&t){if(!wake(t)){resume(t);setSt(t,"done")}opened=null;if(t.st=="done"&&t.gl){var gq=goalOf(t.gl);if(gq&&gq.target>0&&t.q){var qv=parseFloat(prompt(tr(gq.mode=="value"?"Valeur mesurée ({0}) ?":"Quantité réalisée ({0}) ?").replace("{0}",gq.unit||"")));if(qv>0)gq.log.push({d:iso(new Date()),n:qv})}}afterDone(t);save()}
  else if((a=="int"||a=="stop")&&t){var w=prompt(tr("Raison (facultatif)"));if(w===null)return;t.st="";setSt(t,a,w.trim());opened=null;save()}
  else if(a=="resume"&&t){resume(t);opened=null;save();toast("⟦Tâche reprise⟧")}
  else if(a=="clip0"){S.clip=[];save()}
  else if(a=="snz"&&t){t.date=nd(t.date);delete t.tp;t.st="";t.at="";t.why="";opened=null;save();toast("⟦Tâche reportée à demain⟧")}
  else if(a=="od"&&t){var k=b.dataset.k;if(k=="mv")t.date=iso(new Date());else{t.st=k=="dn"?"done":"stop";t.at=nowHM();t.why=""}save()}
  else if(a=="bkz"){S.bkz=addd(iso(new Date()),3);save()}
  else if(a=="odt")odo=odo?0:1;
  else if(a=="gct")gco=gco?0:1;
  else if(a=="dnt")dnOpen=dnOpen?0:1;
  else if(a=="wnow"){var wp=wpick(day(cur),new Date().getHours()*60+new Date().getMinutes(),[]);if(wp)wnow={id:wp.t.id,skip:[wp.t.id]};else{wnow=null;toast("⟦Rien à faire maintenant⟧")}}
  else if(a=="wnx"){var wp2=wnow&&wpick(day(cur),new Date().getHours()*60+new Date().getMinutes(),wnow.skip);if(wp2){wnow.skip.push(wp2.t.id);wnow.id=wp2.t.id}else wnow=null}
  else if(a=="gmadd"){readGF();gf.ms.push({id:uid(),title:"",date:"",done:""})}
  else if(a=="gmdel"){readGF();gf.ms.splice(+b.dataset.i,1)}
  else if(a=="gmd"){var gm=goalOf(gid),mi=gm&&gm.ms[+b.dataset.i];if(mi){mi.done=mi.done?"":iso(new Date());if(mi.done)cheer("ms|"+mi.id,"⟦🏁 Jalon atteint : {0}|"+mi.title+"⟧");save()}}
  else if(a=="wmsave"){var wd0=wdays(),ts0=S.tasks.filter(function(x){return wd0.indexOf(x.date)>-1&&!x.tp&&!x.gl});if(!ts0.length){toast("⟦Aucune tâche à enregistrer⟧");return}var nm3=prompt(tr("Nom du modèle"));if(!nm3||!nm3.trim())return;(S.wm=S.wm||[]).push({name:nm3.trim(),tasks:ts0.map(function(x){return{wd:wd0.indexOf(x.date),title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:(x.note||"").replace(/^x /gm,"- ")}})});save();toast("⟦Modèle enregistré⟧")}
  else if(a=="wmapply"){var wm=S.wm[+b.dataset.i],base=addd(wk0(cur),7*+b.dataset.k),n3=0;wm.tasks.forEach(function(x){var d3=addd(base,x.wd);if(!S.tasks.some(function(y){return y.date==d3&&y.title==x.title&&y.start==x.start})){S.tasks.push({id:uid(),title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:x.note,date:d3,st:""});n3++}});save();toast("⟦"+(n3>1?"{0} tâches ajoutées":"{0} tâche ajoutée")+"|"+n3+"⟧")}
  else if(a=="wmdel"){if(confirm(tr("Supprimer ce modèle?"))){S.wm.splice(+b.dataset.i,1);save()}else return}
  else if(a=="dedupe"){var rm=dedupe();toast("⟦"+(rm>1?"{0} doublons supprimés":rm==1?"{0} doublon supprimé":"Aucun doublon trouvé")+"|"+rm+"⟧")}
  else if(a=="jro")jro=jro?0:1;
  else if(a=="jm"||a=="je"){S.jr=S.jr||{};var jj=S.jr[cur]=S.jr[cur]||{},kk2=+b.dataset.k,fl2=a=="jm"?"m":"e";jj[fl2]=jj[fl2]==kk2?0:kk2;save()}
  else if(a=="gwk")gwo+=+b.dataset.k;
  else if(a=="shift"&&t){var k2=b.dataset.k;t.start=k2=="eve"?hhmm(Math.max(mins(t.start),1200)):hhmm(Math.min(1439,mins(t.start)+ +k2));opened=null;save();toast("⟦Heure modifiée : {0}|"+fmt(mins(t.start))+"⟧")}
  else if(a=="dat"&&t){var def=t.dur?hhmm(mins(t.start))+"-"+hhmm((mins(t.start)+t.dur)%1440):hhmm(new Date().getHours()*60+new Date().getMinutes()),hv=prompt(tr("Heures réelles (début-fin, ex. 01:00-11:37)"),def),ms=hv?hv.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/g):null;if(!ms)return;var pt=ms.map(function(x){var m2=/(\d{1,2})\s*[h:]\s*(\d{2})?/.exec(x);return Math.min(23,+m2[1])*60+(+m2[2]||0)});resume(t);t.st="done";t.why="";if(pt.length>1){t.as=hhmm(pt[0]);t.ae=hhmm(pt[1]);t.at=fmt(pt[1])}else{delete t.as;delete t.ae;t.at=fmt(pt[0])}opened=null;afterDone(t);save()}
  else if(a=="rest"){S.rest=S.rest||{};if(S.rest[cur])delete S.rest[cur];else S.rest[cur]=1;save()}
  else if(a=="gflex"){var tp=S.tpls.filter(function(x){return x.id==id})[0];if(tp){var nm2=new Date().getHours()*60+new Date().getMinutes();S.tasks.push({id:uid(),title:tp.title,start:hhmm(Math.floor(nm2/5)*5),dur:tp.dur,pri:tp.pri||2,date:iso(new Date()),st:"done",at:nowHM(),why:"",tp:tp.id,gl:tp.gl});var gq2=goalOf(tp.gl);if(gq2&&gq2.target>0&&tp.q){var qv2=parseFloat(prompt(tr(gq2.mode=="value"?"Valeur mesurée ({0}) ?":"Quantité réalisée ({0}) ?").replace("{0}",gq2.unit||"")));if(qv2>0)gq2.log.push({d:iso(new Date()),n:qv2})}save()}}
  else if(a=="gpz"){var gp2=goalOf(id),td3=iso(new Date());if(gp2.pz){(gp2.pauses=gp2.pauses||[]).push({a:gp2.pz,b:addd(td3,-1)});delete gp2.pz;Object.keys(S.gen).forEach(function(d){if(d>=td3)delete S.gen[d]})}else{gp2.pz=td3;S.tasks=S.tasks.filter(function(x){return!(x.gl==gp2.id&&x.date>=td3&&!x.st)})}save()}
  else if(a=="gcoach"){var pr2=gcoachp(goalOf(id));(navigator.clipboard?navigator.clipboard.writeText(pr2):Promise.reject()).then(function(){toast("⟦Résumé copié : colle-le dans Claude pour avoir des conseils.⟧")},function(){prompt(tr("Copie ce texte :"),pr2)});return}
  else if(a=="grestart"){var g3=goalOf(id);gf={id:null,type:g3.type||"free",title:g3.title,date:addd(iso(new Date()),Math.max(7,dbt(g3.start,g3.date))),target:g3.target||"",unit:g3.unit||"",parent:g3.parent||"",auto:true,mode:g3.mode||"sum",vs:g3.vs||"",ms:[],acts:g3.acts.map(function(q){return{on:1,title:q.title,start:q.start,dur:q.dur,wk:q.wk||0,q:q.q||0,days:(q.days||[]).slice()}})};goalSubmit();toast("⟦Objectif relancé⟧")}
  else if(a=="gprolong"){var g4=goalOf(id),od4=g4.date;g4.date=addd(od4,30);S.tpls.forEach(function(t3){if(t3.gl==g4.id&&t3.until==od4)t3.until=g4.date});Object.keys(S.gen).forEach(function(d){if(d>=iso(new Date()))delete S.gen[d]});save();toast("⟦Objectif prolongé⟧")}
  else if(a=="gtog")gopn[id]=!gopn[id];
  else if(a=="gnew"){gf={id:null,type:"lang",title:"",date:addd(iso(new Date()),90),target:"",unit:"",parent:"",auto:true,mode:"sum",vs:"",ms:[],acts:cact("lang")}}
  else if(a=="gopen"){view="g";gid=id}
  else if(a=="gback")gid=null;
  else if(a=="gedit"){var g0=S.goals.filter(function(x){return x.id==id})[0];gf={id:g0.id,type:g0.type||"free",title:g0.title,date:g0.date,target:g0.target||"",unit:g0.unit||"",parent:g0.parent||"",auto:false,mode:g0.mode||"sum",vs:g0.vs||"",ms:(g0.ms||[]).map(function(m){return{id:m.id,title:m.title,date:m.date,done:m.done||""}}),acts:g0.acts.map(function(q){return{on:1,title:q.title,start:q.start,dur:q.dur,wk:q.wk||0,q:q.q||0,days:(q.days||[]).slice()}})}}
  else if(a=="gcancel")gf=null;
  else if(a=="gsug"){readGF();var kk=detect(gf.title)||gf.type;gf.type=kk;gf.acts=cact(kk);toast("⟦Type détecté : {0}|"+tr(GT[kk][0])+"⟧")}
  else if(a=="gaadd"){readGF();gf.acts.push({on:1,title:"",start:"18:00",dur:30,wk:0,q:0,days:[0,1,2,3,4,5,6]})}
  else if(a=="gadel"){readGF();gf.acts.splice(+b.dataset.i,1)}
  else if(a=="glog"){var n0=parseFloat((document.getElementById("glg")||{}).value),g1=S.goals.filter(function(x){return x.id==gid})[0];if(!(n0>0)||!g1)return;g1.log.push({d:iso(new Date()),n:n0});save()}
  else if(a=="gundo"){var g2=S.goals.filter(function(x){return x.id==gid})[0];if(g2&&g2.log.length){g2.log.pop();save()}}
  else if(a=="gdel"){if(!confirm(tr("Supprimer cet objectif?")))return;var yd2=addd(iso(new Date()),-1),gx=gf.id,td2=iso(new Date());S.goals=S.goals.filter(function(x){return x.id!=gx});S.goals.forEach(function(x){if(x.parent==gx)delete x.parent});S.tpls.forEach(function(t2){t2.gls=(t2.gls||[]).filter(function(x){return x!=gx});if(t2.gl==gx){if(t2.gls.length){t2.gl=t2.gls.shift();S.tasks.forEach(function(x){if(x.tp==t2.id)x.gl=t2.gl})}else if(!t2.until||t2.until>yd2)t2.until=yd2}if(!t2.gls.length)delete t2.gls});S.tasks=S.tasks.filter(function(x){return!(x.gl==gx&&x.date>=td2&&!x.st)});gf=null;gid=null;save()}
  else if(a=="mdsave"){var c0=day(cur).filter(function(x){return!x.tp});if(!c0.length){toast("⟦Aucune tâche à enregistrer⟧");return}var nm=prompt(tr("Nom du modèle"));if(!nm||!nm.trim())return;(S.models=S.models||[]).push({name:nm.trim(),tasks:c0.map(function(x){return{title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:(x.note||"").replace(/^x /gm,"- ")}})});save();toast("⟦Modèle enregistré⟧")}
  else if(a=="mdapply"){var md=S.models[+b.dataset.i];md.tasks.forEach(function(x){S.tasks.push({id:uid(),title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:x.note,date:cur,st:""})});save();toast("⟦"+(md.tasks.length>1?"{0} tâches ajoutées":"{0} tâche ajoutée")+"|"+md.tasks.length+"⟧")}
  else if(a=="mddel"){if(confirm(tr("Supprimer ce modèle?"))){S.models.splice(+b.dataset.i,1);save()}else return}
  else if(a=="wtog"){var dd=b.dataset.d;wopen[dd]=!wop(dd,iso(new Date()))}
  else if(a=="wall"){var tdd=iso(new Date()),w7=wdays(),ao2=w7.every(function(ds){return wop(ds,tdd)});w7.forEach(function(ds){wopen[ds]=!ao2})}
  else if(a=="sp"){sp=id;sdet=null}
  else if(a=="why"){sdet=sdet==b.dataset.w?null:b.dataset.w}
  else if(a=="edit"){editId=id;opened=null}
  else if(a=="cancel"){editId=null;sh=0}
  else if(a=="del"&&t){var u=t;S.tasks=S.tasks.filter(function(x){return x.id!=id});opened=null;save();toast("⟦Tâche supprimée · Annuler⟧",function(){S.tasks.push(u);save();render()})}
  else if(a=="add"){sh=1;editId=null}
  else if(a=="opt")opt=opt?0:1;
  else if(a=="selmode"){sel={};opt=0}
  else if(a=="selno")sel=null;
  else if(a=="selall"){day(cur).forEach(function(x){sel[x.id]=1})}
  else if(a=="pick"){sel[id]=!sel[id]}
  else if(a=="selok"){var ch=day(cur).filter(function(x){return sel[x.id]});if(!ch.length){toast("⟦Sélectionne au moins une tâche⟧");return}S.clip=ch.map(function(x){return{title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:(x.note||"").replace(/^x /gm,"- ")}});sel=null;save();toast("⟦"+(ch.length>1?"{0} tâches copiées · ouvre un autre jour et touche Coller":"{0} tâche copiée · ouvre un autre jour et touche Coller")+"|"+ch.length+"⟧")}
  else if(a=="paste"){var cl=S.clip||[];cl.forEach(function(x){S.tasks.push({id:uid(),title:x.title,start:x.start,dur:x.dur,pri:x.pri,cat:x.cat,note:x.note,date:cur,st:""})});S.clip=[];save();toast("⟦"+(cl.length>1?"{0} tâches collées":"{0} tâche collée")+"|"+cl.length+"⟧")}
  else if(a=="exp"){var txt="⟦Planning du⟧ "+cur+"\n"+day(cur).map(function(x){return (x.dur?fmt(mins(x.start))+"–"+fmt(mins(x.start)+x.dur):fmt(mins(x.start)))+" "+x.title+(x.st?" ("+ST[x.st].toLowerCase()+" ⟦à⟧ "+x.at+(x.why?", "+x.why:"")+")":"")}).join("\n");txt=mk(txt);
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast("⟦Planning copié⟧")},function(){prompt(tr("Copie ce texte :"),txt)});return}
  else if(a=="rem"){if(!S.rem){if(window.Notification&&Notification.permission=="default")Notification.requestPermission();S.rem=1;toast("⟦Rappels actifs (app ouverte)⟧")}else S.rem=0;save()}
  else if(a=="sub"&&t){var ls=t.note.split("\n"),i=+b.dataset.i;ls[i]=(ls[i][0]=="x"?"- ":"x ")+ls[i].slice(2);t.note=ls.join("\n");save()}
  else if(a=="sty"){S.style=id;save();applyTheme()}
  else if(a=="tl")tl=tl?0:1;
  else if(a=="pm"){if(pm){pm=null;document.title="Ma journée"}else pm={work:1,end:Date.now()+15e5}}
  else if(a=="bk"){S.bk=iso(new Date());save();dlf("ma-journee-sauvegarde-"+iso(new Date())+".json",JSON.stringify(S),"application/json");render();return}
  else if(a=="rs"){document.getElementById("fi").click();return}
  else if(a=="ics"){ics();return}
  else return;
  render()});
document.getElementById("v").addEventListener("submit",function(e){
  e.preventDefault();if(e.target.id=="gf"){goalSubmit();return}
  var g=function(i){return document.getElementById(i)},o={title:g("title").value.trim(),start:g("start").value,dur:g("pt").checked?0:+g("dur").value,pri:+g("pri").value,date:g("date").value,cat:g("cat").value,note:g("note").value},days=WD.map(function(_,i){return g("rd"+i).checked?i:-1}).filter(function(i){return i>=0}),rep=days.length>0;
  if(!editId)qp(o);var ex=editId?find(editId):null,t=ex||{id:uid(),st:""},ov=over(Object.assign({},t,o),day(o.date));
  if(ov.length&&!confirm(mk("⟦Chevauche « {0} ». Ajouter quand même?|"+ov[0].title+"⟧")))return;
  Object.assign(t,o);if(!ex)S.tasks.push(t);
  if(rep){if(!t.tp){t.tp=uid();S.tpls.push({id:t.tp});S.gen[t.date]=1}Object.assign(S.tpls.filter(function(x){return x.id==t.tp})[0],{title:o.title,start:o.start,dur:o.dur,pri:o.pri,cat:o.cat,note:o.note,days:days})}
  else if(t.tp){S.tpls=S.tpls.filter(function(x){return x.id!=t.tp});delete t.tp}
  editId=null;sh=0;cur=o.date;save();render()});
function ping(x){toast(x);try{if(Notification.permission=="granted")navigator.serviceWorker.ready.then(function(r){r.showNotification("Ma journée",{body:mk(x),icon:"icon-192.png"})})}catch(e){}}
function tick(){
  var n=new Date(),td=iso(n);
  if(td!=lastDay&&document.visibilityState=="visible"){lastDay=td;cur=td;render()}
  if(S.rem){var m=n.getHours()*60+n.getMinutes();day(td).forEach(function(t){var s=mins(t.start),k=t.id+td;if(!t.st&&m>=s-5&&m<s&&!notified[k]){notified[k]=1;ping("⟦Dans {0} min : {1}|"+(s-m)+"|"+t.title+"⟧")}})}
  if(view=="d"&&cur==td&&!sh&&!editId&&!sel&&!(document.activeElement&&document.activeElement.closest(".flt")))render()}
setInterval(tick,30000);
document.addEventListener("visibilitychange",function(){if(document.visibilityState=="visible")tick()});
setLang();applyTheme();
document.addEventListener("input",function(e){var i=e.target.id;if(i=="q"||i=="fc"){q=document.getElementById("q").value;fc=document.getElementById("fc").value;var p=e.target.selectionStart;render();var n=document.getElementById(i);n.focus();try{n.setSelectionRange(p,p)}catch(x){}}});
document.addEventListener("change",function(e){var i=e.target.id;if(i=="th"){S.theme=e.target.value;applyTheme();save()}else if(i=="dd"){S.dd=+e.target.value;save()}else if(i=="lg"){S.lang=e.target.value;save();setLang();render()}else if(i=="gtp"){readGF();gf.type=e.target.value;gf.acts=cact(gf.type);render()}else if(/^ga\d+f$/.test(i)){readGF();render()}else if(i=="gnt"){var gg=goalOf(gid);if(gg){gg.note=e.target.value;save()}}else if(i=="jrn"){S.jr=S.jr||{};(S.jr[cur]=S.jr[cur]||{}).n=e.target.value;save()}else if(i=="fi")restore(e.target.files[0]);else if(i=="pt")document.getElementById("dur").disabled=e.target.checked});
var dg=null;
document.addEventListener("pointerdown",function(e){var g=e.target.closest&&e.target.closest(".grip");if(!g)return;var b=g.parentNode,t=find(b.dataset.id);if(!t)return;dg={t:t,y:e.clientY,b:b,top:parseFloat(b.style.top),s:mins(t.start),m:0};try{if(e.pointerId!==undefined)g.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()});
document.addEventListener("pointermove",function(e){if(!dg)return;var dm=Math.round((e.clientY-dg.y)/.8/15)*15;dg.m=Math.max(-dg.s,Math.min(1439-dg.s,dm));dg.b.style.top=(dg.top+dg.m*.8)+"px"});
document.addEventListener("pointerup",function(){if(!dg)return;var d0=dg;dg=null;if(d0.m){d0.t.start=hhmm(d0.s+d0.m);save();toast("⟦Heure modifiée : {0}|"+fmt(d0.s+d0.m)+"⟧");render()}});
setInterval(pmTick,1000);
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",applyTheme)}catch(e){}
render();
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}
