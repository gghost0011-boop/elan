/* Élan — objectifs : modèles, suivi, discipline, bilan */
var GT={lang:["Apprendre une langue",[["Vocabulaire",20,"18:00",[0,1,2,3,4,5,6]],["Écoute (podcast, vidéo)",30,"18:30",[0,1,2,3,4,5,6]],["Pratique orale",30,"19:00",[0,2,4]],["Écrire un court texte",30,"19:00",[1,5]],["Révision de la semaine",45,"17:00",[6]]]],
sport:["Sport / prise de masse",[["Séance d’entraînement",60,"18:00",[0,2,4,5]],["Suivre mes repas",10,"20:00",[0,1,2,3,4,5,6]],["Pesée",5,"07:30",[0],1],["Dormir à heure fixe",480,"23:00",[0,1,2,3,4,5,6]]]],
exam:["Préparer un test",[["Réviser la matière",90,"18:00",[0,1,2,3,4],1],["Exercices / annales",60,"18:00",[5]],["Fiches de synthèse",45,"17:00",[6]],["Examen blanc",120,"14:00",[6]]]],
money:["Argent à réunir",[["Mettre de l’argent de côté",0,"09:00",[0,1,2,3,4,5,6],1],["Revoir mon budget",15,"19:00",[6]]]],
proj:["Projet",[["Travailler sur le projet",60,"18:00",[0,1,2,3,4]],["Faire le point d’avancement",20,"17:00",[6]]]],
run:["Course / endurance",[["Sortie de course facile",40,"07:00",[0,2,4],1],["Longue sortie",75,"08:00",[5],1],["Étirements / récupération",15,"20:00",[1,3]],["Suivre mes kilomètres",0,"21:00",[6]]]],
weight:["Perdre du poids",[["Marche ou cardio",45,"18:00",[0,1,2,3,4,5]],["Préparer mes repas",30,"17:00",[6]],["Suivre mes repas",10,"20:00",[0,1,2,3,4,5,6]],["Pesée",5,"07:30",[0],1]]],
job:["Emploi / entrevue",[["Envoyer des candidatures",60,"09:00",[0,1,2,3,4]],["Pratiquer l’entrevue",30,"18:00",[1,3]],["Mettre à jour CV et profil",45,"10:00",[0]],["Relancer mes contacts",20,"16:00",[4]]]],
read:["Lire / apprendre un sujet",[["Lecture",30,"21:00",[0,1,2,3,4,5,6],1],["Prendre des notes",15,"21:30",[0,2,4]],["Résumé de la semaine",30,"17:00",[6]]]],
free:["Personnalisé",[]]};
var KW=[["money",/loyer|argent|payer|épargne|économ|rent\b|save|saving|money|\$|dinero|alquiler|ahorr|budget/i],["weight",/perdre|poids|maigrir|weight loss|lose weight|adelgaz|bajar de peso/i],["run",/course à pied|courir|marathon|running|\b5 ?km|\b10 ?km|semi-marathon|correr|\brun\b/i],["sport",/masse|muscle|musculation|\bgym\b|bulk|fitness|force|ganar/i],["lang",/angl|english|espagnol|spanish|langue|language|fran[cç]ais|german|allemand|arabe|portugu|chinois|mandarin|idioma|inglés|japonais|italien/i],["job",/emploi|entrevue|entretien|candidature|stage\b|\bjob\b|interview|trabajo|\bcv\b|embauche/i],["exam",/\btest\b|examen|\bexam\b|concours|quiz|permis|licence|certification|toefl|ielts|prueba|diplôme/i],["read",/\blire\b|livre|lecture|\bread\b|\bbook|libro|apprendre|\blearn\b/i],["proj",/projet|project|lancer|launch|\bsite\b|\bapp\b|proyecto/i]];
function detect(t){for(var i=0;i<KW.length;i++)if(KW[i][1].test(t||""))return KW[i][0];return null}
function gtitle(id){return(S.goals.filter(function(x){return x.id==id})[0]||{}).title||""}
function gprog(g){var st=gstat(g),own=g.target>0&&gT(g)>0?Math.max(0,Math.min(100,gtot(g)/gT(g)*100)):st.pct,l=S.goals.filter(function(x){return x.parent==g.id}).map(gprog);if(own!==null&&own!==undefined&&(g.target>0||st.pl))l.push(own);return l.length?l.reduce(function(a,b){return a+b},0)/l.length:(own||0)}
function gparOpts(){if(gf.id&&S.goals.some(function(x){return x.parent==gf.id}))return"";return'<select id="gpar" class="full"><option value="">⟦Fait partie de…⟧</option>'+(S.goals||[]).filter(function(x){return!x.parent&&x.id!=gf.id}).map(function(x){return'<option value="'+x.id+'"'+(gf.parent==x.id?" selected":"")+'>'+esc(x.title)+'</option>'}).join("")+'</select>'}
function gkids(g){var h="",p=g.parent&&S.goals.filter(function(x){return x.id==g.parent})[0],ks=S.goals.filter(function(x){return x.parent==g.id});
  if(p)h+='<div class="mut" style="margin:-4px 0 10px">↳ ⟦Fait partie de…⟧ <button class="gl2" data-act="gopen" data-id="'+p.id+'">'+esc(p.title)+'</button></div>';
  if(ks.length)h+='<div class="card"><b>⟦Sous-objectifs⟧</b> <span class="mut">⟦Progression globale : {0} %|'+Math.round(gprog(g))+'⟧</span>'+ks.map(function(k){var n=dleft(k);return'<button class="gcard" style="margin:8px 0 0" data-act="gopen" data-id="'+k.id+'"><div class="gt"><b>'+esc(k.title)+'</b><span class="mut">'+(n<0?"⟦Terminé⟧":"⟦J-{0}|"+n+"⟧")+'</span></div><div class="bar"><i style="width:'+gprog(k)+'%"></i></div></button>'}).join("")+'</div>';
  return h}
