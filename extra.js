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
  else if(obs==1)h+='<b class="full">⟦Bienvenue dans Élan⟧</b>'+["⏱ Une tâche, c’est une heure, une durée et une priorité.","💪 Quand ça coince, touche « J’ai du mal » : une citation, ton pourquoi et un plan B.","🔗 Les tâches liées s’enchaînent toutes seules.","📊 Le bilan montre ce qui marche pour toi.","💾 Tout reste sur ton appareil. Fais une sauvegarde de temps en temps (Réglages)."].map(function(x){return'<div class="full">⟦'+x+'⟧</div>'}).join("");
  else h+='<b class="full">⟦Par quoi veux-tu commencer ?⟧</b><div class="tools full" style="margin:0"><button data-act="obt">⟦➕ Ma première tâche⟧</button><button data-act="obg">⟦🎯 Mon premier objectif⟧</button><button data-act="obx">⟦Explorer d’abord⟧</button></div>';
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
  if(view!="d"||cur!=iso(new Date())||obNeed()||parse(cur).getDay()!=0||wrTop())return"";
  return'<div class="card sug">📝 ⟦C’est dimanche : prends 2 minutes pour faire le bilan de ta semaine.⟧ <button data-act="wr">⟦Faire le bilan⟧</button></div>'}
function xBil(){return wrCard()}
function xSet(){return'<div class="card"><b>⟦Accessibilité⟧</b><br><label for="fs">⟦Taille du texte⟧</label> <select id="fs">'+[["Normale"],["Grande"],["Très grande"]].map(function(x,i){return'<option value="'+i+'"'+((S.fs||0)==i?" selected":"")+'>⟦'+x[0]+'⟧</option>'}).join("")+'</select><br><a href="privacy.html">⟦Confidentialité⟧</a></div>'}
function xHTML(){return obHTML()+wrSheet()}
function xBusy(){var f=document.activeElement;return!!((f&&f.id=="jrn")||wro||(view=="d"&&obNeed()))}
function xAfter(){
  document.documentElement.style.fontSize=[100,112,125][S.fs||0]+"%";
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
  if(a=="wr"){wro=1;return true}
  if(a=="wrx"){wro=0;return true}
  if(a=="wrs"){var v=(document.getElementById("wrt")||{}).value||"";v=v.trim();S.wr=S.wr||{};if(v)S.wr[wrKey()]={t:v,d:iso(new Date())};else delete S.wr[wrKey()];wro=0;save();toast("⟦Enregistrer⟧ ✓");return true}
  return false}
document.addEventListener("change",function(e){if(e.target.id=="fs"){S.fs=+e.target.value;save();xAfter()}});
document.addEventListener("keydown",function(e){if(e.key=="Escape"){var x=document.querySelector(".shd");if(x)x.click()}});
