/* Élan — motivation : citations (stoïcisme, sagesse, spiritualité), « J'ai du mal », priorité du jour, bilan du soir.
   Les citations sont reformulées avec mes mots (paraphrases courtes) et chaque ligne cite sa source. */
var MVQ=[
/* [catégorie, tags, source FR, source EN, texte FR, texte EN]
   tags : t=fatigue, l=pas envie, d=découragement, o=trop de choses, s=démarrer, f=après un échec, h=temps, w=le pourquoi, e=bilan du soir */
["stoic","sl","Marc Aurèle, Pensées V, 1","Marcus Aurelius, Meditations V, 1","Au réveil, dis-toi : je me lève pour faire mon travail d’être humain.","On waking, tell yourself: I rise to do a human being’s work."],
["stoic","dfo","Marc Aurèle, Pensées V, 20","Marcus Aurelius, Meditations V, 20","Ce qui bloque l’action fait avancer l’action : l’obstacle devient le chemin.","What blocks the action advances the action: the obstacle becomes the way."],
["stoic","dos","Sénèque, Lettres à Lucilius, 13","Seneca, Letters to Lucilius, 13","Nous souffrons plus souvent en imagination que dans la réalité.","We suffer more often in imagination than in reality."],
["stoic","od","Épictète, Manuel, 1","Epictetus, Enchiridion, 1","Distingue ce qui dépend de toi de ce qui n’en dépend pas, et occupe-toi du premier.","Tell apart what is up to you from what is not, and deal with the first."],
["stoic","hl","Sénèque, De la brièveté de la vie, 1","Seneca, On the Shortness of Life, 1","Nous n’avons pas peu de temps : nous en perdons beaucoup.","We do not have little time: we waste a lot of it."],
["stoic","sw","Marc Aurèle, Pensées X, 16","Marcus Aurelius, Meditations X, 16","Cesse de débattre de ce que doit être une personne de bien. Deviens-en une.","Stop debating what a good person should be. Be one."],
["stoic","lsh","Épictète, Manuel, 51","Epictetus, Enchiridion, 51","Jusqu’à quand attendras-tu avant d’exiger le meilleur de toi-même ?","How long will you wait before demanding the best of yourself?"],
["stoic","dst","Sénèque, Lettres à Lucilius, 104","Seneca, Letters to Lucilius, 104","Ce n’est pas parce que c’est difficile qu’on n’ose pas : c’est parce qu’on n’ose pas que c’est difficile.","It is not because it is hard that we do not dare: it is because we do not dare that it is hard."],
["stoic","dt","Marc Aurèle, Pensées VI, 19","Marcus Aurelius, Meditations VI, 19","Ce qui est possible et convenable pour un être humain, considère que c’est à ta portée.","What is possible and proper for a human being, consider it within your reach."],
["stoic","h","Sénèque, Lettres à Lucilius, 1","Seneca, Letters to Lucilius, 1","Le temps est la seule chose qui soit vraiment à nous : réclame-le.","Time is the one thing that is truly ours: claim it."],
["stoic","t","Marc Aurèle, Pensées VI, 2","Marcus Aurelius, Meditations VI, 2","Fais ce que tu dois faire, qu’il fasse froid ou chaud, que tu sois fatigué ou reposé.","Do what you must, whether it is cold or warm, whether you are tired or rested."],
["stoic","f","Marc Aurèle, Pensées V, 9","Marcus Aurelius, Meditations V, 9","Si tu as failli, ne te dégoûte pas de toi : reviens à ta ligne et réjouis-toi d’agir le plus souvent ainsi.","If you have slipped, do not turn against yourself: return to your path and be glad to follow it most of the time."],
["stoic","e","Sénèque, De la colère, III, 36","Seneca, On Anger, III, 36","Chaque soir, examine ta journée : de quoi t’es-tu corrigé, à quoi as-tu résisté, en quoi es-tu meilleur ?","Each evening, review your day: what did you fix, what did you resist, how are you better?"],
["stoic","dfo","Épictète, Manuel, 5","Epictetus, Enchiridion, 5","Ce ne sont pas les choses qui nous troublent, mais l’idée que nous nous en faisons.","It is not things that trouble us, but our judgment about them."],
["wisdom","sh","Proverbe populaire","Popular proverb","Le meilleur moment pour planter un arbre était il y a vingt ans. Le deuxième meilleur, c’est maintenant.","The best time to plant a tree was twenty years ago. The second best time is now."],
["wisdom","fd","Proverbe japonais","Japanese proverb","Tomber sept fois, se relever huit.","Fall seven times, get up eight."],
["wisdom","os","Proverbe français","French proverb","Petit à petit, l’oiseau fait son nid.","Little by little, the bird builds its nest."],
["wisdom","lsw","Aristote, Éthique à Nicomaque, II, 1","Aristotle, Nicomachean Ethics, II, 1","C’est en agissant que l’on acquiert les qualités : on devient ce que l’on pratique.","We acquire qualities by acting: we become what we practise."],
["wisdom","df","Nietzsche, Crépuscule des idoles","Nietzsche, Twilight of the Idols","Ce qui ne me tue pas me rend plus fort.","What does not kill me makes me stronger."],
["wisdom","do","Proverbe populaire","Popular proverb","Rome ne s’est pas faite en un jour.","Rome was not built in a day."],
["wisdom","wdt","Nietzsche, Crépuscule des idoles","Nietzsche, Twilight of the Idols","Celui qui a un pourquoi peut supporter presque n’importe quel comment.","He who has a why can bear almost any how."],
["wisdom","o","Proverbe populaire","Popular proverb","Un éléphant se mange une bouchée à la fois.","You eat an elephant one bite at a time."],
["wisdom","dw","Hésiode, Les Travaux et les Jours","Hesiod, Works and Days","Devant la valeur, les dieux ont mis la sueur : le chemin est rude au début, puis il devient plus aisé.","The gods placed sweat before excellence: the road is rough at first, then it gets easier."],
["spirit","dt","Coran, 94:5-6","Quran, 94:5-6","Avec la difficulté vient la facilité.","With hardship comes ease."],
["spirit","od","Coran, 2:286","Quran, 2:286","Dieu ne charge une âme que selon sa capacité.","God does not burden a soul beyond its capacity."],
["spirit","slto","Hadith, Sahih al-Bukhari 6464","Hadith, Sahih al-Bukhari 6464","Les actes les plus aimés de Dieu sont les plus réguliers, même s’ils sont petits.","The deeds most loved by God are the most regular, even if small."],
["spirit","w","Hadith, Sahih al-Bukhari 1","Hadith, Sahih al-Bukhari 1","Les actes valent par leurs intentions.","Deeds are judged by their intentions."],
["spirit","fl","Coran, 13:11","Quran, 13:11","Dieu ne change pas la situation d’un peuple tant qu’il ne change pas ce qui est en lui.","God does not change a people’s condition until they change what is within themselves."],
["spirit","h","Bible, Ecclésiaste 3:1","Bible, Ecclesiastes 3:1","Il y a un temps pour tout, et un moment pour chaque chose sous le ciel.","There is a time for everything, and a season for every activity under heaven."],
["spirit","td","Bible, Galates 6:9","Bible, Galatians 6:9","Ne nous lassons pas de faire le bien : en son temps, nous récolterons si nous ne relâchons pas l’effort.","Let us not grow weary of doing good: in due time we will reap if we do not give up."],
["spirit","f","Bible, Proverbes 24:16","Bible, Proverbs 24:16","Le juste tombe sept fois, et il se relève.","The righteous falls seven times and rises again."],
["spirit","l","Bible, Proverbes 6:6","Bible, Proverbs 6:6","Va voir la fourmi, observe ses voies et deviens sage.","Go to the ant, consider her ways and be wise."],
["spirit","sw","Bible, Colossiens 3:23","Bible, Colossians 3:23","Quoi que tu fasses, fais-le de tout ton cœur.","Whatever you do, do it with all your heart."],
["spirit","t","Bible, Isaïe 40:31","Bible, Isaiah 40:31","Ceux qui espèrent renouvellent leurs forces.","Those who hope renew their strength."],
["spirit","sod","Bouddhisme, Dhammapada 122","Buddhism, Dhammapada 122","Goutte à goutte, la cruche se remplit : ne méprise pas les petits gestes.","Drop by drop the jar is filled: do not despise small acts."],
["spirit","ls","Bouddhisme, Dhammapada 276","Buddhism, Dhammapada 276","À toi de faire l’effort : les maîtres ne font qu’indiquer la voie.","The effort is yours to make: teachers only point the way."],
["spirit","dow","Hindouisme, Bhagavad-Gita 2:47","Hinduism, Bhagavad Gita 2:47","Tu as droit à l’action, pas à ses fruits : fais ta part sans t’attacher au résultat.","You are entitled to the action, not its fruits: do your part without clinging to the result."],
["spirit","lf","Hindouisme, Bhagavad-Gita 6:5","Hinduism, Bhagavad Gita 6:5","Élève-toi par toi-même ; ne te laisse pas abaisser.","Lift yourself by yourself; do not let yourself down."],
["spirit","odt","Judaïsme, Pirké Avot 2:16","Judaism, Pirkei Avot 2:16","Tu n’es pas tenu d’achever l’œuvre, mais tu n’es pas libre de t’y soustraire.","You are not obliged to finish the work, but you are not free to abandon it."],
["spirit","lsh","Judaïsme, Pirké Avot 1:14","Judaism, Pirkei Avot 1:14","Si ce n’est pas maintenant, quand ?","If not now, when?"],
["spirit","sod","Taoïsme, Tao-tö king 64","Taoism, Tao Te Ching 64","Un voyage de mille lieues commence par un seul pas.","A journey of a thousand miles begins with a single step."]];
var MVT=[
["Motivation","Motivation","Motivación"],["Citation du jour","Quote of the day","Cita del día"],["Stoïcisme","Stoicism","Estoicismo"],["Sagesse et vie","Wisdom and life","Sabiduría y vida"],["Spiritualité et religions","Spirituality and religions","Espiritualidad y religiones"],
["Citations reformulées en mes mots, avec la source indiquée.","Quotes are paraphrased, with the source shown.","Citas parafraseadas, con la fuente indicada."],
["Une autre citation","Another quote","Otra cita"],["Priorité du jour","Priority of the day","Prioridad del día"],["Choisis ta priorité","Pick your priority","Elige tu prioridad"],["Priorité accomplie. Bravo !","Priority done. Well done!","Prioridad cumplida. ¡Bien!"],
["Bilan du soir","Evening review","Balance de la noche"],["Qu’ai-je bien fait ? Qu’ai-je manqué ? Que ferai-je demain ?","What did I do well? What did I miss? What will I do tomorrow?","¿Qué hice bien? ¿Qué me faltó? ¿Qué haré mañana?"],["Écrire dans le journal","Write in the journal","Escribir en el diario"],
["J’ai du mal","I’m struggling","Me cuesta"],["Qu’est-ce qui coince ?","What’s in the way?","¿Qué te frena?"],["Fatigue","Tired","Cansancio"],["Pas envie","Don’t feel like it","Sin ganas"],["Découragé","Discouraged","Desanimado"],["Trop de choses","Too much","Demasiado"],
["Ton pourquoi","Your why","Tu porqué"],["Ton plan B","Your plan B","Tu plan B"],["Seulement 5 minutes","Just 5 minutes","Solo 5 minutos"],["Commence, tu pourras arrêter après.","Start, you can stop afterwards.","Empieza, luego puedes parar."],
["5 minutes écoulées : continue ou arrête-toi, c’est ton choix.","5 minutes are up: keep going or stop, your call.","Pasaron 5 minutos: sigue o para, tú decides."],["5 min","5 min","5 min"],
["Mon pourquoi (pour quoi je fais ça ?)","My why (what is this for?)","Mi porqué (¿para qué lo hago?)"],["Plan B : si c’est dur, je ferai…","Plan B: if it’s hard, I will…","Plan B: si cuesta, haré…"],
["Ne rate jamais deux fois de suite : reprends dès aujourd’hui.","Never miss twice in a row: restart today.","No falles dos veces seguidas: retoma hoy."],["Fermer","Close","Cerrar"]];
MVT.forEach(function(r){D.en[r[0]]=r[1];D.es[r[0]]=r[2]});
function mvOn(c){var m=S.mv||{};return m[c]!==0}
function mvHash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
/* Choisit une citation selon un tag ; stable pour un jour donné, change avec S.mvn */
function mvQuote(tag,seed){
  var on=MVQ.filter(function(q,i){q[6]=i;return mvOn(q[0])});if(!on.length)return null;
  var pool=on.filter(function(q){return !tag||q[1].indexOf(tag)>-1});if(!pool.length)pool=on;
  var q=pool[(mvHash(String(seed||iso(new Date()))+(tag||""))+(S.mvn||0))%pool.length];
  var x=typeof MXQ!="undefined"&&MXQ[LANG];return{c:q[0],a:LANG=="fr"?q[2]:q[3],t:LANG=="fr"?q[4]:(x&&x[q[6]])||q[5]}}