function gcurve(g,tot,tw,el){var W=300,H=110,mx=(Math.max(gT(g),tot)||1)*1.05,X=function(d){return 8+d/tw*(W-16)},Y=function(v){return H-8-v/mx*(H-16)},cum=0,pts=[[0,0]];
  (g.log||[]).slice().sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0}).forEach(function(x){cum=g.mode=="value"?x.n-(g.vs||0):cum+x.n;pts.push([Math.max(0,Math.min(tw,dbt(g.start,x.d))),cum])});pts.push([Math.max(pts[pts.length-1][0],Math.min(el,tw)),cum]);
  return'<div class="mut" style="margin-top:10px">⟦Courbe de progression⟧ ⟦(pointillé : rythme attendu)⟧</div><svg class="gcv" viewBox="0 0 '+W+" "+H+'"><line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(tw)+'" y2="'+Y(gT(g))+'" stroke="var(--muted)" stroke-dasharray="4 3" stroke-width="1.5"/><line x1="'+X(el)+'" y1="4" x2="'+X(el)+'" y2="'+(H-8)+'" stroke="var(--accent)" stroke-opacity=".4"/><polyline fill="none" stroke="var(--lo)" stroke-width="2.5" stroke-linejoin="round" points="'+pts.map(function(p){return X(p[0]).toFixed(1)+","+Y(p[1]).toFixed(1)}).join(" ")+'"/></svg>'}
function gweeks(st,td){var wk=[],cols=[];st.days.forEach(function(x,i){if(x.d>=td||!x.p)return;var k=Math.floor(i/7);wk[k]=wk[k]||[0,0];wk[k][0]+=x.p;wk[k][1]+=x.k});
  wk.forEach(function(v,k){if(v)cols.push('<div class="col"><div class="cb" style="height:70px"><i style="height:'+v[1]/v[0]*100+'%"></i></div><small>⟦S{0}|'+(k+1)+'⟧</small></div>')});
  return cols.length?'<div class="mut" style="margin-top:10px">⟦Discipline par semaine⟧</div><div class="chart">'+cols.join("")+'</div>':""}
function cact(k){return GT[k][1].map(function(a){return{on:1,title:tr(a[0]),start:a[2],dur:a[1],wk:0,q:a[4]?1:0,days:a[3].slice()}})}
function dleft(g){return dbt(iso(new Date()),g.date)}
function gtot(g){if(g.mode=="value"){var l=g.log||[];return l.length?l[l.length-1].n-(g.vs||0):0}return(g.log||[]).reduce(function(a,x){return a+x.n},0)}
function gT(g){return g.mode=="value"?g.target-(g.vs||0):g.target}
function gcur(g){return g.mode=="value"?(g.vs||0)+gtot(g):gtot(g)}
function GD(ds){return(S.goals||[]).some(function(g){return g.date==ds})}
function gin(t,g){return t.gl==g.id||(t.gls||[]).indexOf(g.id)>-1}
function dedupe(){var td=iso(new Date()),yd=addd(td,-1),nm=function(x){return(x||"").trim().toLowerCase()},seen={},n=0;
  S.tpls.forEach(function(t){if(!t.gl||t.wk||(t.until&&t.until<td))return;var k=nm(t.title)+"|"+(t.days||[]).join(),p=seen[k];if(!p){seen[k]=t;return}if(p.gl==t.gl)return;p.gls=p.gls||[];[t.gl].concat(t.gls||[]).forEach(function(x){if(x!=p.gl&&p.gls.indexOf(x)<0)p.gls.push(x)});t.until=yd;n++;S.tasks=S.tasks.filter(function(x){return!(x.tp==t.id&&x.date>=td&&!x.st)})});
  var grp={};S.tasks.forEach(function(x){if(!x.tp&&!x.gl)return;var k=x.date+"|"+nm(x.title);(grp[k]=grp[k]||[]).push(x)});
  var drop={};Object.keys(grp).forEach(function(k){var l=grp[k];if(l.length<2)return;l.sort(function(a,b){return(b.st=="done")-(a.st=="done")||(b.st?1:0)-(a.st?1:0)||mins(a.start)-mins(b.start)});l.slice(1).forEach(function(x){drop[x.id]=1;n++})});
  S.tasks=S.tasks.filter(function(x){return!drop[x.id]});Object.keys(S.gen).forEach(function(d){if(d>=td)delete S.gen[d]});save();return n}
