/* Élan — premier lancement guidé, bilan de la semaine, accessibilité.
   Données ajoutées : S.ob (1 = présentation vue), S.wr[lundi] = {t:texte, d:date}, S.fs (taille du texte 0/1/2). */
var obs=0,wro=0;
function X(f,e,s){if(D.en[f]===undefined)D.en[f]=e;if(D.es[f]===undefined)D.es[f]=s}
X("Bienvenue dans Élan","Welcome to Élan","Te damos la bienvenida a Élan");
X("Planifie ta journée, tiens tes objectifs, garde ton élan.","Plan your day, keep your goals, keep your momentum.","Planifica tu día, cumple tus objetivos, mantén tu impulso.");
X("Suivant","Next","Siguiente");X("Retour","Back","Atrás");X("Passer","Skip","Omitir");
X("⏱ Une tâche, c’est une heure, une durée et une priorité.","⏱ A task is a time, a duration and a priority.","⏱ Una tarea es una hora, una duración y una prioridad.");
X("💪 Quand ça coince, touche « J’ai du mal » : une citation, ton pourquoi et un plan B.","💪 When it gets hard, tap “I’m struggling”: a quote, your why and a plan B.","💪 Cuando cuesta, toca «Me cuesta»: una cita, tu porqué y un plan B.");
X("🔗 Les tâches liées s’enchaînent toutes seules.","🔗 Linked tasks chain themselves automatically.","🔗 Las tareas enlazadas se encadenan solas.");
X("📊 Le bilan montre ce qui marche pour toi.","📊 The review shows what works for you.","📊 El balance muestra lo que te funciona.");
X("💾 Tout reste sur ton appareil. Fais une sauvegarde de temps en temps (Réglages).","💾 Everything stays on your device. Back up from time to time (Settings).","💾 Todo se queda en tu dispositivo. Haz una copia de vez en cuando (Ajustes).");
X("Par quoi veux-tu commencer ?","Where do you want to start?","¿Por dónde quieres empezar?");
X("➕ Ma première tâche","➕ My first task","➕ Mi primera tarea");
X("🎯 Mon premier objectif","🎯 My first goal","🎯 Mi primer objetivo");
X("Explorer d’abord","Explore first","Explorar primero");
X("Bilan de la semaine","Weekly review","Balance semanal");
X("C’est dimanche : prends 2 minutes pour faire le bilan de ta semaine.","It’s Sunday: take 2 minutes to review your week.","Es domingo: tómate 2 minutos para hacer el balance de tu semana.");
X("Faire le bilan","Do the review","Hacer el balance");
X("Modifier le bilan","Edit the review","Editar el balance");
X("{0} tâches terminées sur {1} ({2} %)","{0} of {1} tasks done ({2}%)","{0} de {1} tareas terminadas ({2} %)");
X("Meilleur jour : {0}","Best day: {0}","Mejor día: {0}");
X("Priorités du jour tenues : {0}/{1}","Daily priorities kept: {0}/{1}","Prioridades del día cumplidas: {0}/{1}");
X("Série actuelle : {0} j","Current streak: {0} d","Racha actual: {0} d");
X("Qu’est-ce que je change la semaine prochaine ?","What will I change next week?","¿Qué cambio la semana próxima?");
X("Ma décision :","My decision:","Mi decisión:");
X("Aucune tâche cette semaine.","No tasks this week.","Ninguna tarea esta semana.");
X("Enregistrer","Save","Guardar");X("Fermer","Close","Cerrar");
X("Accessibilité","Accessibility","Accesibilidad");X("Taille du texte","Text size","Tamaño del texto");
X("Normale","Normal","Normal");X("Grande","Large","Grande");X("Très grande","Extra large","Muy grande");
X("Confidentialité","Privacy policy","Política de privacidad");
X("Précédent","Previous","Anterior");

/* ---- Premier lancement : seulement si rien n’existe encore (les utilisateurs actuels ne le voient jamais) ---- */
function obNeed(){if(S.ob===undefined&&(S.tasks.length||(S.goals||[]).length))S.ob=1;return!S.ob}
function obHTML(){
  if(view!="d"||!obNeed())return"";
  var h='<div class="shd" data-act="obx"></div><div class="sheet mvh" role="dialog" aria-modal="true">';
  if(obs==0)h+='<b class="full">👋 ⟦Bienvenue dans Élan⟧</b><div class="mut full">⟦Planifie ta journée, tiens tes objectifs, garde ton élan.⟧</div><div class="full">'+langCard()+'</div>';
  else if(obs==1)h+='<b class="full">⟦Bienvenue dans Élan⟧</b>'+["⏱ Une tâche, c’est une heure, une durée et une priorité.","💪 Quand ça coince, touche « J’ai du mal » : une citation, ton pourquoi et un plan B.","🔗 Les tâches liées s’enchaînent toutes seules.","📊 Le bilan montre ce qui marche pour toi.","📲 Installe l’app : Réglages → Installer l’app.","💾 Tout reste sur ton appareil. Fais une sauvegarde de temps en temps (Réglages)."].map(function(x){return'<div class="full">⟦'+x+'⟧</div>'}).join("");
  else h+='<b class="full">⟦Par quoi veux-tu commencer ?⟧</b><div class="tools full" style="margin:0"><button data-act="obt">⟦➕ Ma première tâche⟧</button><button data-act="obg">⟦🎯 Mon premier objectif⟧</button><button data-act="obd">⟦👀 Voir une démo⟧</button><button data-act="obx">⟦Explorer d’abord⟧</button></div>';
  h+='<div class="tools full" style="margin:6px 0 0">'+(obs>0?'<button data-act="obp">⟦Retour⟧</button>':"")+(obs<2?'<button data-act="obn" class="on">⟦Suivant⟧</button>':"")+'<button data-act="obx" class="ghost">⟦Passer⟧</button></div><div class="mut full" aria-hidden="true">'+(obs+1)+' / 3</div></div>';
  return h}