function mvQuoteHTML(q,cls){return q?'<div dir="auto" class="mvq'+(cls?" "+cls:"")+'"><div class="mvt">“'+esc(q.t)+'”</div><div class="mut mvs">— '+esc(q.a)+'</div></div>':""}
function mvPrio(td){var p=(S.pr||{})[td];return p&&find(p)?find(p):null}
/* Carte du jour : citation + priorité + bilan du soir */
function mvDayHTML(td,all){
  var h="",q=S.mv&&S.mv.day===0?null:mvQuote("",td);
  var pend=all.filter(function(t){return!t.st}),pr=mvPrio(td),hr=new Date().getHours();
  if(!q&&!all.length)return"";
  h+='<div class="card mvc">';
  if(q)h+=mvQuoteHTML(q)+'<div class="tools" style="margin:6px 0 0"><button data-act="mvn" aria-label="⟦Une autre citation⟧">↻ ⟦Une autre citation⟧</button></div>';
  if(all.length){h+='<div class="mvp"><b>⭐ ⟦Priorité du jour⟧</b> ';
    if(pr&&pr.st=="done")h+='<span class="mut">'+esc(pr.title)+' ✓ — ⟦Priorité accomplie. Bravo !⟧</span>';
    else h+='<select id="mvp"><option value="">⟦Choisis ta priorité⟧</option>'+pend.concat(pr&&pr.st?[pr]:[]).map(function(t){return'<option value="'+t.id+'"'+(pr&&pr.id==t.id?" selected":"")+'>'+fmt(mins(t.start))+" "+esc(t.title)+'</option>'}).join("")+'</select>';
    h+='</div>'}
  if(hr>=18&&all.length)h+='<div class="mvp"><b>🌙 ⟦Bilan du soir⟧</b><div class="mut">⟦Qu’ai-je bien fait ? Qu’ai-je manqué ? Que ferai-je demain ?⟧</div><div class="tools" style="margin:6px 0 0"><button data-act="mvb">⟦Écrire dans le journal⟧</button></div></div>';
  return h+'</div>'}