function gstat(g){if(GSC[g.id])return GSC[g.id];
  var td=iso(new Date()),end=g.date<td?g.date:addd(td,-1),pl=0,dn=0,run=0,best=0,days=[];
  for(var d=g.start;d<=g.date&&days.length<400;d=addd(d,1)){var p=0,k=0;
    S.tpls.forEach(function(t){if(!gin(t,g)||t.wk||d<t.since||(t.until&&d>t.until)||(t.days||[0,1,2,3,4,5,6]).indexOf(wdi(d))<0)return;p++;if(gdm()[t.id+"|"+d])k++});
    if(S.rest&&S.rest[d]||gpz(g,d)){p=0;k=0}
    days.push({d:d,p:p,k:k});
    if(d<=end&&p){pl+=p;dn+=k;if(k==p){run++;if(run>best)best=run}else run=0}}
  S.tpls.forEach(function(t){if(!gin(t,g)||!t.wk)return;var s0=t.since>g.start?t.since:g.start,w=wk0(s0);if(w<s0)w=addd(w,7);for(;addd(w,6)<=end&&addd(w,6)<=g.date;w=addd(w,7)){if(t.until&&addd(w,6)>t.until)break;var c=0;for(var i=0;i<7;i++)c+=gdm()[t.id+"|"+addd(w,i)]?1:0;pl+=t.wk;dn+=Math.min(t.wk,c)}});
  return GSC[g.id]={pl:pl,dn:dn,run:run,best:best,days:days,pct:pl?Math.round(dn/pl*100):null}}
function goalOf(id){return(S.goals||[]).filter(function(g){return g.id==id})[0]}
function goalChips(td){var l=(S.goals||[]).filter(function(g){return cur==td?g.date>=td:g.date==cur}).sort(function(a,b){return a.date<b.date?-1:1});
  if(!l.length)return"";
  var lab=function(g){var n=dleft(g);return n<0?"⟦Terminé⟧":n==0?"⟦Aujourd’hui⟧":"⟦J-{0}|"+n+"⟧"},one=function(g){return'<button class="gch" data-act="gopen" data-id="'+g.id+'">🎯 '+esc(g.title)+" · "+lab(g)+'</button>'};
  if(l.length==1)return'<div class="gchs">'+one(l[0])+msChips(l)+'</div>';
  return'<div class="gchs"><button class="gch" data-act="gct">🎯 ⟦Objectifs⟧ ('+l.length+') · '+esc(l[0].title)+" "+lab(l[0])+" "+(gco?"▴":"▾")+'</button>'+(gco?l.map(one).join("")+msChips(l):"")+'</div>'}
function ggHTML(id,l,all,td,nowM){var g=goalOf(id),ts=l.filter(function(t){return t.gl==id}),k=ts.filter(function(t){return t.st=="done"}).length,op=gopn[id],nx=ts.filter(function(t){return!t.st})[0],w=wk0(td),
  fl=cur==td?S.tpls.filter(function(t){return t.gl==id&&t.wk&&(!t.until||t.until>=td)}).map(function(t){var c=0;for(var i=0;i<7;i++)c+=gdm()[t.id+"|"+addd(w,i)]?1:0;return'<div class="fx"><span>↻ '+esc(t.title)+' <span class="mut">'+c+"/"+t.wk+' ⟦cette semaine⟧</span></span><button data-act="gflex" data-id="'+t.id+'">⟦Fait aujourd’hui⟧</button></div>'}).join(""):"";
  return'<div class="gg'+(ts.length&&k==ts.length?" ok":"")+'"><button class="gh" data-act="gtog" data-id="'+id+'"><span>'+(ts.length&&k==ts.length?"✓":"🎯")+' '+esc(g.title)+' <span class="mut">'+(ts.length?k+"/"+ts.length+(k==ts.length?" ✓":""):"")+'</span></span><span>'+(op?"▴":"▾")+'</span></button>'+(op?ts.map(function(t){return cardHTML(t,all,td,nowM)}).join(""):(ts.length?'<div class="wsum">'+ts.slice(0,3).map(function(t){return'<span class="ws'+(t.st=="done"?" done":"")+'"><b>'+fmt(mins(t.start))+'</b> '+esc(t.title)+'</span>'}).join("")+(ts.length>3?"<span>+"+(ts.length-3)+"</span>":"")+'</div>':"")+(nx?'<button class="gl2" style="margin-top:6px" data-act="done" data-id="'+nx.id+'">✓ '+fmt(mins(nx.start))+" "+esc(nx.title)+'</button>':""))+fl+'</div>'}
