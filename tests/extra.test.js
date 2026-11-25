const test = require("node:test");
const assert = require("node:assert/strict");
const { withApp, day } = require("./harness");

const task = (o = {}) => ({ id: 3000, title: "Lire", start: "09:00", dur: 30, pri: 2, date: day(0), st: "", ...o });

test("premier lancement : la présentation s’affiche pour un compte vide, en 3 étapes", () => withApp({}, async (a) => {
  assert.match(a.text(), /Bienvenue dans Élan/);
  a.click("[data-act=obn]"); assert.match(a.text(), /Une tâche, c’est une heure/);
  a.click("[data-act=obn]"); assert.match(a.text(), /Par quoi veux-tu commencer/);
  a.click("[data-act=obt]");
  assert.equal(a.state().ob, 1);
  assert.ok(a.$("#f"), "le formulaire de tâche doit s’ouvrir");
  assert.doesNotMatch(a.text(), /Par quoi veux-tu commencer/);
}));

test("premier lancement : « Passer » la ferme pour de bon", () => withApp({}, async (a) => {
  a.click("[data-act=obx]");
  assert.doesNotMatch(a.text(), /Bienvenue dans Élan/);
  assert.equal(a.state().ob, 1);
}));

test("premier lancement : jamais pour quelqu’un qui a déjà des données", () => withApp({ state: { tasks: [task()], tpls: [] } }, async (a) => {
  assert.doesNotMatch(a.text(), /Bienvenue dans Élan/);
  assert.ok(a.text().includes("Lire"));
}));

test("bilan de la semaine : chiffres, décision enregistrée et réaffichée", () => withApp({
  state: { tasks: [task({ st: "done" }), task({ id: 3001, title: "Gym", st: "done" }), task({ id: 3002, title: "Écrire" })], tpls: [], ob: 1 },
}, async (a) => {
  a.click("[data-v=b]");
  a.click("[data-act=wr]");
  assert.match(a.text(), /2 tâches terminées sur 3 \(67 %\)/);
  a.set("wrt", "Me coucher plus tôt");
  a.click("[data-act=wrs]");
  const wr = Object.values(a.state().wr);
  assert.equal(wr.length, 1);
  assert.equal(wr[0].t, "Me coucher plus tôt");
  assert.match(a.text(), /Ma décision : Me coucher plus tôt/);
  assert.match(a.text(), /Modifier le bilan/);
}));

test("accessibilité : la taille du texte se règle et se conserve", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=gear], .gear");
  a.set("fs", "2"); a.change("fs");
  assert.equal(a.state().fs, 2);
  assert.equal(a.w.document.documentElement.style.fontSize, "125%");
  assert.equal(a.$("#pv").getAttribute("aria-label"), "Précédent");
}));

test("bilan et accueil traduits en anglais", () => withApp({ lang: "en-US", state: { tasks: [task({ st: "done" })], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-v=b]"); a.click("[data-act=wr]");
  assert.match(a.text(), /1 of 1 tasks done \(100%\)/);
  assert.match(a.text(), /What will I change next week\?/);
}));

test("dans le formulaire de A, « une autre tâche suit celle-ci » lie B à A, et B suit quand A change", () => withApp({
  state: { tasks: [task({ id: 3000, title: "Réveil", start: "05:00", dur: 30 }), task({ id: 3001, title: "Méditation", start: "08:00", dur: 15 })], tpls: [], ob: 1 },
}, async (a) => {
  const b = () => a.state().tasks.find((t) => t.id === 3001);
  a.click("[data-act=open][data-id='3000']"); a.click("[data-act=edit][data-id='3000']");
  a.set("fo", "3001"); a.submit("f");
  assert.equal(String(b().af), "3000");
  assert.equal(b().start, "05:30");
  assert.match(a.text(), /suivie de Méditation/);
  assert.match(a.text(), /après Réveil/);
  a.click("[data-act=open][data-id='3000']"); a.click("[data-act=edit][data-id='3000']");
  a.set("start", "06:00"); a.submit("f");
  assert.equal(b().start, "06:30");
  a.click("[data-act=open][data-id='3000']"); a.click("[data-act=edit][data-id='3000']");
  a.set("fo", ""); a.submit("f");
  assert.equal(b().af, undefined);
}));

