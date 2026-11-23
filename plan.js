/* Élan — formules (gratuit / premium) et version des données.
   Avant la publication sur les stores, tout est débloqué (OPEN = true).
   Au lancement : OPEN = false, et l'état d'abonnement S.plan sera rempli par l'achat dans l'application (mensuel ou annuel). */
var OPEN=true;
var DV=2; // version actuelle du format de données
var PERIODS=["month","year"];
/* Fonctions réservées au premium (à brancher au fur et à mesure) */
var PREMIUM_FEATURES={sync:1,autobackup:1,adv_stats:1,all_styles:1,native_reminders:1,quote_packs:1};
function isPremium(){var p=(typeof S!="undefined"&&S.plan)||{};return p.tier=="premium"&&(!p.until||p.until>=iso(new Date()))}
function can(f){return OPEN||!PREMIUM_FEATURES[f]||isPremium()}
/* Migrations : chaque étape fait passer les données de la version n à n+1 sans rien perdre */
var MIGRATIONS=[
  function(s){s.tasks=s.tasks||[];s.tpls=s.tpls||[];s.gen=s.gen||{};s.goals=s.goals||[]},   // 0 -> 1
  function(s){s.mv=s.mv||{};s.pr=s.pr||{};s.plan=s.plan||{tier:"free"}}                       // 1 -> 2
];
function migrate(s){var v=+s.v||0;while(v<DV&&MIGRATIONS[v]){MIGRATIONS[v](s);v++}s.v=DV;return s}
D.en["Cette sauvegarde vient d’une version plus récente d’Élan. Mets l’application à jour."]="This backup comes from a newer version of Élan. Update the app.";
D.es["Cette sauvegarde vient d’une version plus récente d’Élan. Mets l’application à jour."]="Esta copia viene de una versión más reciente de Élan. Actualiza la aplicación.";

D.en["Formule"]="Plan";D.es["Formule"]="Plan";
D.en["Tout est débloqué (version de lancement)"]="Everything is unlocked (launch version)";D.es["Tout est débloqué (version de lancement)"]="Todo está desbloqueado (versión de lanzamiento)";
D.en["Gratuite"]="Free";D.es["Gratuite"]="Gratuita";D.en["Premium"]="Premium";D.es["Premium"]="Premium";
D.en["Version des données : {0}"]="Data version: {0}";D.es["Version des données : {0}"]="Versión de los datos: {0}";
function planHTML(){if(!/[?&]admin\b/.test(location.search))return"";var t=OPEN?"Tout est débloqué (version de lancement)":isPremium()?"Premium":"Gratuite";
  return'<div class="card"><b>⟦Formule⟧</b><div>'+(OPEN?"🔓 ":isPremium()?"⭐ ":"")+"⟦"+t+"⟧</div><span class=\"mut\">⟦Version des données : {0}|"+DV+"⟧</span></div>"}