function gwHTML(G){if(!G.length)return"";var td=iso(new Date()),w0=addd(wk0(td),7*gwo),ds=[0,1,2,3,4,5,6].map(function(i){return addd(w0,i)}),rows=G.filter(function(g){return!g.pz&&g.start<=ds[6]&&g.date>=ds[0]}),dm=function(x){return parse(x).toLocaleDateString(LOC,{day:"numeric",month:"short"})},
  nav='<div class="gt"><button class="gl2" data-act="gwk" data-k="-1">‹</button><b>'+(gwo?dm(ds[0])+" – "+dm(ds[6]):"⟦Cette semaine⟧")+'</b><button class="gl2" data-act="gwk" data-k="1">›</button></div>';
  if(!rows.length)return'<div class="card">'+nav+'<div class="mut">⟦Rien de prévu⟧</div></div>';
  var h='<div class="gw"><span></span>'+ds.map(function(d,i){return'<b class="gc'+(d==td?" tdy":"")+'">'+WD[i]+"<br><small>"+parse(d).getDate()+"</small></b>"}).join("");
  rows.forEach(function(g){var m={};gstat(g).days.forEach(function(x){m[x.d]=x});h+='<button class="gn" data-act="gopen" data-id="'+g.id+'">'+esc(g.title)+"</button>"+ds.map(function(d){var x=m[d],c="·";if(x&&x.p)c=d>td?"○":d==td?(x.k==x.p?"✓":"○"):x.k==x.p?"✓":x.k>0?"◐":"✕";return'<span class="gc'+(d==td?" tdy":"")+(c=="✓"?" ok":c=="✕"?" no":"")+'">'+c+"</span>"}).join("")});
  return'<div class="card">'+nav+h+"</div></div>"}
function gpz(g,d){return(g.pauses||[]).some(function(x){return d>=x.a&&d<=x.b})||(g.pz&&d>=g.pz)}
function gdm(){if(!GDM){GDM={};S.tasks.forEach(function(x){if(x.st=="done"&&x.tp)GDM[x.tp+"|"+x.date]=1})}return GDM}
function autoSlots(acts,gid){var busy=[[],[],[],[],[],[],[]],td=iso(new Date());
  S.tpls.forEach(function(t){if(t.wk||!t.dur||t.gl==gid||(t.until&&t.until<td))return;(t.days||[0,1,2,3,4,5,6]).forEach(function(d){busy[d].push([mins(t.start),mins(t.start)+t.dur])})});
  S.tasks.forEach(function(t){if(t.tp||!t.dur||t.date<td||t.date>addd(td,13))return;busy[wdi(t.date)].push([mins(t.start),mins(t.start)+t.dur])});
  acts.forEach(function(a){if(a.wk||!a.dur)return;var s0=mins(a.start),st=s0;
    for(;st+a.dur<=1380;st+=15){if(a.days.every(function(d){return busy[d].every(function(b){return st>=b[1]+5||st+a.dur+5<=b[0]})}))break}
    if(st+a.dur>1380)st=s0;a.start=hhmm(st);a.days.forEach(function(d){busy[d].push([st,st+a.dur])})});return acts}