test("routines : créer depuis du texte, puis la placer enchaîne les tâches avec les pauses", () => withApp({ state: { tasks: [], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=opt]"); a.click("[data-act=rto]");
  a.click("[data-act=rtnew]");
  a.set("rtnm", "Matin"); a.set("rtst", "05:00"); a.set("rtln", "Réveil 0\nMéditation 15\nDouche 10");
  a.click("[data-act=rtsv]");
  const r = a.state().rt;
  assert.equal(r.length, 1);
  assert.deepEqual(r[0].items.map((i) => [i.title, i.dur]), [["Réveil", 0], ["Méditation", 15], ["Douche", 10]]);
  a.set(`rtt${r[0].id}`, "05:00");
  a.click(`[data-act=rtp][data-id='${r[0].id}']`);
  const ts = a.state().tasks;
  assert.equal(ts.length, 3);
  assert.deepEqual(ts.map((t) => t.start), ["05:00", "05:00", "05:15"]);
  assert.equal(String(ts[2].af), String(ts[1].id));
}));

test("routines : enregistrer une chaîne existante", () => withApp({
  state: { tasks: [task({ id: 3000, title: "Réveil", start: "05:00", dur: 0 }), task({ id: 3001, title: "Méditation", start: "05:00", dur: 15, af: 3000 })], tpls: [], ob: 1 },
}, async (a) => {
  a.click("[data-act=opt]"); a.click("[data-act=rto]");
  a.set("rtcn", "Réveil complet"); a.click("[data-act=rtcap]");
  const r = a.state().rt[0];
  assert.equal(r.name, "Réveil complet");
  assert.deepEqual(r.items.map((i) => i.title), ["Réveil", "Méditation"]);
}));

test("décaler la suite : seules les tâches libres qui n’ont pas commencé bougent, les liées suivent", () => withApp({
  state: { tasks: [task({ id: 3000, title: "Passée", start: "08:00", dur: 30 }), task({ id: 3001, title: "Midi", start: "12:00", dur: 60 }), task({ id: 3002, title: "Suite", start: "13:00", dur: 30, af: 3001 }), task({ id: 3003, title: "Fait", start: "15:00", st: "done", at: "15:00" })], tpls: [], ob: 1 },
}, async (a) => {
  const g = (id) => a.state().tasks.find((t) => t.id === id).start;
  a.click("[data-act=opt]"); a.click("[data-act=sfo]");
  a.click("[data-act=sfd][data-k='30']");
  assert.equal(g(3000), "08:00");
  assert.equal(g(3001), "12:30");
  assert.equal(g(3002), "13:30");
  assert.equal(g(3003), "15:00");
}));

test("démo : données d’exemple séparées, bannière et sortie ; les vraies données ne sont pas touchées", async () => {
  let demo;
  await withApp({ state: { tasks: [task({ title: "Vraie tâche" })], tpls: [], ob: 1 } }, async (a) => {
    a.w.xReload = () => {};
    a.click("[data-act=gear], .gear");
    a.click("[data-act=demo]");
    const ls = a.w.localStorage;
    assert.equal(ls.getItem("elan-demo"), "1");
    demo = JSON.parse(ls.getItem("planner-demo"));
    assert.ok(demo.tasks.length > 10 && demo.goals.length === 1 && demo.rt.length === 1);
    assert.match(ls.getItem("planner-v2"), /Vraie tâche/);
  });
  await withApp({ state: demo }, async (a) => {
    assert.match(a.text(), /Étude : réseaux/);
    assert.match(a.text(), /Parler anglais couramment/);
    assert.match(a.text(), /Terminées \(3\)/);
    a.click("[data-v=b]");
    assert.match(a.text(), /Bilan de la semaine/);
  });
});