/* ---- Bilan de la semaine ---- */
function wrKey(){return wdays()[0]}
function wrTop(){var k=wrKey();return(S.wr||{})[k]}
function wrStats(){
  var w=wdays(),l=tin([w[0],w[6]]),dn=l.filter(function(t){return t.st=="done"}),h="";
  if(!l.length)return'<div class="mut full">⟦Aucune tâche cette semaine.⟧</div>';
  h+='<div class="full">⟦{0} tâches terminées sur {1} ({2} %)|'+dn.length+'|'+l.length+'|'+rate(l)+'⟧</div>';
  var by={},bd="",bn=0;dn.forEach(function(t){by[t.date]=(by[t.date]||0)+1});
  Object.keys(by).sort().forEach(function(k){if(by[k]>bn){bn=by[k];bd=k}});
  if(bd)h+='<div class="full">⟦Meilleur jour : {0}|'+parse(bd).toLocaleDateString(LOC,{weekday:"long"})+'⟧ ('+bn+')</div>';
  var pn=0,pd=0;w.forEach(function(k){var id=(S.pr||{})[k],t=id&&find(id);if(t){pn++;if(t.st=="done")pd++}});
  if(pn)h+='<div class="full">⟦Priorités du jour tenues : {0}/{1}|'+pd+'|'+pn+'⟧</div>';
  h+='<div class="full">⟦Série actuelle : {0} j|'+streak()[0]+'⟧</div>';
  return h}
function wrCard(){var r=wrTop();
  return'<div class="card"><b>📝 ⟦Bilan de la semaine⟧</b>'+(r?'<div class="mvw">⟦Ma décision :⟧ '+esc(r.t)+'</div>':"")+'<div class="tools"><button data-act="wr">⟦'+(r?"Modifier le bilan":"Faire le bilan")+'⟧</button></div></div>'}
function wrSheet(){if(!wro)return"";var r=wrTop();
  return'<div class="shd" data-act="wrx"></div><div class="sheet mvh" role="dialog" aria-modal="true"><b class="full">📝 ⟦Bilan de la semaine⟧</b>'+wrStats()+'<label class="full" for="wrt">⟦Qu’est-ce que je change la semaine prochaine ?⟧</label><textarea class="full" id="wrt" rows="3" maxlength="400">'+esc(r?r.t:"")+'</textarea><div class="tools full" style="margin:4px 0 0"><button data-act="wrs" class="on">⟦Enregistrer⟧</button><button data-act="wrx">⟦Fermer⟧</button></div></div>'}

/* ---- Points d’entrée appelés par app.js ---- */
function xTop(){
  var b=demoOn()?'<div class="card sug">👀 ⟦Mode démo : données d’exemple. Tes vraies données sont intactes.⟧ <button data-act="demox">⟦Quitter la démo⟧</button></div>':"";
  if(view!="d"||obNeed())return b;
  b+=qaHTML();
  if(cur!=iso(new Date())||parse(cur).getDay()!=0||wrTop())return b;
  return b+'<div class="card sug">📝 ⟦C’est dimanche : prends 2 minutes pour faire le bilan de ta semaine.⟧ <button data-act="wr">⟦Faire le bilan⟧</button></div>'}
function xBil(){return wrCard()+insHTML()}
function xSet(){return instHTML()+'<div class="card"><b>⟦Confort⟧</b><div class="tools"><button data-act="soft" class="'+(S.soft?"on":"")+'">⟦Mode doux⟧ ⟦'+(S.soft?"activé":"désactivé")+'⟧</button></div><div class="mut">⟦Cache « Heure passée », les séries et les rappels de retard. Tes tâches restent affichées.⟧</div></div>'+'<div class="card"><b>⟦Accessibilité⟧</b><br><label for="fs">⟦Taille du texte⟧</label> <select id="fs">'+[["Normale"],["Grande"],["Très grande"]].map(function(x,i){return'<option value="'+i+'"'+((S.fs||0)==i?" selected":"")+'>⟦'+x[0]+'⟧</option>'}).join("")+'</select><br><button data-act="demo">⟦👀 Voir une démo⟧</button> <span class="mut">⟦Données d’exemple, séparées des tiennes.⟧</span><br><a href="privacy.html">⟦Confidentialité⟧</a></div>'}
function xHTML(){return obHTML()+wrSheet()+rtSheet()+sfSheet()+trSheet()}
function xBusy(){var f=document.activeElement;return!!((f&&(f.id=="jrn"||f.id=="qa"))||wro||rto||sfo||tro||(view=="d"&&obNeed()))}
function xAfter(){
  document.documentElement.style.fontSize=[100,112,125][S.fs||0]+"%";document.body.classList.toggle("soft",!!S.soft);xLaunch();
  var p=document.getElementById("pv"),n=document.getElementById("nx");
  if(p)p.setAttribute("aria-label",tr("Précédent"));if(n)n.setAttribute("aria-label",tr("Suivant"));
  var t=document.getElementById("toast");if(t){t.setAttribute("role","status");t.setAttribute("aria-live","polite")}
  document.querySelectorAll(".sheet:not([role])").forEach(function(s){s.setAttribute("role","dialog");s.setAttribute("aria-modal","true")})}