function loadHTML(all){var tot=all.filter(function(t){return t.gl}).reduce(function(a,t){return a+t.dur},0);return tot?'<div class="hb"'+(tot>300?' style="color:var(--hi)"':"")+'>⟦Charge des objectifs : {0}|'+dl(tot)+"⟧"+(tot>300?" · ⟦charge élevée⟧":"")+'</div>':""}
var GC="Voici l’état de mon objectif « {0} » (échéance : {1}, dans {2} jours). Discipline : {3} % ({4} tâches manquées), série en cours : {5} jours. {6}Analyse ma situation et propose-moi 3 ajustements concrets et réalistes pour atteindre l’objectif. Réponds en quelques lignes.";
function gcoachp(g){var st=gstat(g),q=g.target>0?tr("Progression : {0} / {1} {2}.").replace("{0}",nf(gcur(g))).replace("{1}",nf(g.target)).replace("{2}",g.unit||"")+" ":"";return tr(GC).replace("{0}",g.title).replace("{1}",parse(g.date).toLocaleDateString(LOC,{day:"numeric",month:"long",year:"numeric"})).replace("{2}",Math.max(0,dleft(g))).replace("{3}",st.pct===null?"—":st.pct).replace("{4}",st.pl-st.dn).replace("{5}",st.run).replace("{6}",q)}
function gactHTML(g){return'<div class="tools"><button data-act="gpz" data-id="'+g.id+'">'+(g.pz?"⟦Reprendre l’objectif⟧":"⟦Mettre en pause⟧")+'</button><button data-act="gcoach" data-id="'+g.id+'">⟦Demander conseil à Claude⟧</button></div>'}
function gfinHTML(g){return'<div class="card"><b>⟦Notes de réflexion (qu’est-ce qui a marché ?)⟧</b><textarea id="gnt" rows="3" style="width:100%;margin-top:6px;padding:9px;border:1px solid var(--line);border-radius:10px;background:var(--bg);font:inherit;color:inherit">'+esc(g.note||"")+'</textarea><div class="tools"><button data-act="grestart" data-id="'+g.id+'">⟦Recommencer cet objectif⟧</button><button data-act="gprolong" data-id="'+g.id+'">⟦Prolonger de 30 jours⟧</button><button data-act="gcoach" data-id="'+g.id+'">⟦Demander conseil à Claude⟧</button></div></div>'}
function gcard(g){var st=gstat(g),tot=gtot(g),p=gprog(g),n=dleft(g);
  return'<button class="gcard" data-act="gopen" data-id="'+g.id+'"><div class="gt"><b>'+esc(g.title)+(g.pz?" ⏸":"")+'</b><span class="mut">'+(n<0?"⟦Terminé⟧":n==0?"⟦Aujourd’hui⟧":"⟦J-{0}|"+n+"⟧")+'</span></div><div class="bar"><i style="width:'+p+'%"></i></div><div class="mut">'+(g.parent?"↳ "+esc(gtitle(g.parent))+" · ":"")+(g.target>0?nf(gcur(g))+" / "+nf(g.target)+" "+esc(g.unit||"")+(st.pct===null?"":" · "):"")+(st.pct===null?"":"⟦Discipline⟧ "+st.pct+" %")+'</div></button>'}
function readGF0(){if(!gf)return;var g=function(i){return document.getElementById(i)};if(!g("gti"))return;gf.title=g("gti").value;gf.why=g("gwy")?g("gwy").value:(gf.why||"");gf.date=g("gdt").value;gf.target=g("gtg").value;gf.unit=g("gun").value;gf.auto=g("gau").checked;gf.mode=g("gmd").value;gf.vs=g("gvs").value;var gp=g("gpar");gf.parent=gp?gp.value:(gf.parent||"");
  gf.acts=gf.acts.map(function(a,i){return{on:g("ga"+i+"o").checked,title:g("ga"+i+"t").value,start:g("ga"+i+"s").value||"18:00",dur:+g("ga"+i+"d").value,wk:+g("ga"+i+"f").value,q:g("ga"+i+"q").checked?1:0,days:WD.map(function(_,j){return g("ga"+i+"w"+j).checked?j:-1}).filter(function(j){return j>=0})}})}
function readGF(){readGF0();if(gf&&gf.ms&&document.getElementById("gti"))gf.ms=gf.ms.map(function(m,i){var t=document.getElementById("gm"+i+"t"),d=document.getElementById("gm"+i+"d");return{id:m.id,title:t?t.value:m.title,date:d?d.value:m.date,done:m.done||""}})}
function GM(ds){return(S.goals||[]).some(function(g){return(g.ms||[]).some(function(m){return!m.done&&m.date==ds})})}
function msChips(l){if(cur!=iso(new Date()))return"";var td=iso(new Date()),h="";l.forEach(function(g){(g.ms||[]).forEach(function(m){var n=dbt(td,m.date);if(!m.done&&n<=7)h+='<button class="gch" data-act="gopen" data-id="'+g.id+'">🏁 '+esc(m.title)+" · "+(n<0?"⟦en retard⟧":n==0?"⟦Aujourd’hui⟧":"⟦J-{0}|"+n+"⟧")+'</button>'})});return h}
function msHTML(g){var ms=(g.ms||[]).slice().sort(function(a,b){return a.date<b.date?-1:1});if(!ms.length)return"";var td=iso(new Date()),dn=ms.filter(function(m){return m.done}).length,dm=function(x){return parse(x).toLocaleDateString(LOC,{day:"numeric",month:"short"})};
  return'<div class="card"><b>⟦Jalons⟧</b> <span class="mut">'+dn+"/"+ms.length+"</span>"+ms.map(function(m){var i=g.ms.indexOf(m),n=dbt(td,m.date);return'<label class="ms'+(m.done?" ok":n<0?" late":"")+'"><input type="checkbox" data-act="gmd" data-i="'+i+'"'+(m.done?" checked":"")+"><span>"+esc(m.title)+'</span><span class="mut">'+(m.done?"✓ "+dm(m.done):dm(m.date)+" · "+(n<0?"⟦en retard⟧":n==0?"⟦Aujourd’hui⟧":"⟦J-{0}|"+n+"⟧"))+"</span></label>"}).join("")+"</div>"}