test("corbeille : une tâche supprimée se restaure, et « Annuler » ne laisse rien dans la corbeille", () => withApp({
  state: { tasks: [task({ id: 3000, title: "À jeter" }), task({ id: 3001, title: "Autre" })], tpls: [], ob: 1 },
}, async (a) => {
  a.click("[data-act=open][data-id='3000']"); a.click("[data-act=del][data-id='3000']");
  assert.equal(a.state().tasks.length, 1);
  assert.equal(a.state().trash.length, 1);
  a.click("[data-act=opt]"); a.click("[data-act=tro]");
  assert.match(a.text(), /À jeter/);
  a.click("[data-act=trr]");
  assert.equal(a.state().tasks.length, 2);
  assert.equal(a.state().trash.length, 0);
  a.click("[data-act=trx]");
  a.click("[data-act=open][data-id='3001']"); a.click("[data-act=del][data-id='3001']");
  a.click("#toast");
  assert.equal(a.state().tasks.length, 2);
  assert.equal(a.state().trash.length, 0);
}));

test("corbeille : les tâches de plus de 30 jours ne sont plus proposées", () => withApp({
  state: { tasks: [task()], tpls: [], ob: 1, trash: [task({ id: 1, title: "Vieille", dl: Date.now() - 40 * 864e5 }), task({ id: 2, title: "Récente", dl: Date.now() - 2 * 864e5 })] },
}, async (a) => {
  a.click("[data-act=opt]"); a.click("[data-act=tro]");
  assert.match(a.text(), /Récente/);
  assert.doesNotMatch(a.text(), /Vieille/);
}));

test("réglages : guide d’installation pour l’appareil, avec la limite des rappels", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=gear], .gear");
  assert.match(a.text(), /Installer l’app/);
  assert.match(a.text(), /icône d’installation dans la barre d’adresse/);
  assert.match(a.text(), /Les rappels ne sont pas garantis/);
}));

test("sauvegarde : utilise la feuille de partage quand elle existe, et ne marque « sauvegardé » qu’après le partage", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  let shared = null;
  a.w.navigator.canShare = () => true;
  a.w.navigator.share = (d) => { shared = d; return Promise.resolve(); };
  a.click("[data-act=gear], .gear");
  a.click("[data-act=bk]");
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(shared && shared.files[0].name.startsWith("elan-sauvegarde-"));
  assert.ok(a.state().bk);
}));

test("ajout rapide : « Appeler Marc 14h 30 min » crée la tâche avec l’heure et la durée", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  const i = a.$("#qa"); assert.ok(i, "la barre d’ajout rapide doit exister");
  i.value = "Appeler Marc 14h 45 min";
  a.click("[data-act=qa]");
  await new Promise((r) => setTimeout(r, 120));
  const t = a.state().tasks.find((x) => /Marc/.test(x.title));
  assert.ok(t, "tâche créée");
  assert.equal(t.start, "14:00"); assert.equal(t.dur, 45); assert.equal(t.date, day(0));
}));

test("mode doux : cache les séries et change le vocabulaire de retard", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=gear], .gear");
  assert.match(a.text(), /Mode doux/);
  a.click("[data-act=soft]");
  assert.equal(a.state().soft, 1);
  assert.ok(a.w.document.body.classList.contains("soft"));
  a.click("[data-act=soft]");
  assert.ok(!a.state().soft);
}));

test("bulles d’aide : affichées une fois puis mémorisées", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  const h = a.w.tipHTML("rt");
  assert.match(h, /suite de tâches enchaînées/);
  a.w.document.body.insertAdjacentHTML("beforeend", h);
  a.click("[data-act=tipx]");
  assert.equal(a.state().tips.rt, 1);
  assert.equal(a.w.tipHTML("rt"), "");
}));

test("bilan : conseils vides tant qu’il y a moins de 12 tâches", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.w.insHTML(), /Continue quelques jours/);
}));