function xAct(a,b,id,t){
  if(a=="obn"){obs=Math.min(2,obs+1);return true}
  if(a=="obp"){obs=Math.max(0,obs-1);return true}
  if(a=="obx"){S.ob=1;obs=0;save();return true}
  if(a=="obt"){S.ob=1;obs=0;sh=1;editId=null;view="d";save();return true}
  if(a=="obg"){S.ob=1;obs=0;view="g";gid=null;gf=null;save();setTimeout(function(){var g=document.querySelector("[data-act=gnew]");if(g)g.click()},0);return true}
  if(xAct2(a,b))return true;
  if(a=="wr"){wro=1;return true}
  if(a=="wrx"){wro=0;return true}
  if(a=="wrs"){var v=(document.getElementById("wrt")||{}).value||"";v=v.trim();S.wr=S.wr||{};if(v)S.wr[wrKey()]={t:v,d:iso(new Date())};else delete S.wr[wrKey()];wro=0;save();toast("⟦Enregistrer⟧ ✓");return true}
  return false}
document.addEventListener("change",function(e){if(e.target.id=="fs"){S.fs=+e.target.value;save();xAfter()}});
document.addEventListener("keydown",function(e){if(e.key=="Escape"){var x=document.querySelector(".shd");if(x)x.click()}});

/* ---- Dans le formulaire de A : « une autre tâche suit celle-ci » (B s’adapte aux heures de A) ---- */
X("Aucune tâche ne suit celle-ci","No task follows this one","Ninguna tarea sigue a esta");
X("Une autre tâche suit celle-ci :","Another task follows this one:","Otra tarea sigue a esta:");
function lkAnc(t){var r=[],c=t;for(var i=0;i<8&&c&&c.af;i++){c=find(c.af);if(c)r.push(String(c.id))}return r}
function foHTML(e,all){
  var anc=e.id?lkAnc(e):[],fl=e.id?S.tasks.filter(function(x){return x.af==e.id&&x.date==e.date})[0]:null;
  var ops=all.filter(function(x){return x.id!=e.id&&anc.indexOf(String(x.id))<0}).map(function(x){return'<option value="'+x.id+'"'+(fl&&fl.id==x.id?" selected":"")+'>⟦Une autre tâche suit celle-ci :⟧ '+fmt(mins(x.start))+" "+esc(x.title)+'</option>'}).join("");
  return tipHTML("ch")+'<select class="full" id="fo" data-prev="'+(fl?fl.id:"")+'"><option value="">⟦Aucune tâche ne suit celle-ci⟧</option>'+ops+'</select>'}
function foSave(t){
  var s=document.getElementById("fo");if(!s)return;var prev=s.dataset.prev||"",v=s.value;if(prev==v)return;
  if(prev){var p=find(prev);if(p){delete p.af;delete p.cs}}
  if(v){var b=find(v);if(b&&String(b.id)!=String(t.id)){b.af=t.id;delete b.cs}}}

X("suivie de","followed by","seguida de");
function flChip(t){var f=S.tasks.filter(function(x){return x.af==t.id&&x.date==t.date});return f.length?"<span>🔗 ⟦suivie de⟧ "+esc(f[0].title)+(f.length>1?" +"+(f.length-1):"")+"</span>":""}

/* ===== Routines, démo, décaler la suite ===== */
var rto=0,rtm=0,sfo=0;
X("Routines","Routines","Rutinas");X("Nouvelle routine","New routine","Nueva rutina");
X("Nom de la routine","Routine name","Nombre de la rutina");
X("Un pas par ligne : titre et durée en minutes (ex. Méditation 15)","One step per line: title and minutes (e.g. Meditation 15)","Un paso por línea: título y minutos (p. ej. Meditación 15)");
X("Enregistrer la routine","Save routine","Guardar la rutina");
X("Ou enregistrer une chaîne d’aujourd’hui :","Or save a chain from today:","O guarda una cadena de hoy:");
X("Aucune routine pour l’instant.","No routines yet.","Aún no hay rutinas.");
X("Une routine place plusieurs tâches enchaînées d’un coup.","A routine adds several chained tasks at once.","Una rutina añade varias tareas encadenadas de una vez.");
X("Placer","Add","Añadir");X("{0} étapes","{0} steps","{0} pasos");X("Commencer à","Start at","Empezar a las");
X("Routine ajoutée : {0} tâches","Routine added: {0} tasks","Rutina añadida: {0} tareas");
X("Décaler la suite","Shift the rest","Desplazar el resto");
X("Décale les tâches qui n’ont pas encore commencé. Les tâches liées suivent.","Shifts tasks that haven’t started yet. Linked tasks follow.","Desplaza las tareas que aún no han empezado. Las enlazadas las siguen.");
X("{0} tâche(s) décalée(s) de {1} min","{0} task(s) shifted by {1} min","{0} tarea(s) desplazada(s) {1} min");
X("Aucune tâche à décaler.","No task to shift.","Ninguna tarea que desplazar.");
X("👀 Voir une démo","👀 See a demo","👀 Ver una demo");
X("Mode démo : données d’exemple. Tes vraies données sont intactes.","Demo mode: sample data. Your real data is untouched.","Modo demo: datos de ejemplo. Tus datos reales no se tocan.");
X("Quitter la démo","Exit demo","Salir de la demo");
X("Données d’exemple, séparées des tiennes.","Sample data, separate from yours.","Datos de ejemplo, separados de los tuyos.");
X("Supprimer","Delete","Eliminar");