function cheer(key,msg){S.ch=S.ch||{};if(S.ch[key])return;S.ch[key]=1;toast(msg)}
function afterDone(t){if(!t||t.st!="done")return;GSC={};GDM=null;var td=iso(new Date()),g=t.gl&&goalOf(t.gl);
  if(g){var ts=S.tasks.filter(function(x){return x.gl==g.id&&x.date==t.date}),full=ts.length>0&&ts.every(function(x){return x.st=="done"});
    if(full&&ts.length>1)cheer("all|"+g.id+"|"+t.date,"⟦🎉 « {0} » : tout est fait aujourd’hui !|"+g.title+"⟧");
    if(full&&t.date==td){var n=gstat(g).run+1;if([7,14,30,60,100].indexOf(n)>-1)cheer("st|"+g.id+"|"+n,"⟦🔥 {0} jours d’affilée sur « {1} » !|"+n+"|"+g.title+"⟧")}}
  var dy=S.tasks.filter(function(x){return x.date==t.date});if(dy.length>=3&&dy.every(function(x){return x.st=="done"}))cheer("day|"+t.date,"⟦🎉 Journée complète !⟧")}
function goalSubmit(){readGF();var f=gf,td=iso(new Date()),title=f.title.trim();if(!title||!f.date)return;
  var acts=f.acts.filter(function(a){return a.on&&a.title.trim()&&(a.days.length||a.wk)}).map(function(a){return{title:a.title.trim(),start:a.start,dur:a.dur,days:a.days,wk:a.wk||0,q:a.q||0}});if(f.auto)autoSlots(acts,f.id);
  var g=f.id?S.goals.filter(function(x){return x.id==f.id})[0]:{id:uid(),start:td,log:[]};
  Object.assign(g,{why:(f.why||"").trim(),title:title,date:f.date,target:+f.target||0,unit:f.unit.trim(),mode:f.mode||"sum",vs:+f.vs||0,ms:(f.ms||[]).filter(function(m){return m.title.trim()&&m.date}).map(function(m){return{id:m.id||uid(),title:m.title.trim(),date:m.date,done:m.done||""}}),type:f.type,acts:acts});
  if(f.parent)g.parent=+f.parent;else delete g.parent;
  if(!f.id)(S.goals=S.goals||[]).push(g);
  var yd=addd(td,-1),old=[],oldT=[];S.tpls.forEach(function(t){if(t.gl==g.id){old.push(t.id);oldT.push(t);if(!t.until||t.until>yd)t.until=yd}});
  S.tasks=S.tasks.filter(function(x){return!(x.date>=td&&!x.st&&old.indexOf(x.tp)>-1)});
  var nm=function(x){return(x||"").trim().toLowerCase()},hit={},shr=[];
  acts.forEach(function(a){var m=!a.wk&&S.tpls.filter(function(t){return t.gl&&t.gl!=g.id&&!t.wk&&(!t.until||t.until>=td)&&nm(t.title)==nm(a.title)&&(t.days||[]).join()==a.days.slice().sort().join()})[0];
    if(m){hit[m.id]=1;if((m.gls||[]).indexOf(g.id)<0){(m.gls=m.gls||[]).push(g.id);shr.push(a.title)}return}
    var ot=oldT.filter(function(x){return nm(x.title)==nm(a.title)&&!x.wk})[0];
    S.tpls.push({id:uid(),title:a.title,start:a.start,dur:a.dur,pri:2,days:a.wk?null:a.days,wk:a.wk||0,q:a.q||0,gl:g.id,since:td,until:g.date,gls:ot&&ot.gls?ot.gls.slice():undefined})});
  S.tpls.forEach(function(t){if(t.gls&&t.gls.indexOf(g.id)>-1&&!hit[t.id])t.gls=t.gls.filter(function(x){return x!=g.id})});
  if(shr.length)toast("⟦« {0} » est déjà dans un autre objectif : elle est partagée, pas dupliquée.|"+shr.join(", ")+"⟧");
  Object.keys(S.gen).forEach(function(d){if(d>=td)delete S.gen[d]});
  gf=null;gid=g.id;save();render()}