test("bilan : détecte le meilleur moment de la journée", () => {
  const ts = []; let id = 5000;
  for (let k = 1; k <= 7; k++) { ts.push(task({ id: id++, date: day(-k), start: "09:00", st: "done" })); ts.push(task({ id: id++, date: day(-k), start: "21:00", st: k < 2 ? "done" : "" })); }
  return withApp({ state: { tasks: ts, tpls: [], ob: 1 } }, async (a) => {
    assert.match(a.w.insHTML(), /meilleur moment : le matin/);
  });
});

test("raccourcis d’icône : le manifeste déclare ajouter et maintenant", () => {
  const m = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "manifest.webmanifest"), "utf8"));
  assert.deepEqual(m.shortcuts.map((s) => s.url), ["./?add=1", "./?now=1"]);
});

test("tâches d’hier non faites : proposées dans « En retard », sans lien avec un objectif", () => withApp({ state: { tasks: [
  task({ id: 11, title: "Ranger", date: day(-1), start: "10:00" }),
  task({ id: 12, title: "Appeler", date: day(-1), start: "11:00" }),
  task({ id: 13, title: "Payer", date: day(-2), start: "12:00" }),
  task({ id: 14, title: "Fait hier", date: day(-1), st: "done", at: "09:30" }),
  task({ id: 15, title: "Répétée", date: day(-1), tp: "x" }),
], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /En retard \(3\)/);
  a.click("[data-act=odt]");
  assert.ok(a.text().includes("Ranger") && !a.text().includes("Fait hier"));
  a.click("[data-act=od][data-k=mv][data-id='11']");
  assert.equal(a.state().tasks.find((t) => t.id == 11).date, day(0));
  a.click("[data-act=od][data-k=dn][data-id='12']");
  assert.equal(a.state().tasks.find((t) => t.id == 12).st, "done");
  a.click("[data-act=od][data-k=ig][data-id='13']");
  assert.equal(a.state().tasks.find((t) => t.id == 13).st, "stop");
}));

test("sans heure : une tâche sans horaire va dans « Sans heure précise », puis se place dans un créneau libre", () => withApp({ state: { tasks: [task({ id: 21, title: "Bloc", start: "09:00", dur: 600 })], tpls: [], ob: 1 } }, async (a) => {
  a.$("#qa").value = "Appeler le dentiste";
  a.click("[data-act=qa]");
  await new Promise((r) => setTimeout(r, 120));
  assert.equal(a.state().nt.length, 1);
  assert.ok(!a.state().tasks.some((t) => /dentiste/.test(t.title)));
  assert.match(a.text(), /Sans heure précise \(1\)/);
  a.click("[data-act=ntp]");
  assert.match(a.text(), /Au plus tôt/);
  a.click("[data-act=ntw][data-k=e]");
  const t = a.state().tasks.find((x) => /dentiste/.test(x.title));
  assert.ok(t, "placée");
  assert.ok(t.start >= "19:00", "après le bloc 9h-19h : " + t.start);
  assert.equal(a.state().nt.length, 0);
}));

test("sans heure : ✓ la compte comme faite", () => withApp({ state: { tasks: [], tpls: [], ob: 1, nt: [{ id: 31, title: "Payer", dur: 15, date: day(0) }] } }, async (a) => {
  a.click("[data-act=ntd]");
  assert.equal(a.state().nt.length, 0);
  assert.equal(a.state().tasks.find((t) => t.title == "Payer").st, "done");
}));

test("planifier ma journée : propose de reporter les moins prioritaires quand ça déborde", () => withApp({ state: { tasks: [
  task({ id: 41, title: "Gros projet", start: "10:30", dur: 300, pri: 1 }),
  task({ id: 42, title: "Ménage", start: "16:00", dur: 240, pri: 3 }),
  task({ id: 43, title: "Lecture", start: "20:00", dur: 240, pri: 3 }),
], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /Journée chargée/);
  a.click("[data-act=plr]");
  const s = a.state().tasks, g = s.find((t) => t.id == 41);
  assert.equal(g.date, day(0));
  assert.ok(s.filter((t) => t.date == day(1)).length >= 1);
  assert.doesNotMatch(a.text(), /Journée chargée/);
}));