/* Fiche « J'ai du mal » */
function mvHelpHTML(){
  if(!hm)return"";var t=find(hm.id);if(!t)return"";var g=t.gl&&goalOf(t.gl),why=g&&g.why,rs=[["t","Fatigue"],["l","Pas envie"],["d","Découragé"],["o","Trop de choses"]],h='<div class="shd" data-act="hmx"></div><div class="sheet mvh"><b class="full">💪 ⟦J’ai du mal⟧ — '+esc(t.title)+'</b><div class="mut full">⟦Qu’est-ce qui coince ?⟧</div>'+(typeof tipHTML=="function"?tipHTML("hm"):"")+'<div class="tools full" style="margin:0">'+rs.map(function(r){return'<button data-act="hmr" data-k="'+r[0]+'" class="'+(hm.r==r[0]?"on":"")+'">⟦'+r[1]+'⟧</button>'}).join("")+'</div>';
  if(hm.r){h+='<div class="full">'+mvQuoteHTML(mvQuote(hm.r,t.id+hm.r))+'</div>';
    if(why)h+='<div class="full mvw"><b>⟦Ton pourquoi⟧</b> : '+esc(why)+'</div>';
    if(t.pb)h+='<div class="full mvw"><b>⟦Ton plan B⟧</b> : '+esc(t.pb)+'</div>';
    h+='<div class="tools full" style="margin:4px 0 0"><button data-act="hm5" data-id="'+t.id+'">⏱ ⟦Seulement 5 minutes⟧</button><button data-act="shift" data-k="30" data-id="'+t.id+'">⟦Décaler +30 min⟧</button><button data-act="shift" data-k="eve" data-id="'+t.id+'">⟦Ce soir⟧</button><button data-act="snz" data-id="'+t.id+'">⟦Reporter à demain⟧</button></div><div class="mut full">⟦Commence, tu pourras arrêter après.⟧</div>'}
  return h+'<button class="full ghost" data-act="hmx">⟦Fermer⟧</button></div>'}