function xTools(){return'<button data-act="tro">🗑 ⟦Corbeille⟧</button><button data-act="rto">🔁 ⟦Routines⟧</button><button data-act="sfo">⏩ ⟦Décaler la suite⟧</button>'}
function rtParse(txt){return String(txt||"").split("\n").map(function(l){return l.trim()}).filter(Boolean).slice(0,12).map(function(l){
  var m=/^(.*?)[\s,;:\-–]*(\d+)\s*(h|min|m)?\s*$/i.exec(l),dur=30,title=l;
  if(m&&m[1].trim()){title=m[1].trim();dur=+m[2]*(/^h/i.test(m[3]||"")?60:1)}
  return{title:title,dur:Math.min(720,dur),ag:0,pri:2}})}
function rtRoots(){return S.tasks.filter(function(t){return t.date==cur&&!t.af&&S.tasks.some(function(x){return x.af==t.id&&x.date==t.date})})}
function rtApply(r,start){var prev=null,n=0;
  r.items.forEach(function(it,i){var t={id:uid()+i,title:it.title,start:start||r.start||"07:00",dur:it.dur,pri:it.pri||2,date:cur,st:""};
    if(it.cat)t.cat=it.cat;if(prev){t.af=prev.id;t.ag=it.ag||0}S.tasks.push(t);prev=t;n++});
  save();setTimeout(function(){toast("⟦Routine ajoutée : {0} tâches|"+n+"⟧")},80)}
function rtSheet(){if(!rto)return"";
  var h='<div class="shd" data-act="rtx"></div><div class="sheet mvh" role="dialog" aria-modal="true"><b class="full">🔁 ⟦Routines⟧</b>';
  if(rtm==1){
    h+='<input class="full" id="rtnm" maxlength="40" placeholder="⟦Nom de la routine⟧"><label class="full mut" for="rtst">⟦Commencer à⟧</label><input type="time" id="rtst" value="07:00"><textarea class="full" id="rtln" rows="5" placeholder="⟦Un pas par ligne : titre et durée en minutes (ex. Méditation 15)⟧"></textarea><div class="tools full" style="margin:4px 0 0"><button data-act="rtsv" class="on">⟦Enregistrer la routine⟧</button><button data-act="rtnew0">⟦Retour⟧</button></div></div>';return h}
  h+='<div class="mut full">⟦Une routine place plusieurs tâches enchaînées d’un coup.⟧</div>'+tipHTML("rt");
  var rs=S.rt||[];
  if(!rs.length)h+='<div class="mut full">⟦Aucune routine pour l’instant.⟧</div>';
  rs.forEach(function(r){h+='<div class="full"><b>'+esc(r.name)+'</b> <span class="mut">⟦{0} étapes|'+r.items.length+'⟧</span><div class="mut">'+r.items.map(function(i){return esc(i.title)+" "+dl(i.dur)}).join(" → ")+'</div><div class="tools" style="margin:4px 0 0"><input type="time" id="rtt'+r.id+'" value="'+r.start+'" aria-label="⟦Commencer à⟧"><button data-act="rtp" data-id="'+r.id+'" class="on">⟦Placer⟧</button><button data-act="rtd" data-id="'+r.id+'" aria-label="⟦Supprimer⟧">✕</button></div></div>'});
  h+='<div class="tools full" style="margin:4px 0 0"><button data-act="rtnew">➕ ⟦Nouvelle routine⟧</button></div>';
  var ro=rtRoots();
  if(ro.length)h+='<div class="mut full">⟦Ou enregistrer une chaîne d’aujourd’hui :⟧</div><select class="full" id="rtc">'+ro.map(function(t){return'<option value="'+t.id+'">'+fmt(mins(t.start))+" "+esc(t.title)+'</option>'}).join("")+'</select><input class="full" id="rtcn" maxlength="40" placeholder="⟦Nom de la routine⟧"><div class="tools full" style="margin:4px 0 0"><button data-act="rtcap">⟦Enregistrer la routine⟧</button></div>';
  h+='<div class="tools full" style="margin:6px 0 0"><button data-act="rtx" class="ghost">⟦Fermer⟧</button></div></div>';return h}