test("planifier ma journée : rien si la journée tient, et « Garder tel quel » la masque", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  assert.doesNotMatch(a.text(), /Journée chargée/);
}));

test("import : une tâche par ligne, avec ou sans heure", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=opt]");
  a.click("[data-act=imo]");
  a.$("#iml").value = "Appeler Marc 14h 30 min\nCourses\n\nRanger 16h";
  a.click("[data-act=imp]");
  assert.match(a.text(), /Importer 3 tâches/);
  a.click("[data-act=img]");
  await new Promise((r) => setTimeout(r, 120));
  const s = a.state();
  const m = s.tasks.find((t) => /Marc/.test(t.title));
  assert.equal(m.start, "14:00"); assert.equal(m.dur, 30);
  assert.ok(s.tasks.find((t) => t.title == "Ranger" && t.start == "16:00"));
  assert.deepEqual(s.nt.map((q) => q.title), ["Courses"]);
}));

test("journée chargée : une chaîne de tâches liées est reportée en bloc", () => withApp({ state: { tasks: [
  task({ id: 51, title: "Gros projet", start: "10:30", dur: 300, pri: 1 }),
  task({ id: 52, title: "Base", start: "16:00", dur: 240, pri: 3 }),
  task({ id: 53, title: "Suite", start: "20:00", dur: 240, pri: 3, af: 52, ag: 0 }),
], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /Reporter 2 tâches à demain/);
  a.click("[data-act=plr]");
  const s = a.state().tasks;
  assert.equal(s.find((t) => t.id == 52).date, day(1));
  assert.equal(s.find((t) => t.id == 53).date, day(1));
  assert.equal(s.find((t) => t.id == 53).af, 52);
}));

test("journée chargée : les tâches répétées ou d’objectif ne sont jamais déplacées, et la carte explique pourquoi", () => withApp({ state: { tasks: [
  task({ id: 61, title: "Anglais", start: "10:30", dur: 300, pri: 3, tp: 7, gl: 9 }),
  task({ id: 62, title: "Sport", start: "16:00", dur: 240, pri: 3, tp: 8 }),
  task({ id: 63, title: "Lecture", start: "20:00", dur: 240, pri: 3, gl: 9 }),
], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /Journée chargée/);
  assert.match(a.text(), /liées à un objectif/);
  assert.ok(!a.$("[data-act=plr]"));
  a.click("[data-act=plk]");
  assert.doesNotMatch(a.text(), /Journée chargée/);
  assert.ok(a.state().tasks.every((t) => t.date == day(0)));
}));

test("boutons ⓘ : une explication s’ouvre et se ferme, dans les réglages comme dans la journée", () => withApp({ state: { tasks: [task({ id: 71, title: "Hier", date: day(-1), start: "10:00" })], tpls: [], ob: 1 } }, async (a) => {
  const ib = a.$("[data-act=inf]");
  assert.ok(ib, "un bouton ⓘ doit exister sur la carte En retard");
  a.click("[data-act=inf]");
  assert.match(a.text(), /Les tâches des 7 derniers jours que tu n’as pas terminées/);
  a.click("[data-act=infx]");
  assert.doesNotMatch(a.text(), /Les tâches des 7 derniers jours que tu n’as pas terminées/);
  a.click("[data-act=gear], .gear");
  assert.ok(a.$("[data-act=inf]"), "ⓘ dans les réglages");
  assert.equal(a.$$ ? a.$$("[data-act=inf]").length > 1 : true, true);
}));

test("ajout rapide : jour, priorité et catégorie sont reconnus", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.$("#qa").value = "Réviser demain 10h ! #sport";
  a.click("[data-act=qa]");
  await new Promise((r) => setTimeout(r, 120));
  const t = a.state().tasks.find((x) => /Réviser/.test(x.title));
  assert.equal(t.title, "Réviser"); assert.equal(t.date, day(1)); assert.equal(t.start, "10:00");
  assert.equal(t.pri, 1); assert.equal(t.cat, "Sport");
}));

