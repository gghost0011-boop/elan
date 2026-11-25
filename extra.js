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
  b+=qaHTML()+softHTML()+plHTML()+ntHTML();
  if(cur!=iso(new Date())||parse(cur).getDay()!=0||wrTop())return b;
  return b+'<div class="card sug">📝 ⟦C’est dimanche : prends 2 minutes pour faire le bilan de ta semaine.⟧ <button data-act="wr">⟦Faire le bilan⟧</button></div>'}
function xBil(){return wrCard()+insHTML()}
function xSet(){return instHTML()+'<div class="card"><b>⟦Confort⟧</b><div class="tools"><button data-act="soft" class="'+(S.soft?"on":"")+'">⟦Mode doux⟧ ⟦'+(S.soft?"activé":"désactivé")+'⟧</button></div><div class="mut">⟦Cache « Heure passée », les séries et les rappels de retard. Tes tâches restent affichées.⟧</div></div>'+'<div class="card"><b>⟦Accessibilité⟧</b><br><label for="fs">⟦Taille du texte⟧</label> <select id="fs">'+[["Normale"],["Grande"],["Très grande"]].map(function(x,i){return'<option value="'+i+'"'+((S.fs||0)==i?" selected":"")+'>⟦'+x[0]+'⟧</option>'}).join("")+'</select><br><button data-act="demo">⟦👀 Voir une démo⟧</button> <span class="mut">⟦Données d’exemple, séparées des tiennes.⟧</span><br><a href="privacy.html">⟦Confidentialité⟧</a></div>'}
function xHTML(){return infSheet()+imSheet()+obHTML()+wrSheet()+rtSheet()+sfSheet()+trSheet()}
function xBusy(){var f=document.activeElement;return!!((f&&(f.id=="jrn"||f.id=="qa"))||wro||rto||sfo||tro||imo||(view=="d"&&obNeed()))}
function xAfter(){
  document.documentElement.style.fontSize=[100,112,125][S.fs||0]+"%";document.body.classList.toggle("soft",!!S.soft);xLaunch();infInject();
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

function xTools(){return'<button data-act="imo">📥 ⟦Importer une liste⟧</button><button data-act="tro">🗑 ⟦Corbeille⟧</button><button data-act="rto">🔁 ⟦Routines⟧</button><button data-act="sfo">⏩ ⟦Décaler la suite⟧</button>'}
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
  return{tasks:t,tpls:[],gen:{},goals:[g],jr:jr,pr:pr,wr:wr,rt:r,nt:[{id:9300001,title:T("Appeler le dentiste","Call the dentist"),dur:15,date:td}],ob:1,v:typeof DV!="undefined"?DV:2}}
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
  if(a=="inf"){ifo=+b.dataset.k;return true}
  if(a=="infx"){ifo=-1;return true}
  if(a=="imo"){imo=1;imtx="";imv=[];return true}
  if(a=="imx"){imo=0;return true}
  if(a=="imb"){imo=1;return true}
  if(a=="imp"){var ta=document.getElementById("iml");imtx=(ta&&ta.value)||"";imv=imtx.split("\n").map(function(l){return l.trim()}).filter(Boolean).slice(0,40).map(qaObj);if(imv.length)imo=2;return true}
  if(a=="img"){var ids=imv.map(function(o){return qaPut(o).id}),c=ids.length;imo=0;imtx="";imv=[];if(c)setTimeout(function(){toast("⟦{0} tâches importées · Annuler|"+c+"⟧",function(){S.tasks=S.tasks.filter(function(t){return ids.indexOf(t.id)<0});S.nt=(S.nt||[]).filter(function(t){return ids.indexOf(t.id)<0});save();render()})},80);return true}
  if(a=="ntp"){ntpo=ntpo==id?0:id;return true}
  if(a=="ntw"||a=="ntt"){var q0=(S.nt||[]).filter(function(q){return q.id==id})[0];if(!q0)return true;var s0;
    if(a=="ntt"){var ti=document.getElementById("ntt"+id);if(!ti||!ti.value)return true;s0=mins(ti.value)}
    else s0=freeSlot(cur,q0.dur||30,{e:0,a:780,s:1080}[b.dataset.k]||0);
    ntPlace(q0,s0);return true}
  if(a=="ntd"||a=="ntx"){var it=(S.nt||[]).filter(function(q){return q.id==id})[0];if(!it)return true;
    S.nt=S.nt.filter(function(q){return q.id!=id});
    if(a=="ntd")S.tasks.push({id:uid(),st:"done",at:nowHM(),title:it.title,start:hhmm(new Date().getHours()*60+new Date().getMinutes()),dur:0,pri:it.pri||2,date:iso(new Date()),cat:it.cat||"",note:"",pb:"",af:"",ag:0});
    save();return true}
  if(a=="plk"){S.plz=iso(new Date());save();return true}
  if(a=="plt"){var q1=plCalc();if(q1){var g1=q1.G.filter(function(g){return g.r.id==id})[0];if(g1)plsel[id]=!g1.on}return true}
  if(a=="plr"){var q=plCalc();if(q){var mem=[];q.G.forEach(function(g){if(g.on)g.m.forEach(function(t){mem.push(t)})});
    var old=mem.map(function(t){return{t:t,d:t.date,af:t.af,ag:t.ag}}),ids2={};mem.forEach(function(t){ids2[t.id]=1});
    mem.forEach(function(t){if(t.af&&!ids2[t.af]){t.af="";t.ag=0}t.date=addd(iso(new Date()),1)});plsel={};save();var k=mem.length;
    setTimeout(function(){toast("⟦{0} tâches reportées à demain · Annuler|"+k+"⟧",function(){old.forEach(function(o){o.t.date=o.d;o.t.af=o.af;o.t.ag=o.ag});save();render()})},80)}return true}
  if(a=="pls"){var q2=plCalc();if(q2){var old2=q2.sh.map(function(t){return{t:t,d:t.dur}});q2.sh.forEach(function(t){t.dur=plShort(t.dur)});save();
    setTimeout(function(){toast("⟦Séances raccourcies · Annuler⟧",function(){old2.forEach(function(o){o.t.dur=o.d});save();render()})},80)}return true}
  if(a=="softn"){S.softno=iso(new Date());save();return true}
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
var WDN={dimanche:0,lundi:1,mardi:2,mercredi:3,jeudi:4,vendredi:5,samedi:6,sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,domingo:0,lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6},
  DYN={"aujourd'hui":0,"aujourd’hui":0,today:0,hoy:0,demain:1,tomorrow:1,manana:1,"apres-demain":2};