function sfSheet(){if(!sfo)return"";
  return'<div class="shd" data-act="sfx"></div><div class="sheet mvh" role="dialog" aria-modal="true"><b class="full">⏩ ⟦Décaler la suite⟧</b><div class="mut full">⟦Décale les tâches qui n’ont pas encore commencé. Les tâches liées suivent.⟧</div><div class="tools full" style="margin:4px 0 0"><button data-act="sfd" data-k="15">+15 min</button><button data-act="sfd" data-k="30" class="on">+30 min</button><button data-act="sfd" data-k="60">+60 min</button><button data-act="sfx" class="ghost">⟦Fermer⟧</button></div></div>'}

function demoOn(){try{return!!localStorage.getItem("elan-demo")}catch(e){return false}}
function demoData(){
  var td=iso(new Date()),T=function(f,e){return LANG=="fr"?f:e},n=0,id=function(){return 9000000+(++n)},t=[];
  function add(o){o.id=id();o.pri=o.pri||2;o.st=o.st||"";t.push(o);return o}
  var rv=add({title:T("Réveil","Wake up"),start:"06:30",dur:0,date:td,st:"done",at:"06:30"});
  var md=add({title:T("Méditation","Meditation"),start:"06:30",dur:15,date:td,st:"done",at:"06:45",af:rv.id,ag:0});
  add({title:T("Déjeuner","Breakfast"),start:"06:55",dur:20,date:td,st:"done",at:"07:15",af:md.id,ag:10});
  var et=add({title:T("Étude : réseaux","Study: networking"),start:"09:00",dur:120,pri:1,date:td,pb:T("Relire mes notes 10 minutes","Reread my notes for 10 minutes")});
  add({title:T("Anglais : podcast","English: podcast"),start:"18:30",dur:30,date:td,pb:T("Écouter 5 minutes seulement","Listen for just 5 minutes")});
  add({title:T("Séance de sport","Workout"),start:"17:00",dur:60,pri:1,date:td});
  add({title:T("Lecture","Reading"),start:"21:00",dur:30,pri:3,date:td});
  for(var k=1;k<=6;k++){var d=addd(td,-k);
    add({title:T("Étude : réseaux","Study: networking"),start:"09:00",dur:120,pri:1,date:d,st:"done",at:"11:00"});
    if(k!=3)add({title:T("Séance de sport","Workout"),start:"17:00",dur:60,pri:1,date:d,st:"done",at:"18:00"});
    if(k%2)add({title:T("Anglais : podcast","English: podcast"),start:"18:30",dur:30,date:d,st:"done",at:"19:00"});
    add({title:T("Lecture","Reading"),start:"21:00",dur:30,pri:3,date:d,st:k<3?"done":""})}
  var dd=parse(td),mon=new Date(dd);mon.setDate(dd.getDate()-((dd.getDay()+6)%7)-7);var pm=iso(mon),jr={},pr={},wr={};
  jr[addd(td,-1)]={m:4,e:4};jr[addd(td,-2)]={m:3,e:3};pr[td]=et.id;pr[addd(td,-1)]=t.filter(function(x){return x.date==addd(td,-1)})[0].id;
  wr[pm]={t:T("Commencer l’étude avant 9 h, sans téléphone.","Start studying before 9 am, phone away."),d:addd(pm,6)};
  var g={id:9100001,start:addd(td,-14),log:[],why:T("Travailler à l’international un jour.","Work internationally one day."),title:T("Parler anglais couramment","Speak fluent English"),date:addd(td,76),target:60,unit:"h",mode:"sum",vs:0,type:"lang",acts:[],ms:[{id:9100002,title:T("Premier podcast sans sous-titres","First podcast without subtitles"),date:addd(td,10),done:""}]};
  var r=[{id:9200001,name:T("Routine du matin","Morning routine"),start:"06:30",items:[{title:T("Réveil","Wake up"),dur:0,ag:0,pri:2},{title:T("Méditation","Meditation"),dur:15,ag:0,pri:2},{title:T("Déjeuner","Breakfast"),dur:20,ag:10,pri:2}]}];
  return{tasks:t,tpls:[],gen:{},goals:[g],jr:jr,pr:pr,wr:wr,rt:r,ob:1,v:typeof DV!="undefined"?DV:2}}