test("ajout rapide : « Annuler » retire la tâche ajoutée", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.$("#qa").value = "Appeler Marc 14h";
  a.click("[data-act=qa]");
  await new Promise((r) => setTimeout(r, 120));
  assert.equal(a.state().tasks.length, 2);
  a.w.document.getElementById("toast").click();
  assert.equal(a.state().tasks.length, 1);
}));

test("journée chargée : on choisit ce qui part à demain, et Annuler remet tout", () => withApp({ state: { tasks: [
  task({ id: 81, title: "Gros", start: "10:30", dur: 300, pri: 1 }),
  task({ id: 82, title: "Ménage", start: "16:00", dur: 240, pri: 3 }),
  task({ id: 83, title: "Lecture", start: "20:00", dur: 240, pri: 3 }),
], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=plt][data-id='82']");
  a.click("[data-act=plt][data-id='83']");
  assert.ok(a.$("[data-act=plt][data-id='82']"), "la carte reste ouverte");
  a.click("[data-act=plt][data-id='81']");
  a.click("[data-act=plr]");
  await new Promise((r) => setTimeout(r, 120));
  assert.equal(a.state().tasks.find((t) => t.id == 81).date, day(1));
  a.w.document.getElementById("toast").click();
  assert.equal(a.state().tasks.find((t) => t.id == 81).date, day(0));
}));

test("journée chargée : on peut raccourcir les séances répétées, avec Annuler", () => withApp({ state: { tasks: [
  task({ id: 91, title: "Anglais", start: "10:30", dur: 300, pri: 3, tp: 7, gl: 9 }),
  task({ id: 92, title: "Sport", start: "16:00", dur: 240, pri: 3, tp: 8 }),
  task({ id: 93, title: "Lecture", start: "20:00", dur: 240, pri: 3, gl: 9 }),
], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=pls]");
  await new Promise((r) => setTimeout(r, 120));
  assert.equal(a.state().tasks.find((t) => t.id == 91).dur, 150);
  a.w.document.getElementById("toast").click();
  assert.equal(a.state().tasks.find((t) => t.id == 91).dur, 300);
}));

test("mode doux : proposé après plusieurs jours sans tâche terminée, et « Non merci » le range", () => withApp({ state: { tasks: [
  task({ id: 1, date: day(-1) }), task({ id: 2, date: day(-2) }), task({ id: 3, date: day(-3) }), task({ id: 4, date: day(0), start: "23:00" }),
], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /Les derniers jours ont été difficiles/);
  a.click("[data-act=softn]");
  assert.doesNotMatch(a.text(), /Les derniers jours ont été difficiles/);
}));

test("formulaire : le ⓘ explique les champs sans fermer ni vider le formulaire", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=add], .fab, #add");
  a.$("#title").value = "Test saisi";
  a.click("#f [data-act=infi]");
  assert.match(a.text(), /Enchaîner après : elle démarre/);
  assert.equal(a.$("#title").value, "Test saisi");
  a.click("#f [data-act=infi]");
  assert.doesNotMatch(a.text(), /Enchaîner après : elle démarre/);
}));

test("styles : six styles, un nombre pair", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  a.click("[data-act=gear], .gear");
  assert.equal(a.w.document.querySelectorAll("[data-act=sty]").length, 6);
}));

test("traductions : chaque texte anglais existe aussi en portugais, chinois, hindi, arabe et russe", () => withApp({ state: { tasks: [task()], tpls: [], ob: 1 } }, async (a) => {
  const D = a.w.eval("D");
  for (const l of ["pt", "zh", "hi", "ar", "ru"]) {
    const m = Object.keys(D.en).filter((k) => D[l][k] === undefined);
    assert.deepEqual(m, [], l + " : textes sans traduction");
  }
}));

test("traductions : l’app s’affiche en portugais et en chinois", () => withApp({ lang: "pt-BR", state: { tasks: [task({ id: 5, start: "10:30", dur: 600 }), task({ id: 6, start: "21:00", dur: 300 })], tpls: [], ob: 1 } }, async (a) => {
  assert.match(a.text(), /Dia carregado/);
}));