function nz(s){return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
function qaObj(v){var o={title:"",start:"",dur:30,pri:2,date:cur,cat:"",note:"",pb:"",af:"",ag:0},td=iso(new Date()),w=[],cs=typeof CATS!="undefined"?CATS:Object.keys(CATC);
  String(v).split(/\s+/).forEach(function(k){var n=nz(k).replace(/[.,;]+$/,"");
    if(/^!+$/.test(n)){o.pri=1;return}
    if(n.charAt(0)=="#"&&n.length>1){var c=cs.filter(function(y){return nz(y).indexOf(n.slice(1))==0})[0];if(c){o.cat=c;return}}
    if(DYN.hasOwnProperty(n)){o.date=addd(td,DYN[n]);return}
    if(WDN.hasOwnProperty(n)){o.date=addd(td,(WDN[n]-new Date().getDay()+7)%7||7);return}
    w.push(k)});
  o.title=w.join(" ")||String(v);qp(o);return o}
function qaPut(o){var r;if(o.start){r=Object.assign({id:uid(),st:""},o);S.tasks.push(r)}
  else{S.nt=S.nt||[];r={id:uid(),nt:1,title:o.title,dur:o.dur,date:o.date,pri:o.pri,cat:o.cat};S.nt.push(r)}save();return r}
function dlab(d){return parse(d).toLocaleDateString(LOC,{weekday:"short",day:"numeric",month:"short"})}
function qaAdd(){var i=document.getElementById("qa"),v=((i&&i.value)||"").trim();if(!v)return;
  var o=qaObj(v),r=qaPut(o),m=r.nt?"⟦Ajoutée à « Sans heure précise » · Annuler⟧":o.date!=cur?"⟦Tâche ajoutée le {0} à {1} · Annuler|"+dlab(o.date)+"|"+fmt(mins(o.start))+"⟧":"⟦Tâche ajoutée à {0} · Annuler|"+fmt(mins(o.start))+"⟧";
  setTimeout(function(){toast(m,function(){S.tasks=S.tasks.filter(function(t){return t.id!=r.id});S.nt=(S.nt||[]).filter(function(t){return t.id!=r.id});save();render()})},80)}
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

/* ===== Tâches sans heure, planifier ma journée, import de liste ===== */
var imo=0;
X("Sans heure précise","No set time","Sin hora fija");
X("Placer","Place","Colocar");
X("Ajoutée à « Sans heure précise ». Touche Placer pour lui donner un créneau.","Added to “No set time”. Tap Place to give it a slot.","Añadida a «Sin hora fija». Toca Colocar para darle un hueco.");
X("Placée à {0}","Placed at {0}","Colocada a las {0}");
X("Journée chargée","Busy day","Día cargado");
X("{0} prévues, {1} disponibles aujourd’hui.","{0} planned, {1} left today.","{0} previstas, {1} disponibles hoy.");
X("Reporter à demain : {0}","Move to tomorrow: {0}","Pasar a mañana: {0}");
X("Reporter {0} tâches à demain","Move {0} tasks to tomorrow","Pasar {0} tareas a mañana");
X("{0} tâches reportées à demain","{0} tasks moved to tomorrow","{0} tareas pasadas a mañana");
X("Garder tel quel","Keep as is","Dejar así");
X("Importer une liste","Import a list","Importar una lista");
X("Colle une tâche par ligne. L’heure et la durée sont reconnues (ex. Appeler Marc 14h 30 min). Sans heure, la tâche va dans « Sans heure précise ».","Paste one task per line. Time and duration are recognised (e.g. Call Marc 2pm 30 min). With no time, the task goes to “No set time”.","Pega una tarea por línea. Se reconocen la hora y la duración (p. ej. Llamar a Marc 14h 30 min). Sin hora, la tarea va a «Sin hora fija».");
X("Importer","Import","Importar");
X("{0} tâches importées","{0} tasks imported","{0} tareas importadas");
var plsel={},ntpo=0,imtx="",imv=[];
function freeSlot(d,dur,mn){var td=iso(new Date()),n=new Date(),from=Math.max(mn||0,d==td?Math.ceil((n.getHours()*60+n.getMinutes()+1)/15)*15:480),
  L=day(d).filter(function(t){return t.dur}).map(function(t){return[mins(t.start),mins(t.start)+t.dur]});
  for(var s=from;s+dur<=1380;s+=15){if(!L.some(function(r){return s<r[1]&&s+dur>r[0]}))return s}
  return Math.max(0,Math.min(from,1380-dur))}
function ntList(){var td=iso(new Date());return(S.nt||[]).filter(function(q){return q.date==cur||(cur==td&&q.date<td)})}
function ntHTML(){var l=ntList();if(!l.length)return"";
  return'<div class="card nt"><b>📋 ⟦Sans heure précise⟧ ('+l.length+')</b>'+l.map(function(q){var op=ntpo==q.id;
    return'<div class="od"><span class="odt">'+esc(q.title)+(q.dur?' <span class="mut">'+dl(q.dur)+'</span>':"")+(q.pri==1?' <span class="mut">!</span>':"")+(q.cat?' <span class="mut">'+dot(q.cat)+esc(q.cat)+'</span>':"")+'</span><span><button data-act="ntp" data-id="'+q.id+'" class="'+(op?"on":"")+'">⟦Placer…⟧</button><button data-act="ntd" data-id="'+q.id+'" aria-label="⟦Terminée⟧">✓</button><button data-act="ntx" data-id="'+q.id+'" aria-label="⟦Supprimer⟧">✕</button></span></div>'+
    (op?'<div class="tools" style="margin:2px 0 8px"><button data-act="ntw" data-k="e" data-id="'+q.id+'">⟦Au plus tôt⟧</button><button data-act="ntw" data-k="a" data-id="'+q.id+'">⟦Cet après-midi⟧</button><button data-act="ntw" data-k="s" data-id="'+q.id+'">⟦Ce soir⟧</button><input type="time" id="ntt'+q.id+'" aria-label="⟦Heure⟧"><button data-act="ntt" data-id="'+q.id+'">OK</button></div>':"")}).join("")+'</div>'}
function ntPlace(it,s){S.nt=S.nt.filter(function(q){return q.id!=it.id});ntpo=0;
  S.tasks.push({id:uid(),st:"",title:it.title,start:hhmm(s),dur:it.dur||30,pri:it.pri||2,date:cur,cat:it.cat||"",note:"",pb:"",af:"",ag:0});save();setTimeout(function(){toast("⟦Placée à {0}|"+fmt(s)+"⟧")},80)}
function plCalc(){var td=iso(new Date());if(cur!=td||S.plz==td)return null;var n=new Date(),nm=n.getHours()*60+n.getMinutes();if(nm>=1020)return null;
  var P=day(td).filter(function(t){return!t.st}),av=1320-Math.max(nm,420),
    tot=P.reduce(function(s,t){return s+(t.dur||0)},0)+(S.nt||[]).filter(function(q){return q.date<=td}).length*30;
  if(tot<=av)return null;
  var ids={};P.forEach(function(t){ids[t.id]=1});
  var mv=function(t){return!t.tp&&!t.gl};
  var kids=function(r){var o=[],q=[r.id];while(q.length){var c=q.shift();P.forEach(function(t){if(t.af==c&&mv(t)){o.push(t);q.push(t.id)}})}return o};
  var G=P.filter(function(t){return mv(t)&&t.dur&&!(t.af&&ids[t.af])}).map(function(r){var m=[r].concat(kids(r));return{r:r,m:m,d:m.reduce(function(s,t){return s+(t.dur||0)},0)}});
  G.sort(function(a,b){return b.r.pri-a.r.pri||mins(b.r.start)-mins(a.r.start)});
  var left=tot;G.forEach(function(g){g.sg=left>av;if(g.sg)left-=g.d});
  var sel=0,cnt=0;G.forEach(function(g){g.on=plsel[g.r.id]===undefined?g.sg:plsel[g.r.id];if(g.on){sel+=g.d;cnt+=g.m.length}});
  var sh=P.filter(function(t){return(t.tp||t.gl)&&t.dur>=30}),sv=sh.reduce(function(s,t){return s+t.dur-plShort(t.dur)},0);
  return{tot:tot,av:av,G:G,sel:sel,cnt:cnt,after:tot-sel,sh:sh,sv:sv}}
function plShort(d){return Math.max(15,Math.round(d/10)*5)}
function plHTML(){var q=plCalc();if(!q)return"";
  var h='<div class="card sug">⚖️ <b>⟦Journée chargée⟧</b><div class="mut">⟦{0} prévues, {1} disponibles aujourd’hui.|'+dl(q.tot)+'|'+dl(q.av)+'⟧</div>';
  if(q.G.length){h+='<div class="mut">⟦Coche ce qui peut attendre à demain :⟧</div>'+q.G.map(function(g){return'<label class="chk full"><input type="checkbox" data-act="plt" data-id="'+g.r.id+'"'+(g.on?" checked":"")+'> '+esc(g.r.title)+(g.m.length>1?" +"+(g.m.length-1):"")+' <span class="mut">'+dl(g.d)+'</span></label>'}).join("");
    h+='<div class="mut">⟦Après le report : {0} prévues.|'+dl(q.after)+'⟧</div>'}
  else h+='<div class="mut">⟦Rien à reporter automatiquement : les tâches restantes sont répétées, liées à un objectif ou sans durée. On ne les déplace pas, pour garder tes séries et ta progression justes. Tu peux en décaler ou en supprimer à la main.⟧</div>';
  h+='<div class="tools" style="margin:6px 0 0">'+(q.cnt?'<button data-act="plr" class="on">⟦'+(q.cnt>1?"Reporter {0} tâches à demain":"Reporter 1 tâche à demain")+'|'+q.cnt+'⟧</button>':"")+(q.sv>=15&&q.after>q.av?'<button data-act="pls">⟦Raccourcir mes séances répétées (−{0})|'+dl(q.sv)+'⟧</button>':"")+'<button data-act="plk">⟦Garder tel quel⟧</button></div></div>';return h}
function imPrev(){var td=iso(new Date());return imv.map(function(o){return'<div class="od"><span class="odt"><b>'+esc(o.title)+'</b> <span class="mut">'+(o.date!=td?dlab(o.date)+" · ":"")+(o.start?fmt(mins(o.start)):"⟦Sans heure précise⟧")+" · "+dl(o.dur)+(o.pri==1?" · !":"")+(o.cat?" · "+esc(o.cat):"")+'</span></span></div>'}).join("")}
function imSheet(){if(!imo)return"";
  var h='<div class="shd" data-act="imx"></div><div class="sheet mvh" role="dialog" aria-modal="true"><b class="full">📥 ⟦Importer une liste⟧</b>';
  if(imo==2)return h+'<div class="full">'+imPrev()+'</div><div class="tools full" style="margin:4px 0 0"><button data-act="img" class="on">⟦'+(imv.length>1?"Importer {0} tâches":"Importer 1 tâche")+'|'+imv.length+'⟧</button><button data-act="imb">⟦Modifier⟧</button><button data-act="imx" class="ghost">⟦Fermer⟧</button></div></div>';
  return h+'<div class="mut full">⟦Colle une tâche par ligne. Tu peux écrire l’heure, la durée, un jour (demain, lundi), ! pour haute priorité et #catégorie. Sans heure, la tâche va dans « Sans heure précise ».⟧</div><textarea class="full" id="iml" rows="7">'+esc(imtx)+'</textarea><div class="tools full" style="margin:4px 0 0"><button data-act="imp" class="on">⟦Aperçu⟧</button><button data-act="imx" class="ghost">⟦Fermer⟧</button></div></div>'}
function softHTML(){var td=iso(new Date());if(cur!=td||S.soft||obNeed()||(S.softno&&S.softno>addd(td,-14)))return"";
  var k=0;for(var d=1;d<=4;d++){var l=S.tasks.filter(function(t){return t.date==addd(td,-d)});if(l.length&&!l.some(function(t){return t.st=="done"}))k++}
  return k>=3?'<div class="card sug">🌿 ⟦Les derniers jours ont été difficiles, et c’est normal. Le mode doux cache les retards et les séries pour repartir sans pression.⟧ <button data-act="soft" class="on">⟦Activer le mode doux⟧</button> <button data-act="softn">⟦Non merci⟧</button></div>':""}

/* ===== Boutons ⓘ d’aide ===== */
var INF=[["En retard", "Les tâches des 7 derniers jours que tu n’as pas terminées. « Aujourd’hui » les ramène à aujourd’hui, ✓ les marque faites, « Ignorer » les classe comme arrêtées."], ["À reprendre", "Les tâches des 7 derniers jours que tu n’as pas terminées. « Aujourd’hui » les ramène à aujourd’hui, ✓ les marque faites, « Ignorer » les classe comme arrêtées."], ["Habitudes", "Les tâches que tu fais plusieurs jours de suite. Le nombre indique ta série en cours. Si le rythme casse, l’app te le signale pour que tu reprennes vite."], ["Série", "Le nombre de jours d’affilée où tu as terminé au moins une tâche. La meilleure série garde ton record."], ["Priorité du jour", "Choisis la seule tâche à ne pas rater aujourd’hui. Elle reste mise en avant en haut de ta journée."], ["Sans heure précise", "Des tâches sans horaire. Touche « Placer » puis choisis : au plus tôt, cet après-midi, ce soir ou une heure précise. ✓ les marque faites, ✕ les supprime."], ["Journée chargée", "Tes tâches restantes durent plus que le temps qu’il te reste aujourd’hui. Coche celles qui peuvent attendre à demain. Les tâches répétées et celles d’un objectif ne sont jamais déplacées, mais tu peux raccourcir tes séances."], ["Bilan de la semaine", "Un court point chaque semaine : ce qui a marché et une intention pour la suivante. Il apparaît aussi dans l’onglet Bilan."], ["Ce que montrent tes chiffres", "Des conseils tirés de tes 28 derniers jours : ton meilleur moment pour finir des tâches et l’effet de leur durée. Il faut environ 12 tâches."], ["Objectifs", "Un objectif a une date, une cible et des activités qui se répètent chaque semaine. Elles créent des tâches dans ta journée, et la progression avance quand tu les termines."], ["Jalons", "Des étapes importantes avec une date, pour suivre l’avancement de l’objectif. Coche-les quand elles sont faites."], ["Ton pourquoi", "La raison profonde de cet objectif. L’app te la rappelle quand tu n’as pas envie de commencer."], ["Jour par jour", "Un résumé de chaque jour de la période : tâches terminées sur tâches prévues."], ["Moments de la journée", "La répartition de tes tâches selon le moment de la journée."], ["Raisons d’interruption", "Les raisons que tu notes quand tu interromps ou arrêtes une tâche. Elles aident à repérer ce qui revient souvent."], ["Style", "Change les couleurs de l’application."], ["Mode", "Clair, sombre, ou automatique selon ton appareil."], ["Confort", "Le mode doux cache « Heure passée », les séries et les rappels de retard. La taille du texte agrandit toute l’app."], ["Données", "Sauvegarder crée un fichier avec toutes tes tâches, Restaurer le recharge. Le .ics va dans ton calendrier. Nettoyer les doublons supprime les tâches identiques."], ["Rappels", "Les rappels fonctionnent quand l’app est ouverte. Ils ne sont pas garantis en arrière-plan."], ["Outils", "Corbeille : retrouver une tâche supprimée. Routines : placer plusieurs tâches enchaînées. Décaler la suite : repousser les tâches pas commencées. Importer : créer plusieurs tâches d’un coup."], ["Installer l’app", "Ajoute Élan à ton écran d’accueil pour l’ouvrir comme une vraie application."], ["Routines", "Une routine est une suite de tâches enchaînées. Place-la sur un jour et tout s’aligne tout seul."], ["Décaler la suite", "Décale d’un coup les tâches qui n’ont pas encore commencé. Les tâches liées suivent."], ["Corbeille", "Les tâches supprimées sont gardées 30 jours. Tu peux les restaurer."], ["Importer une liste", "Colle une tâche par ligne. L’heure, la durée, un jour (demain, lundi), ! pour haute priorité et #catégorie sont reconnus. Un aperçu s’affiche avant d’importer."], ["Bilan du soir", "Quelques lignes dans le journal pour clore la journée : ce qui a marché, ce qui a manqué, demain."], ["J’ai du mal", "Dis pourquoi tu n’y arrives pas : l’app te propose une citation, ton pourquoi et un plan plus petit."], ["Journal", "Quelques lignes pour noter ta journée. Elles servent aussi au bilan du soir."], ["Affichage", "Des options pour trier et filtrer ce que tu vois dans la journée."]];
X("Les tâches des 7 derniers jours que tu n’as pas terminées. « Aujourd’hui » les ramène à aujourd’hui, ✓ les marque faites, « Ignorer » les classe comme arrêtées.","Tasks from the last 7 days that you did not finish. “Today” brings them to today, ✓ marks them done, “Ignore” sets them as stopped.","Tareas de los últimos 7 días que no terminaste. «Hoy» las trae a hoy, ✓ las marca hechas, «Ignorar» las deja como detenidas.");
X("Les tâches que tu fais plusieurs jours de suite. Le nombre indique ta série en cours. Si le rythme casse, l’app te le signale pour que tu reprennes vite.","Tasks you do several days in a row. The number is your current streak. If the rhythm breaks, the app tells you so you can pick it up quickly.","Tareas que haces varios días seguidos. El número es tu racha actual. Si el ritmo se rompe, la app te avisa para retomarlo pronto.");
X("Le nombre de jours d’affilée où tu as terminé au moins une tâche. La meilleure série garde ton record.","The number of days in a row with at least one finished task. Best streak keeps your record.","Los días seguidos con al menos una tarea terminada. La mejor racha guarda tu récord.");
X("Choisis la seule tâche à ne pas rater aujourd’hui. Elle reste mise en avant en haut de ta journée.","Pick the one task you must not miss today. It stays highlighted at the top of your day.","Elige la única tarea que no debes perder hoy. Queda destacada arriba en tu día.");
X("Des tâches sans horaire. Touche « Placer » puis choisis : au plus tôt, cet après-midi, ce soir ou une heure précise. ✓ les marque faites, ✕ les supprime.","Tasks with no set time. Tap “Place” then choose: earliest, this afternoon, this evening or a set time. ✓ marks them done, ✕ deletes them.","Tareas sin hora fija. Toca «Colocar» y elige: lo antes posible, esta tarde, esta noche o una hora concreta. ✓ las marca hechas, ✕ las borra.");
X("Tes tâches restantes durent plus que le temps qu’il te reste aujourd’hui. Coche celles qui peuvent attendre à demain. Les tâches répétées et celles d’un objectif ne sont jamais déplacées, mais tu peux raccourcir tes séances.","Your remaining tasks take longer than the time you have left today. Tick the ones that can wait until tomorrow. Repeating tasks and goal tasks are never moved, but you can shorten your sessions.","Tus tareas restantes duran más que el tiempo que te queda hoy. Marca las que pueden esperar a mañana. Las tareas repetidas y las de un objetivo nunca se mueven, pero puedes acortar tus sesiones.");
X("Un court point chaque semaine : ce qui a marché et une intention pour la suivante. Il apparaît aussi dans l’onglet Bilan.","A short check-in each week: what worked and an intention for the next one. It also appears in the Review tab.","Un breve repaso cada semana: lo que funcionó y una intención para la siguiente. También aparece en la pestaña Balance.");
X("Des conseils tirés de tes 28 derniers jours : ton meilleur moment pour finir des tâches et l’effet de leur durée. Il faut environ 12 tâches.","Tips drawn from your last 28 days: your best time to finish tasks and the effect of their length. About 12 tasks are needed.","Consejos de tus últimos 28 días: tu mejor momento para terminar tareas y el efecto de su duración. Hacen falta unas 12 tareas.");
X("Un objectif a une date, une cible et des activités qui se répètent chaque semaine. Elles créent des tâches dans ta journée, et la progression avance quand tu les termines.","A goal has a date, a target and activities that repeat every week. They create tasks in your day, and progress moves forward as you finish them.","Un objetivo tiene una fecha, una meta y actividades que se repiten cada semana. Crean tareas en tu día y el progreso avanza al terminarlas.");
X("Des étapes importantes avec une date, pour suivre l’avancement de l’objectif. Coche-les quand elles sont faites.","Important steps with a date to follow the goal’s progress. Tick them when done.","Etapas importantes con fecha para seguir el avance del objetivo. Márcalas al terminarlas.");
X("La raison profonde de cet objectif. L’app te la rappelle quand tu n’as pas envie de commencer.","The deeper reason for this goal. The app reminds you of it when you don’t feel like starting.","La razón profunda de este objetivo. La app te la recuerda cuando no te apetece empezar.");
X("Un résumé de chaque jour de la période : tâches terminées sur tâches prévues.","A summary of each day in the period: finished tasks out of planned ones.","Un resumen de cada día del periodo: tareas terminadas sobre las previstas.");
X("La répartition de tes tâches selon le moment de la journée.","How your tasks are spread across the time of day.","El reparto de tus tareas según el momento del día.");
X("Les raisons que tu notes quand tu interromps ou arrêtes une tâche. Elles aident à repérer ce qui revient souvent.","The reasons you note when you interrupt or stop a task. They help you spot what keeps coming back.","Los motivos que anotas al interrumpir o detener una tarea. Ayudan a ver lo que se repite.");
X("Change les couleurs de l’application.","Changes the app’s colours.","Cambia los colores de la aplicación.");
X("Clair, sombre, ou automatique selon ton appareil.","Light, dark, or automatic depending on your device.","Claro, oscuro o automático según tu dispositivo.");
X("Le mode doux cache « Heure passée », les séries et les rappels de retard. La taille du texte agrandit toute l’app.","Gentle mode hides “Time passed”, streaks and overdue reminders. Text size enlarges the whole app.","El modo suave oculta «Hora pasada», las rachas y los avisos de retraso. El tamaño del texto agranda toda la app.");
X("Sauvegarder crée un fichier avec toutes tes tâches, Restaurer le recharge. Le .ics va dans ton calendrier. Nettoyer les doublons supprime les tâches identiques.","Back up creates a file with all your tasks, Restore reloads it. The .ics goes into your calendar. Clean duplicates removes identical tasks.","Guardar crea un archivo con todas tus tareas, Restaurar lo recarga. El .ics va a tu calendario. Limpiar duplicados quita las tareas idénticas.");
X("Les rappels fonctionnent quand l’app est ouverte. Ils ne sont pas garantis en arrière-plan.","Reminders work while the app is open. They are not guaranteed in the background.","Los recordatorios funcionan con la app abierta. No están garantizados en segundo plano.");
X("Corbeille : retrouver une tâche supprimée. Routines : placer plusieurs tâches enchaînées. Décaler la suite : repousser les tâches pas commencées. Importer : créer plusieurs tâches d’un coup.","Trash: get back a deleted task. Routines: place several chained tasks. Shift the rest: push back tasks not started. Import: create several tasks at once.","Papelera: recuperar una tarea borrada. Rutinas: colocar varias tareas encadenadas. Desplazar el resto: retrasar las tareas sin empezar. Importar: crear varias tareas a la vez.");
X("Ajoute Élan à ton écran d’accueil pour l’ouvrir comme une vraie application.","Add Élan to your home screen to open it like a real app.","Añade Élan a tu pantalla de inicio para abrirla como una app de verdad.");
X("Une routine est une suite de tâches enchaînées. Place-la sur un jour et tout s’aligne tout seul.","A routine is a set of chained tasks. Add it to a day and everything lines up by itself.","Una rutina es una serie de tareas encadenadas. Colócala en un día y todo se alinea solo.");
X("Décale d’un coup les tâches qui n’ont pas encore commencé. Les tâches liées suivent.","Shifts all tasks that have not started yet. Linked tasks follow.","Desplaza de golpe las tareas que aún no han empezado. Las tareas enlazadas las siguen.");
X("Les tâches supprimées sont gardées 30 jours. Tu peux les restaurer.","Deleted tasks are kept for 30 days. You can restore them.","Las tareas borradas se guardan 30 días. Puedes restaurarlas.");
X("Colle une tâche par ligne. L’heure, la durée, un jour (demain, lundi), ! pour haute priorité et #catégorie sont reconnus. Un aperçu s’affiche avant d’importer.","Paste one task per line. Time, duration, a day (tomorrow, monday), ! for high priority and #category are recognised. A preview is shown before importing.","Pega una tarea por línea. Se reconocen la hora, la duración, un día (mañana, lunes), ! para prioridad alta y #categoría. Se muestra una vista previa antes de importar.");
X("Quelques lignes dans le journal pour clore la journée : ce qui a marché, ce qui a manqué, demain.","A few lines in the journal to close the day: what worked, what was missed, tomorrow.","Unas líneas en el diario para cerrar el día: lo que funcionó, lo que faltó, mañana.");
X("Dis pourquoi tu n’y arrives pas : l’app te propose une citation, ton pourquoi et un plan plus petit.","Say why it’s hard: the app offers a quote, your why and a smaller plan.","Di por qué te cuesta: la app te propone una cita, tu porqué y un plan más pequeño.");
X("Quelques lignes pour noter ta journée. Elles servent aussi au bilan du soir.","A few lines to note your day. They also feed the evening review.","Unas líneas para anotar tu día. También sirven para el balance de la noche.");
X("Des options pour trier et filtrer ce que tu vois dans la journée.","Options to sort and filter what you see in the day.","Opciones para ordenar y filtrar lo que ves en el día.");
X("Aide","Help","Ayuda");
var ifo=-1;
function infInject(){var v=document.getElementById("v");if(!v)return;
  var els=v.querySelectorAll("b,.sec,.odh>span:first-child,.mut"),ix=INF.map(function(r){return tr(r[0])});
  Array.prototype.forEach.call(els,function(el){if(el.closest(".inf")||el.querySelector("b,button"))return;
    var t=(el.textContent||"").trim();if(!t||t.length>48)return;
    for(var i=0;i<INF.length;i++){var m=ix[i];if(t.indexOf(m)>-1&&t.length<=m.length+14){
      var a=el.closest("button")||el;if(el.querySelector(".ib")||(a.nextElementSibling&&a.nextElementSibling.className=="ib"))return;
      var fm=!!el.closest("#f");if(fm&&el.tagName=="B")a=el;a.insertAdjacentHTML(fm&&el.tagName=="B"?"beforeend":"afterend",'<button type="button" class="ib" data-act="'+(fm?"infi":"inf")+'" data-k="'+i+'" aria-label="'+tr("Aide")+' : '+m.replace(/"/g,"")+'">ⓘ</button>');return}}})}
function infSheet(){if(ifo<0||!INF[ifo])return"";var r=INF[ifo];
  return'<div class="shd" data-act="infx"></div><div class="sheet mvh inf" role="dialog" aria-modal="true"><b class="full">ⓘ '+esc(tr(r[0]))+'</b><div class="full">⟦'+r[1]+'⟧</div><div class="tools full" style="margin:4px 0 0"><button data-act="infx" class="ghost">⟦Fermer⟧</button></div></div>'}

/* ===== Ajouts : aperçu, annuler, formulaire ===== */
X("Tâche ajoutée à {0} · Annuler","Task added at {0} · Undo","Tarea añadida a las {0} · Deshacer");
X("Tâche ajoutée le {0} à {1} · Annuler","Task added on {0} at {1} · Undo","Tarea añadida el {0} a las {1} · Deshacer");
X("Ajoutée à « Sans heure précise » · Annuler","Added to “No set time” · Undo","Añadida a «Sin hora fija» · Deshacer");
X("{0} tâches importées · Annuler","{0} tasks imported · Undo","{0} tareas importadas · Deshacer");
X("{0} tâches reportées à demain · Annuler","{0} tasks moved to tomorrow · Undo","{0} tareas pasadas a mañana · Deshacer");
X("Séances raccourcies · Annuler","Sessions shortened · Undo","Sesiones acortadas · Deshacer");
X("Au plus tôt","Earliest","Lo antes posible");
X("Cet après-midi","This afternoon","Esta tarde");
X("Heure","Time","Hora");
X("Coche ce qui peut attendre à demain :","Tick what can wait until tomorrow:","Marca lo que puede esperar a mañana:");
X("Après le report : {0} prévues.","After moving: {0} planned.","Tras el cambio: {0} previstas.");
X("Reporter 1 tâche à demain","Move 1 task to tomorrow","Pasar 1 tarea a mañana");
X("Reporter {0} tâches à demain","Move {0} tasks to tomorrow","Pasar {0} tareas a mañana");
X("Raccourcir mes séances répétées (−{0})","Shorten my repeating sessions (−{0})","Acortar mis sesiones repetidas (−{0})");
X("Importer 1 tâche","Import 1 task","Importar 1 tarea");
X("Importer {0} tâches","Import {0} tasks","Importar {0} tareas");
X("Aperçu","Preview","Vista previa");
X("Colle une tâche par ligne. Tu peux écrire l’heure, la durée, un jour (demain, lundi), ! pour haute priorité et #catégorie. Sans heure, la tâche va dans « Sans heure précise ».","Paste one task per line. You can write the time, duration, a day (tomorrow, monday), ! for high priority and #category. With no time, the task goes to “No set time”.","Pega una tarea por línea. Puedes escribir la hora, la duración, un día (mañana, lunes), ! para prioridad alta y #categoría. Sin hora, la tarea va a «Sin hora fija».");
X("Les derniers jours ont été difficiles, et c’est normal. Le mode doux cache les retards et les séries pour repartir sans pression.","The last few days were hard, and that’s okay. Gentle mode hides overdue items and streaks so you can restart without pressure.","Los últimos días fueron difíciles, y es normal. El modo suave oculta los retrasos y las rachas para retomar sin presión.");
X("Activer le mode doux","Turn on gentle mode","Activar el modo suave");
X("Non merci","No thanks","No, gracias");
INF.push(["Nouvelle tâche", "Titre : tu peux écrire l’heure et la durée directement (ex. Étude 14h 2h).\nHeure précise : une tâche sans durée, comme un réveil.\nRépéter : choisis les jours où elle revient chaque semaine.\nEnchaîner après : elle démarre quand l’autre finit et la suit si elle bouge.\nPause avant : un temps libre avant de commencer.\nNotes : une ligne « - texte » crée une sous-tâche à cocher.\nPlan B : ce que tu feras si c’est trop dur."],["Modifier la tâche", "Titre : tu peux écrire l’heure et la durée directement (ex. Étude 14h 2h).\nHeure précise : une tâche sans durée, comme un réveil.\nRépéter : choisis les jours où elle revient chaque semaine.\nEnchaîner après : elle démarre quand l’autre finit et la suit si elle bouge.\nPause avant : un temps libre avant de commencer.\nNotes : une ligne « - texte » crée une sous-tâche à cocher.\nPlan B : ce que tu feras si c’est trop dur."],["Répéter les :", "Coche les jours où cette tâche doit revenir chaque semaine. Une tâche répétée n’est jamais déplacée par « Journée chargée »."]);
X("Titre : tu peux écrire l’heure et la durée directement (ex. Étude 14h 2h).\nHeure précise : une tâche sans durée, comme un réveil.\nRépéter : choisis les jours où elle revient chaque semaine.\nEnchaîner après : elle démarre quand l’autre finit et la suit si elle bouge.\nPause avant : un temps libre avant de commencer.\nNotes : une ligne « - texte » crée une sous-tâche à cocher.\nPlan B : ce que tu feras si c’est trop dur.","Title: you can type the time and duration directly (e.g. Study 2pm 2h).\nExact time: a task with no duration, like a wake-up.\nRepeat: pick the days it comes back every week.\nChain after: it starts when the other one ends and follows it if it moves.\nBreak before: free time before starting.\nNotes: a line “- text” creates a checkable subtask.\nPlan B: what you’ll do if it’s too hard.","Título: puedes escribir la hora y la duración directamente (p. ej. Estudio 14h 2h).\nHora exacta: una tarea sin duración, como despertarse.\nRepetir: elige los días en que vuelve cada semana.\nEncadenar después: empieza cuando termina la otra y la sigue si se mueve.\nPausa antes: tiempo libre antes de empezar.\nNotas: una línea «- texto» crea una subtarea para marcar.\nPlan B: lo que harás si es demasiado difícil.");X("Coche les jours où cette tâche doit revenir chaque semaine. Une tâche répétée n’est jamais déplacée par « Journée chargée ».","Tick the days this task should come back every week. A repeating task is never moved by “Busy day”.","Marca los días en que esta tarea debe volver cada semana. Una tarea repetida nunca se mueve con «Día cargado».");
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=infi]");if(!b)return;e.preventDefault();
  var f=b.closest("#f");if(!f)return;var ex=f.querySelector(".ibx"),same=ex&&ex.dataset.k==b.dataset.k;if(ex)ex.remove();if(same)return;
  var d=document.createElement("div");d.className="mut full ibx";d.dataset.k=b.dataset.k;d.textContent=mk("⟦"+INF[+b.dataset.k][1]+"⟧");(b.closest("div.full")||b.closest("b")||b).insertAdjacentElement("afterend",d)});
X("Placer…","Place…","Colocar…");