function gformHTML(){var f=gf,td=iso(new Date());
  return'<div class="shd" data-act="gcancel"></div><form id="gf" class="sheet"><b class="full">⟦'+(f.id?"Modifier l’objectif":"Nouvel objectif")+'⟧</b><select id="gtp" class="full">'+Object.keys(GT).map(function(k){return'<option value="'+k+'"'+(f.type==k?" selected":"")+'>⟦'+GT[k][0]+'⟧</option>'}).join("")+'</select><input class="full" id="gti" required placeholder="⟦Ex. : Anglais courant⟧" value="'+esc(f.title)+'"><input class="full" id="gwy" placeholder="⟦Mon pourquoi (pour quoi je fais ça ?)⟧" value="'+esc(f.why||"")+'"><input type="date" id="gdt" class="full" required value="'+f.date+'"><input type="number" step="any" min="0" id="gtg" placeholder="⟦Quantité à atteindre (facultatif)⟧" value="'+esc(String(f.target))+'"><input id="gun" placeholder="⟦Unité ($, kg, h…)⟧" value="'+esc(f.unit)+'"><select id="gmd" class="full"><option value="sum"'+(f.mode!="value"?" selected":"")+'>⟦Cumul (j’additionne chaque ajout)⟧</option><option value="value"'+(f.mode=="value"?" selected":"")+'>⟦Valeur mesurée (ex. poids)⟧</option></select><input type="number" step="any" id="gvs" placeholder="⟦Valeur de départ⟧" value="'+esc(String(f.vs||""))+'">'+gparOpts()+'<label class="chk full"><input type="checkbox" id="gau"'+(f.auto?" checked":"")+'> ⟦Choisir les heures automatiquement (évite les chevauchements)⟧</label><button type="button" class="full ghost" data-act="gsug">⟦Suggérer des tâches⟧</button><div class="full mut">⟦Tâches proposées (modifie-les ou ajoute les tiennes)⟧</div>'
  +f.acts.map(function(a,i){return'<div class="garow full"><div class="gr1"><input type="checkbox" id="ga'+i+'o"'+(a.on?" checked":"")+'><input id="ga'+i+'t" value="'+esc(a.title)+'" placeholder="⟦Titre…⟧"><button type="button" data-act="gadel" data-i="'+i+'" aria-label="✕">✕</button></div><div class="gr2"><input type="time" id="ga'+i+'s" value="'+a.start+'"><select id="ga'+i+'d">'+opts(durOpts(a.dur,1),a.dur,function(v){return v?dl(v):"⟦sans durée⟧"})+'</select><select id="ga'+i+'f">'+opts([0,1,2,3,4,5,6],a.wk||0,function(v){return v?"⟦{0} fois par semaine (flexible)|"+v+"⟧":"⟦Jours précis⟧"})+'</select><label class="chk"><input type="checkbox" id="ga'+i+'q"'+(a.q?" checked":"")+'> ⟦Demande une quantité⟧</label><span class="wd">'+WD.map(function(x,j){return'<label><input type="checkbox" id="ga'+i+'w'+j+'"'+(a.days.indexOf(j)>-1?" checked":"")+(a.wk?" disabled":"")+'>'+x+'</label>'}).join("")+'</span></div></div>'}).join("")
  +'<button type="button" class="full ghost" data-act="gaadd">⟦+ Ajouter une tâche⟧</button><div class="full mut">⟦Jalons (étapes avec une date)⟧</div>'+(f.ms||[]).map(function(m,i){return'<div class="gr2 full"><input id="gm'+i+'t" placeholder="⟦Titre…⟧" value="'+esc(m.title)+'"><input type="date" id="gm'+i+'d" value="'+m.date+'"><button type="button" data-act="gmdel" data-i="'+i+'" aria-label="✕">✕</button></div>'}).join("")+'<button type="button" class="full ghost" data-act="gmadd">⟦+ Ajouter un jalon⟧</button><button class="full" type="submit">⟦Enregistrer⟧</button><button class="full ghost" type="button" data-act="gcancel">⟦Annuler⟧</button>'+(f.id?'<button class="full ghost" type="button" data-act="gdel">⟦Supprimer l’objectif⟧</button>':"")+'</form>'}