function xReload(){try{location.reload()}catch(e){}}
function xAct2(a,b){var id=b&&b.dataset?b.dataset.id:null;if(xAct3(a,b,id))return true;
  if(a=="demo"){try{localStorage.setItem("planner-demo",JSON.stringify(demoData()));localStorage.setItem("elan-demo","1")}catch(e){}xReload();return true}
  if(a=="demox"){try{localStorage.removeItem("elan-demo");localStorage.removeItem("planner-demo")}catch(e){}xReload();return true}
  if(a=="obd"){obs=0;return xAct2("demo",b)}
  if(a=="rto"){rto=1;rtm=0;return true}
  if(a=="rtx"){rto=0;rtm=0;return true}
  if(a=="rtnew"){rtm=1;return true}
  if(a=="rtnew0"){rtm=0;return true}
  if(a=="rtsv"){var nm=(document.getElementById("rtnm").value||"").trim(),it=rtParse(document.getElementById("rtln").value);if(!nm||!it.length)return true;
    S.rt=S.rt||[];S.rt.push({id:uid(),name:nm,start:document.getElementById("rtst").value||"07:00",items:it});rtm=0;save();return true}
  if(a=="rtcap"){var sel=document.getElementById("rtc"),r0=sel&&find(sel.value);if(!r0)return true;var items=[],c=r0;
    while(c&&items.length<12){items.push({title:c.title,dur:c.dur||0,ag:items.length?(+c.ag||0):0,pri:c.pri||2,cat:c.cat||""});c=S.tasks.filter(function(x){return x.af==c.id&&x.date==c.date})[0]}
    S.rt=S.rt||[];S.rt.push({id:uid(),name:(document.getElementById("rtcn").value||"").trim()||r0.title,start:r0.start,items:items});save();return true}
  if(a=="rtp"){var r=(S.rt||[]).filter(function(x){return x.id==id})[0];if(!r)return true;var ti=document.getElementById("rtt"+id);rtApply(r,ti&&ti.value||r.start);rto=0;return true}
  if(a=="rtd"){S.rt=(S.rt||[]).filter(function(x){return x.id!=id});save();return true}
  if(a=="sfo"){sfo=1;return true}
  if(a=="sfx"){sfo=0;return true}
  if(a=="sfd"){var k=+b.dataset.k,now=new Date().getHours()*60+new Date().getMinutes(),td=iso(new Date()),c2=0;
    S.tasks.forEach(function(t){if(t.date!=cur||t.st||t.af)return;if(cur==td&&mins(t.start)<now)return;t.start=hhmm(Math.min(1439,mins(t.start)+k));c2++});
    sfo=0;save();setTimeout(function(){toast(c2?"⟦{0} tâche(s) décalée(s) de {1} min|"+c2+"|"+k+"⟧":"⟦Aucune tâche à décaler.⟧")},80);return true}
  return false}

/* ===== Guide d’installation, corbeille (30 jours), sauvegarde par la feuille de partage ===== */
var tro=0,xip=null;
X("Installer l’app","Install the app","Instalar la app");
X("✓ Élan est installée sur cet appareil.","✓ Élan is installed on this device.","✓ Élan está instalada en este dispositivo.");
X("iPhone / iPad (Safari) : touche Partager, puis « Sur l’écran d’accueil ».","iPhone / iPad (Safari): tap Share, then “Add to Home Screen”.","iPhone / iPad (Safari): toca Compartir y luego «Añadir a pantalla de inicio».");
X("Android (Chrome) : touche ⋮, puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».","Android (Chrome): tap ⋮, then “Install app” or “Add to Home screen”.","Android (Chrome): toca ⋮ y luego «Instalar aplicación» o «Añadir a la pantalla de inicio».");
X("Ordinateur (Chrome ou Edge) : icône d’installation dans la barre d’adresse.","Computer (Chrome or Edge): install icon in the address bar.","Ordenador (Chrome o Edge): icono de instalación en la barra de direcciones.");
X("Installer maintenant","Install now","Instalar ahora");
X("Les rappels ne sont pas garantis quand l’app est fermée (limite des applis web). Garde-la ouverte ou consulte-la souvent.","Reminders aren’t guaranteed while the app is closed (a web-app limit). Keep it open or check it often.","Los recordatorios no están garantizados con la app cerrada (límite de las apps web). Mantenla abierta o consúltala a menudo.");
X("📲 Installe l’app : Réglages → Installer l’app.","📲 Install the app: Settings → Install the app.","📲 Instala la app: Ajustes → Instalar la app.");
X("Corbeille","Trash","Papelera");
X("Tâches supprimées (conservées 30 jours).","Deleted tasks (kept for 30 days).","Tareas eliminadas (se conservan 30 días).");
X("Restaurer","Restore","Restaurar");X("Vider la corbeille","Empty trash","Vaciar papelera");
X("La corbeille est vide.","Trash is empty.","La papelera está vacía.");
X("Tâche restaurée","Task restored","Tarea restaurada");
X("supprimée le {0}","deleted {0}","eliminada el {0}");
X("Sauvegarde téléchargée : cherche le fichier « elan-sauvegarde » dans tes téléchargements.","Backup downloaded: look for the “elan-sauvegarde” file in your downloads.","Copia descargada: busca el archivo «elan-sauvegarde» en tus descargas.");
try{window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();xip=e})}catch(e){}
function instStandalone(){try{return!!(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||!!navigator.standalone}catch(e){return false}}
function instHTML(){
  if(instStandalone())return'<div class="card"><b>⟦Installer l’app⟧</b><br>⟦✓ Élan est installée sur cet appareil.⟧</div>';
  var ua=navigator.userAgent||"",ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform=="MacIntel"&&navigator.maxTouchPoints>1),an=/Android/.test(ua);
  var st=ios?"iPhone / iPad (Safari) : touche Partager, puis « Sur l’écran d’accueil ».":an?"Android (Chrome) : touche ⋮, puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».":"Ordinateur (Chrome ou Edge) : icône d’installation dans la barre d’adresse.";
  return'<div class="card"><b>⟦Installer l’app⟧</b><br>⟦'+st+'⟧'+(xip?'<div class="tools"><button data-act="inst" class="on">⟦Installer maintenant⟧</button></div>':"")+'<div class="mut">⟦Les rappels ne sont pas garantis quand l’app est fermée (limite des applis web). Garde-la ouverte ou consulte-la souvent.⟧</div></div>'}