function mvSetHTML(){var m=S.mv||{},b=function(k,l){var on=m[k]!==0;return'<button data-act="mvt" data-k="'+k+'" class="'+(on?"on":"")+'">'+(on?"✓ ":"")+"⟦"+l+"⟧</button>"};
  return'<div class="card"><b>⟦Motivation⟧</b><div class="tools">'+b("day","Citation du jour")+b("stoic","Stoïcisme")+b("wisdom","Sagesse et vie")+b("spirit","Spiritualité et religions")+'</div><span class="mut">⟦Citations reformulées en mes mots, avec la source indiquée.⟧</span></div>'}
/* Actions (appelé depuis le gestionnaire de clics de app.js) */
function mvAct(a,b,id,t){
  if(a=="mvt"){var k=b.dataset.k;S.mv=S.mv||{};S.mv[k]=S.mv[k]===0?1:0;save();return true}
  if(a=="mvn"){S.mvn=(S.mvn||0)+1;save();return true}
  if(a=="mvb"){jro=1;setTimeout(function(){var e=document.getElementById("jrn");if(e){e.scrollIntoView({block:"center",behavior:"smooth"});e.focus({preventScroll:true})}},60);return true}
  if(a=="hm"&&t){hm={id:id,r:""};opened=null;return true}
  if(a=="hmr"){if(hm)hm.r=b.dataset.k;return true}
  if(a=="hmx"){hm=null;return true}
  if(a=="hm5"&&t){hm=null;pm={work:1,mini:1,title:t.title,end:Date.now()+3e5};toast("⟦Commence, tu pourras arrêter après.⟧");return true}
  return false}