function goalDetail(g,td){
  var st=gstat(g),n=dleft(g),tot=gtot(g),fin=n<0,u=esc(g.unit||""),h="",tw=Math.max(1,dbt(g.start,g.date)),el=Math.max(0,Math.min(tw,dbt(g.start,td))),exp=gT(g)*el/tw,
  tdy=st.days.filter(function(x){return x.d==td})[0]||{p:0,k:0};
  document.getElementById("lbl").textContent=g.title;
  h+='<div class="tools" style="margin-top:0"><button data-act="gback">‹ ⟦Objectifs⟧</button><button data-act="gedit" data-id="'+g.id+'">⟦Modifier⟧</button></div>';
  h+='<div class="card"><b>'+esc(g.title)+'</b><div class="mut">'+parse(g.date).toLocaleDateString(LOC,{weekday:"long",day:"numeric",month:"long",year:"numeric"})+" · "+(fin?"⟦Terminé⟧":n==0?"⟦Aujourd’hui⟧":"⟦J-{0}|"+n+"⟧")+'</div>'+(g.why?'<div class="mvw">💡 '+esc(g.why)+'</div>':"")+'</div>';
  h+=gkids(g)+msHTML(g);
  if(g.target>0){var pc=Math.max(0,Math.round(tot/(gT(g)||1)*100));
    h+='<div class="card"><b>'+nf(gcur(g))+" / "+nf(g.target)+" "+u+'</b> <span class="mut">('+pc+' %)</span><div class="bar" style="margin-top:6px"><i style="width:'+Math.min(100,pc)+'%"></i></div>';
    if(fin)h+='<div style="margin-top:8px"><b>'+(tot>=gT(g)?"⟦Objectif atteint !⟧":"⟦Atteint à {0} %|"+pc+"⟧")+'</b></div>';
    else{var df=tot-exp,th=gT(g)*.05;
      h+='<div class="mut" style="margin-top:8px">'+"⟦Il te faut {0} {1} par jour pour y arriver.|"+nf(Math.max(0,gT(g)-tot)/Math.max(1,n))+"|"+u+"⟧"+'<br><b>'+(df>=th?"⟦En avance de {0} {1}|"+nf(df)+"|"+u+"⟧":df<=-th?"⟦En retard de {0} {1}|"+nf(-df)+"|"+u+"⟧":"⟦Dans les temps⟧")+'</b></div><div class="glog"><input type="number" step="any" min="0" id="glg" placeholder="'+(g.mode=="value"?"⟦Valeur mesurée⟧":"⟦Quantité à ajouter⟧")+'"><button data-act="glog">⟦Ajouter⟧</button></div>'+(g.log.length?'<button class="gl2" style="margin-top:8px" data-act="gundo">⟦Annuler le dernier ajout⟧</button>':"")}
    h+=gcurve(g,tot,tw,el)+'</div>'}
  var sq=st.days.map(function(x){return'<i class="sq '+(x.d>td?"f":x.d==td?"t"+(x.p&&x.k==x.p?" d":""):!x.p?"x":x.k==x.p?"d":x.k>0?"i":"m")+'"></i>'}).join("");
  h+='<div class="card"><b>⟦Discipline⟧</b><div>'+(st.pct===null?"⟦Pas encore de jours évalués⟧":"⟦{0} % ({1}/{2} tâches faites)|"+st.pct+"|"+st.dn+"|"+st.pl+"⟧")+'</div>';
  if(st.pl)h+='<div class="mut">'+(fin?"⟦Meilleure série : {0} jours|"+st.best+"⟧":"⟦Série : {0} jours|"+st.run+"⟧")+" · ⟦Tâches manquées : {0}|"+(st.pl-st.dn)+"⟧"+'</div>';
  if(!fin&&tdy.p)h+='<div class="mut">⟦Aujourd’hui : {0}/{1}|'+tdy.k+"|"+tdy.p+'⟧</div>';
  if(fin&&st.pct!==null)h+='<div style="margin-top:6px"><b>'+(st.pct>=85?"⟦Très bonne discipline⟧":st.pct>=60?"⟦Discipline correcte⟧":"⟦Discipline à renforcer⟧")+'</b></div>';
  h+='<div class="gsq">'+sq+'</div>'+gweeks(st,td)+'</div>';
  if(fin)h=h.replace('<b>'+esc(g.title)+'</b><div class="mut">','<b>⟦Bilan de l’objectif⟧ · '+esc(g.title)+'</b><div class="mut">');
  else{var ts=S.tpls.filter(function(t){return gin(t,g)&&(!t.until||t.until>=td)});
    if(ts.length)h+='<div class="card"><b>⟦Tâches de l’objectif⟧</b>'+ts.map(function(t){return'<div class="mut">'+fmt(mins(t.start))+" · "+esc(t.title)+(t.gl!=g.id?" · ⟦partagée⟧":"")+" · "+(t.wk?t.wk+"×/⟦semaine⟧":WD.map(function(x,j){return(t.days||[]).indexOf(j)>-1?x:"·"}).join(""))+'</div>'}).join("")+'</div>'}
  h+=fin?gfinHTML(g):gactHTML(g);
  return h}
function goalsHTML(){
  var h="",td=iso(new Date()),G=(S.goals||[]).slice().sort(function(a,b){return a.date<b.date?-1:1});
  if(gid){var g=G.filter(function(x){return x.id==gid})[0];if(g)h=goalDetail(g,td);else gid=null}
  if(!gid){document.getElementById("lbl").textContent=tr("Objectifs");
    h='<div class="tools" style="margin-top:0"><button class="add" data-act="gnew">⟦+ Nouvel objectif⟧</button></div>';
    h+=gwHTML(G);
    if(!G.length)h+='<div class="mut" style="text-align:center;padding:20px 0">⟦Aucun objectif pour l’instant. Touche « + Nouvel objectif ».⟧</div>';
    h+=G.filter(function(x){return x.date>=td}).map(gcard).join("");
    var old=G.filter(function(x){return x.date<td});if(old.length)h+='<div class="grp">⟦Terminés⟧</div>'+old.map(gcard).join("")}
  if(gf)h+=gformHTML();
  return h}