function xTrash(u){var l=S.trash=S.trash||[],lim=Date.now()-30*864e5;S.trash=l.filter(function(x){return x.dl>lim&&x.id!=u.id});S.trash.push(Object.assign({},u,{dl:Date.now()}))}
function trSheet(){if(!tro)return"";
  var lim=Date.now()-30*864e5,l=(S.trash||[]).filter(function(x){return x.dl>lim}).sort(function(p,q){return q.dl-p.dl}).slice(0,40);
  var h='<div class="shd" data-act="trx"></div><div class="sheet mvh" role="dialog" aria-modal="true"><b class="full">🗑 ⟦Corbeille⟧</b><div class="mut full">⟦Tâches supprimées (conservées 30 jours).⟧</div>';
  if(!l.length)h+='<div class="mut full">⟦La corbeille est vide.⟧</div>';
  l.forEach(function(t){h+='<div class="full"><b>'+esc(t.title)+'</b> <span class="mut">'+fmt(mins(t.start))+" · "+parse(t.date).toLocaleDateString(LOC,{day:"numeric",month:"short"})+'</span><div class="tools" style="margin:4px 0 0"><button data-act="trr" data-id="'+t.id+'" class="on">⟦Restaurer⟧</button></div></div>'});
  h+='<div class="tools full" style="margin:6px 0 0">'+(l.length?'<button data-act="trc">⟦Vider la corbeille⟧</button>':"")+'<button data-act="trx" class="ghost">⟦Fermer⟧</button></div></div>';return h}
function xShare(n,j){try{var f=new File([j],n,{type:"application/json"});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:n}).then(function(){S.bk=iso(new Date());save();render()}).catch(function(){});return true}}catch(e){}return false}
function xAct3(a,b,id){
  if(a=="soft"){S.soft=S.soft?0:1;save();return true}
  if(a=="qa"){qaAdd();return true}
  if(a=="inst"){if(xip){xip.prompt();xip=null}return true}
  if(a=="tro"){tro=1;return true}
  if(a=="trx"){tro=0;return true}
  if(a=="trr"){var t=(S.trash||[]).filter(function(x){return x.id==id})[0];if(!t)return true;S.trash=S.trash.filter(function(x){return x.id!=id});delete t.dl;S.tasks.push(t);save();toast("⟦Tâche restaurée⟧");return true}
  if(a=="trc"){S.trash=[];save();return true}
  return false}

/* ===== Ajout rapide, mode doux, bulles d’aide, conseils du bilan, raccourcis d’icône ===== */
X("Ajouter vite : Appeler Marc 14h 30 min","Quick add: Call Marc 2pm 30 min","Añadir rápido: Llamar a Marc 14h 30 min");
X("Ajouter une tâche rapidement","Add a task quickly","Añadir una tarea rápidamente");
X("Ajouter","Add","Añadir");
X("Tâche ajoutée à {0}","Task added at {0}","Tarea añadida a las {0}");
X("Confort","Comfort","Comodidad");X("Mode doux","Gentle mode","Modo suave");
X("activé","on","activado");X("désactivé","off","desactivado");
X("Cache « Heure passée », les séries et les rappels de retard. Tes tâches restent affichées.","Hides “Time passed”, streaks and overdue reminders. Your tasks stay visible.","Oculta «Hora pasada», las rachas y los avisos de retraso. Tus tareas siguen visibles.");
X("Il reste des tâches.","Some tasks remain.","Quedan tareas.");X("À reprendre","To pick up","Por retomar");
X("Quand tu n’as pas envie, choisis la raison ci-dessous : l’app te propose une citation, ton pourquoi et un plan plus petit.","When you don’t feel like it, pick a reason below: the app offers a quote, your why and a smaller plan.","Cuando no te apetece, elige un motivo abajo: la app te propone una cita, tu porqué y un plan más pequeño.");
X("Une routine, c’est une suite de tâches enchaînées. Place-la sur un jour et tout s’aligne tout seul.","A routine is a set of chained tasks. Add it to a day and everything lines up by itself.","Una rutina es una serie de tareas encadenadas. Colócala en un día y todo se alinea solo.");
X("Une tâche liée démarre quand l’autre finit. Si la première bouge, celle-ci la suit.","A linked task starts when the other one ends. If the first one moves, this one follows.","Una tarea enlazada empieza cuando termina la otra. Si la primera se mueve, esta la sigue.");
X("OK","OK","OK");
X("Ce que montrent tes chiffres","What your numbers show","Lo que muestran tus cifras");
X("Continue quelques jours : les conseils apparaîtront ici (il faut environ 12 tâches).","Keep going for a few days: tips will appear here (about 12 tasks are needed).","Sigue unos días: los consejos aparecerán aquí (hacen falta unas 12 tareas).");
X("Ton meilleur moment : le matin ({0} %)","Your best time: morning ({0}%)","Tu mejor momento: la mañana ({0} %)");
X("Ton meilleur moment : l’après-midi ({0} %)","Your best time: afternoon ({0}%)","Tu mejor momento: la tarde ({0} %)");
X("Ton meilleur moment : le soir ({0} %)","Your best time: evening ({0}%)","Tu mejor momento: la noche ({0} %)");
X("Les tâches de 60 min ou plus sont moins souvent terminées ({0} % contre {1} %). Essaie de les découper en deux.","Tasks of 60 min or more are finished less often ({0}% vs {1}%). Try splitting them in two.","Las tareas de 60 min o más se terminan menos ({0} % frente a {1} %). Prueba a dividirlas en dos.");
X("Rien d’inquiétant : tes résultats sont réguliers.","Nothing worrying: your results are steady.","Nada preocupante: tus resultados son regulares.");