/* Tâches liées : une tâche « enchaînée » démarre quand sa tâche précédente se termine (heure réelle si elle est faite) */
function lkEnd(p){var s=mins(p.start);if(p.st&&p.at){var e=mins(String(p.at).replace("h",":"));return e<s&&s-e>720?e+1440:e}return s+(p.dur||0)}
function chain(){var ch=[];
  for(var k=0;k<6;k++){var moved=false;
    S.tasks.forEach(function(t){if(!t.af)return;var p=find(t.af);if(!p||p.date!=t.date||p.id==t.id){delete t.af;return}
      if(t.st)return;var pe=lkEnd(p);
      if(t.cs!==undefined&&t.start!=t.cs){var d=mins(t.start)-pe;if(d>=0)t.ag=d;else{delete t.af;delete t.cs;return}}
      var ns=hhmm(Math.min(1439,pe+(+t.ag||0)));if(ns!=t.start){t.start=ns;moved=true;if(ch.indexOf(t.title)<0)ch.push(t.title)}t.cs=t.start});
    if(!moved)break}
  return ch}
MVT2=[["Enchaîner après…","Chain after…","Encadenar después de…"],["Aucune (heure fixe)","None (fixed time)","Ninguna (hora fija)"],["après","after","después de"],["démarre à la fin de la tâche précédente","starts when the previous task ends","empieza al terminar la anterior"],["Heure ajustée : {0} à {1}","Time adjusted: {0} at {1}","Hora ajustada: {0} a las {1}"]];
MVT2.push(["Pause avant","Gap before","Pausa antes"],["aucune pause","no gap","sin pausa"],["{0} min de pause","{0} min gap","{0} min de pausa"]);
var MVK=MVT.concat(MVT2).map(function(r){return r[0]});
MVT2.forEach(function(r){D.en[r[0]]=r[1];D.es[r[0]]=r[2]});