function tipHTML(k){if(obNeed()||(S.tips&&S.tips[k]))return"";
  var t={hm:"Quand tu n’as pas envie, choisis la raison ci-dessous : l’app te propose une citation, ton pourquoi et un plan plus petit.",rt:"Une routine, c’est une suite de tâches enchaînées. Place-la sur un jour et tout s’aligne tout seul.",ch:"Une tâche liée démarre quand l’autre finit. Si la première bouge, celle-ci la suit."}[k];
  return t?'<div class="mut full tip">💡 ⟦'+t+'⟧ <button type="button" data-act="tipx" data-k="'+k+'">⟦OK⟧</button></div>':""}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=tipx]");if(!b)return;
  S.tips=S.tips||{};S.tips[b.dataset.k]=1;save();var t=b.closest(".tip");if(t)t.remove()});
function qaHTML(){return'<div class="qa"><input id="qa" maxlength="120" enterkeyhint="done" placeholder="⟦Ajouter vite : Appeler Marc 14h 30 min⟧" aria-label="⟦Ajouter une tâche rapidement⟧"><button type="button" data-act="qa" class="on" aria-label="⟦Ajouter⟧">＋</button></div>'}
function qaAdd(){var i=document.getElementById("qa"),v=((i&&i.value)||"").trim();if(!v)return;
  var n=new Date(),nm=Math.ceil((n.getHours()*60+n.getMinutes()+1)/15)*15,def=cur==iso(n)&&nm<1440?hhmm(nm):"09:00";
  var o={title:v,start:def,dur:30,pri:2,date:cur,cat:"",note:"",pb:"",af:"",ag:0};qp(o);
  S.tasks.push(Object.assign({id:uid(),st:""},o));save();setTimeout(function(){toast("⟦Tâche ajoutée à {0}|"+fmt(mins(o.start))+"⟧")},80)}
document.addEventListener("keydown",function(e){if(e.key=="Enter"&&e.target&&e.target.id=="qa"){e.preventDefault();qaAdd();render()}});
function insHTML(){
  var td=iso(new Date()),from=addd(td,-28),done=function(t){return t.st=="done"},
    L=S.tasks.filter(function(t){return t.date>=from&&t.date<=td&&(t.st=="done"||t.st=="stop"||t.date<td)}),
    rate=function(a){return a.length?Math.round(100*a.filter(done).length/a.length):0},
    h='<div class="card"><b>💡 ⟦Ce que montrent tes chiffres⟧</b>';
  if(L.length<12)return h+'<div class="mut">⟦Continue quelques jours : les conseils apparaîtront ici (il faut environ 12 tâches).⟧</div></div>';
  var lines=[],bk={m:[],a:[],e:[]};
  L.forEach(function(t){var s=mins(t.start);bk[s<720?"m":s<1080?"a":"e"].push(t)});
  var ok=Object.keys(bk).filter(function(k){return bk[k].length>=5}).sort(function(p,q){return rate(bk[q])-rate(bk[p])});
  if(ok.length>1&&rate(bk[ok[0]])-rate(bk[ok[ok.length-1]])>=15){var nm={m:"le matin",a:"l’après-midi",e:"le soir"}[ok[0]];lines.push("⟦Ton meilleur moment : "+nm+" ({0} %)|"+rate(bk[ok[0]])+"⟧")}
  var lg=L.filter(function(t){return t.dur>=60}),sh2=L.filter(function(t){return t.dur>0&&t.dur<60});
  if(lg.length>=5&&sh2.length>=5&&rate(sh2)-rate(lg)>=15)lines.push("⟦Les tâches de 60 min ou plus sont moins souvent terminées ({0} % contre {1} %). Essaie de les découper en deux.|"+rate(lg)+"|"+rate(sh2)+"⟧");
  if(!lines.length)lines.push("⟦Rien d’inquiétant : tes résultats sont réguliers.⟧");
  return h+lines.map(function(l){return'<div>'+l+'</div>'}).join("")+'</div>'}
var xq=0;
function xLaunch(){if(xq)return;xq=1;var q=location.search||"";
  if(/[?&]add=1/.test(q)){sh=1;editId=null;render()}
  else if(/[?&]now=1/.test(q)){var b=document.querySelector("[data-act=wnow]");if(b)b.click()}
  if(/[?&](add|now)=1/.test(q)){try{history.replaceState(null,"",location.pathname+(/[?&]admin\b/.test(q)?"?admin":""))}catch(e){}}}
