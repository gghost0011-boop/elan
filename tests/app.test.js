const test = require("node:test");
const assert = require("node:assert/strict");
const { withApp, day } = require("./harness");

// ---------- fabriques de données ----------
let nextId = 1000;
const base = (o = {}) => ({ tasks: [], tpls: [], goals: [], gen: {}, ...o });
const task = (o = {}) => ({ id: nextId++, title: "Tâche", start: "09:00", dur: 30, pri: 2, date: day(0), st: "", ...o });
const goal = (o = {}) => ({ id: 1, title: "Anglais", date: day(60), start: day(-5), target: 0, unit: "", type: "lang", log: [], acts: [], ...o });
const tpl = (o = {}) => ({ id: 11, title: "Vocabulaire", start: "18:00", dur: 20, pri: 2, days: [0, 1, 2, 3, 4, 5, 6], gl: 1, since: day(-5), until: day(60), ...o });
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

async function createGoal(a, { title, type = "lang", date = day(60), target, unit } = {}) {
  a.click("[data-v=g]");
  a.click("[data-act=gnew]");
  a.set("gtp", type); a.change("gtp");
  a.set("gti", title); a.set("gdt", date);
  if (target) { a.set("gtg", String(target)); a.set("gun", unit || ""); }
  a.submit("gf");
}

// ---------- tâches ----------
test("ajoute une tâche à la journée", () => withApp({}, async (a) => {
  a.click("[data-act=add]"); a.set("title", "Appeler Marie"); a.set("start", "14:00"); a.submit("f");
  assert.equal(a.state().tasks[0].title, "Appeler Marie");
  assert.match(a.text(), /Appeler Marie/);
}));

test("l’ajout rapide extrait l’heure et la durée du titre", () => withApp({}, async (a) => {
  a.click("[data-act=add]"); a.set("title", "Étude 14h 2h"); a.submit("f");
  const t = a.state().tasks[0];
  assert.deepEqual([t.title, t.start, t.dur], ["Étude", "14:00", 120]);
}));

test("une tâche répétée réapparaît le lendemain", () => withApp({}, async (a) => {
  a.click("[data-act=add]"); a.set("title", "Gym");
  ALL_DAYS.forEach((i) => a.check("rd" + i)); a.submit("f");
  assert.equal(a.state().tpls[0].days.length, 7);
  a.click("#nx");
  assert.match(a.text(), /Gym/);
}));

test("les tâches terminées sont repliées dans « Terminées »", () => withApp({
  state: base({ tasks: [task({ title: "Fini", st: "done", at: "09h30" }), task({ title: "Reste", start: "15:00" })] }),
}, async (a) => {
  assert.match(a.text(), /Reste/);
  assert.doesNotMatch(a.text(), /Fini/);
  a.click("[data-act=dnt]");
  assert.match(a.text(), /Fini/);
}));

test("l’indicateur « Maintenant » donne l’heure et le nombre de tâches restantes", () => withApp({
  state: base({ tasks: [task({ title: "Matin", start: "08:00" }), task({ title: "Midi", start: "12:00" })] }),
}, async (a) => {
  const line = a.$(".nowl").textContent;
  assert.match(line, /10h00/);
  assert.match(line, /1 restante/);
}));

test("« Que faire maintenant ? » propose la tâche en cours puis une autre", () => withApp({
  state: base({ tasks: [
    task({ id: 1, title: "En retard", start: "08:00", pri: 3 }),
    task({ id: 2, title: "En cours", start: "10:00", dur: 60, pri: 2 }),
    task({ id: 3, title: "Ce soir", start: "20:00", pri: 3 }),
  ] }),
}, async (a) => {
  a.click("[data-act=wnow]");
  assert.match(a.$(".sug").textContent, /En cours/);
  a.click("[data-act=wnx]");
  assert.doesNotMatch(a.$(".sug").textContent, /En cours/);
}));

test("décaler une tâche et la faire à une autre heure", () => withApp({
  state: base({ tasks: [task({ id: 5, title: "Étude", start: "07:00" })] }),
  answers: ["20:10"],
}, async (a) => {
  a.click('[data-act=open][data-id="5"]'); a.click('[data-act=shift][data-k="30"]');
  assert.equal(a.state().tasks[0].start, "07:30");
  a.click('[data-act=open][data-id="5"]'); a.click("[data-act=dat]");
  const t = a.state().tasks[0];
  assert.deepEqual([t.st, t.at], ["done", "20h10"]);
}));

// ---------- sommeil, journal ----------
test("saisir les heures réelles alimente la carte Sommeil du Bilan", () => withApp({
  state: base({ tasks: [task({ id: 7, title: "Dormir", start: "00:00", dur: 360 })] }),
  answers: ["01:00-11:37"],
}, async (a) => {
  a.click('[data-act=open][data-id="7"]'); a.click("[data-act=dat]");
  const t = a.state().tasks[0];
  assert.deepEqual([t.as, t.ae], ["01:00", "11:37"]);
  a.click("[data-v=b]");
  assert.match(a.text(), /Sommeil 1 nuits? enregistrées?/);
  assert.match(a.text(), /Durée moyenne : 10 h 37/);
}));

test("cocher une tâche de sommeil ne demande que l’heure du coucher", () => withApp({
  state: base({ tasks: [task({ id: 8, title: "Dormir", start: "23:00", dur: 480 })] }),
  answers: ["23:30"],
}, async (a) => {
  a.click('[data-act=done][data-id="8"]');
  const t = a.state().tasks[0];
  assert.deepEqual([t.st, t.as, t.ae], ["done", "23:30", "10:00"]);
  assert.match(a.prompts[0].question, /coucher/);
}));

test("le journal est enregistré et résumé dans le Bilan", () => withApp({ answers: [] }, async (a) => {
  a.click("[data-act=jro]"); a.click('[data-act=jm][data-k="4"]'); a.click('[data-act=je][data-k="5"]');
  a.set("jrn", "Bien dormi"); a.change("jrn");
  assert.deepEqual(a.state().jr[day(0)], { m: 4, e: 5, n: "Bien dormi" });
  a.click("[data-v=b]");
  assert.match(a.text(), /Humeur moyenne : 4\/5/);
}));

// ---------- objectifs ----------
test("crée un objectif avec ses tâches proposées", () => withApp({}, async (a) => {
  await createGoal(a, { title: "Anglais fluide" });
  const s = a.state();
  assert.equal(s.goals.length, 1);
  assert.equal(s.tpls.length, 5);
  assert.ok(s.tpls.every((t) => t.gl === s.goals[0].id));
}));

test("la même activité dans deux objectifs est partagée, pas dupliquée", () => withApp({}, async (a) => {
  await createGoal(a, { title: "Prise de masse", type: "sport" });
  await createGoal(a, { title: "Perdre du poids", type: "weight" });
  const actives = a.state().tpls.filter((t) => t.title === "Pesée" && t.until >= day(0));
  assert.equal(actives.length, 1);
  assert.equal(actives[0].gls.length, 1);
  a.click("[data-v=d]");
  const pesees = a.state().tasks.filter((t) => t.title === "Pesée" && t.date === day(0));
  assert.ok(pesees.length <= 1);
}));

test("modifier un objectif après avoir coché une tâche ne la duplique pas", () => withApp({}, async (a) => {
  await createGoal(a, { title: "Anglais" });
  a.click("[data-v=d]"); a.click("[data-act=gtog]");
  a.click(".gg [data-act=done]");
  const done = a.state().tasks.find((t) => t.st === "done").title;
  a.click("[data-v=g]"); a.click("[data-act=gopen]"); a.click("[data-act=gedit]"); a.submit("gf");
  a.click("[data-v=d]");
  assert.equal(a.state().tasks.filter((t) => t.title === done && t.date === day(0)).length, 1);
}));

test("« Nettoyer les doublons » fusionne les activités et garde la tâche terminée", () => withApp({
  state: base({
    goals: [goal({ id: 1 }), goal({ id: 2, title: "Poids" })],
    tpls: [tpl({ id: 11, title: "Pesée", gl: 1 }), tpl({ id: 12, title: "pesée", gl: 2 })],
    tasks: [
      task({ id: 21, title: "Pesée", date: day(-1), st: "done", tp: 11, gl: 1 }),
      task({ id: 22, title: "pesée", date: day(-1), tp: 12, gl: 2 }),
      task({ id: 23, title: "Pesée", tp: 11, gl: 1 }),
      task({ id: 24, title: "pesée", tp: 12, gl: 2 }),
    ],
  }),
}, async (a) => {
  a.click(".gear"); a.click("[data-act=dedupe]");
  const s = a.state();
  assert.equal(s.tasks.length, 2);
  assert.ok(s.tasks.some((t) => t.st === "done"));
  assert.deepEqual(s.tpls.find((t) => t.id === 11).gls, [2]);
}));

test("la quantité n’est demandée que pour les tâches marquées", () => withApp({
  state: base({
    goals: [goal({ id: 1, title: "Masse", target: 75, unit: "kg", mode: "value", vs: 70 })],
    tpls: [tpl({ id: 11, title: "Dormir", gl: 1 }), tpl({ id: 12, title: "Pesée", gl: 1, q: 1 })],
    tasks: [task({ id: 31, title: "Lecture", tp: 11, gl: 1 }), task({ id: 32, title: "Pesée", start: "07:30", dur: 5, tp: 12, gl: 1, q: 1 })],
  }),
  answers: ["72.5"],
}, async (a) => {
  a.click("[data-act=gtog]");
  a.click('[data-act=done][data-id="31"]');
  assert.equal(a.prompts.length, 0);
  a.click('[data-act=done][data-id="32"]');
  assert.equal(a.prompts.length, 1);
  assert.deepEqual(a.state().goals[0].log.map((l) => l.n), [72.5]);
  a.click("[data-v=g]"); a.click("[data-act=gopen]");
  assert.match(a.text(), /72[.,]5 \/ 75 kg \(50 %\)/);
}));

test("un groupe d’objectif dont toutes les tâches sont faites affiche ✓", () => withApp({
  state: base({
    goals: [goal()],
    tpls: [tpl()],
    tasks: [task({ title: "Vocabulaire", st: "done", at: "18h10", tp: 11, gl: 1 }), task({ title: "Écoute", start: "18:30", st: "done", at: "18h40", tp: 11, gl: 1 })],
  }),
}, async (a) => {
  const g = a.$(".gg.ok");
  assert.ok(g);
  assert.match(g.textContent, /✓/);
}));

test("terminer toutes les tâches du jour d’un objectif déclenche une félicitation", () => withApp({
  state: base({
    goals: [goal()],
    tpls: [tpl()],
    tasks: [task({ id: 41, title: "Vocabulaire", tp: 11, gl: 1 }), task({ id: 42, title: "Écoute", start: "18:30", tp: 11, gl: 1 })],
  }),
}, async (a) => {
  a.click("[data-act=gtog]");
  a.click('[data-act=done][data-id="41"]');
  a.click('[data-act=done][data-id="42"]');
  assert.match(a.toast(), /tout est fait aujourd’hui/);
}));

test("les jalons s’ajoutent, se cochent et sont félicités", () => withApp({}, async (a) => {
  a.click("[data-v=g]"); a.click("[data-act=gnew]");
  a.set("gti", "Test d’anglais"); a.set("gdt", day(60));
  a.click("[data-act=gmadd]"); a.set("gm0t", "Test blanc"); a.set("gm0d", day(20));
  a.submit("gf");
  assert.equal(a.state().goals[0].ms.length, 1);
  assert.match(a.text(), /Jalons\W*0\/1/);
  a.click("[data-act=gmd]");
  assert.ok(a.state().goals[0].ms[0].done);
  assert.match(a.toast(), /Jalon atteint/);
}));

test("le tableau de la semaine résume les objectifs actifs", () => withApp({
  state: base({
    goals: [goal()],
    tpls: [tpl()],
    tasks: [task({ date: day(-1), title: "Vocabulaire", st: "done", tp: 11, gl: 1 })],
  }),
}, async (a) => {
  a.click("[data-v=g]");
  assert.equal(a.all(".gw .gn").length, 1);
  assert.match(a.$(".gw").textContent, /✓/);
}));

// ---------- vues et exports ----------
test("la vue Mois ne montre que l’essentiel : échéances, priorité haute et nombre de tâches", () => withApp({
  state: base({
    goals: [goal({ id: 1, date: day(5) })],
    tasks: [task({ pri: 1 }), task({ pri: 2 }), task({ pri: 3 })],
  }),
}, async (a) => {
  a.click("[data-v=m]");
  const cells = a.all(".mc");
  assert.ok(cells.every((c) => c.querySelectorAll(".dots i").length <= 1));
  assert.ok(a.all(".gf").length >= 1);
}));

test("l’export .ics contient l’échéance, les jalons et la fin des répétitions", () => withApp({
  state: base({
    goals: [goal({ ms: [{ id: 9, title: "Test blanc", date: day(20), done: "" }] })],
    tpls: [tpl()],
    tasks: [task({ date: day(0), title: "Vocabulaire", tp: 11, gl: 1 })],
  }),
}, async (a) => {
  let ics = "";
  a.w.dlf = (name, text) => { ics = text; };
  a.click(".gear"); a.click("[data-act=ics]");
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /UNTIL=/);
  assert.match(ics, /SUMMARY:🎯 Anglais/);
  assert.match(ics, /SUMMARY:🏁 Test blanc/);
}));

test("un modèle de semaine s’enregistre et s’applique à la semaine suivante", () => withApp({
  state: base({ tasks: [task({ title: "Cours", date: day(-2) }), task({ title: "Gym", date: day(-1), start: "18:00" })] }),
  answers: ["Semaine type"],
}, async (a) => {
  a.click("[data-act=opt]"); a.click("[data-act=wmsave]");
  assert.equal(a.state().wm.length, 1);
  a.click('[data-act=wmapply][data-k="1"]');
  const next = a.state().tasks.filter((t) => t.date > day(0));
  assert.equal(next.length, 2);
}));

// ---------- langues ----------
test("en anglais, aucune vue ne laisse de texte français", () => withApp({
  lang: "en-US",
  state: base({
    goals: [goal({ ms: [{ id: 9, title: "Mock test", date: day(10), done: "" }] })],
    tpls: [tpl({ title: "Vocabulary" })],
    tasks: [task({ title: "Study" }), task({ id: 70, title: "Vocabulary", start: "18:00", tp: 11, gl: 1 })],
  }),
}, async (a) => {
  const FRENCH = /(tâche|Terminée|Aujourd’hui|Réglages|Objectif|Ajouter|Modifier|Annuler|Supprimer|Maintenant|Prochaine|Semaine|Mois\b|Bilan|Journal de|Rechercher|restantes?)/;
  const views = ["[data-v=d]", "[data-v=w]", "[data-v=m]", "[data-v=b]", ".gear", "[data-v=g]"];
  for (const v of views) {
    a.click(v);
    assert.doesNotMatch(a.text(), FRENCH, "texte français dans la vue " + v);
  }
  a.click("[data-act=gnew]");
  assert.doesNotMatch(a.text(), FRENCH, "texte français dans le formulaire d’objectif");
}));

test("les 5 langues supplémentaires s’affichent sans texte français ni erreur", async () => {
  for (const lang of ["pt-BR", "zh-CN", "hi-IN", "ar-EG", "ru-RU"]) {
    await withApp({
      lang,
      state: base({ tasks: [task({ title: "Study" })], goals: [goal({})] }),
    }, async (a) => {
      const FRENCH = /(tâche|Terminée|Aujourd’hui|Réglages|Objectif|Ajouter|Modifier|Annuler|Supprimer|Maintenant|Prochaine|Semaine|Bilan|Rechercher)/;
      for (const v of ["[data-v=d]", "[data-v=w]", "[data-v=m]", "[data-v=b]", ".gear", "[data-v=g]"]) {
        a.click(v);
        assert.doesNotMatch(a.text(), FRENCH, lang + " : texte français dans la vue " + v);
        assert.doesNotMatch(a.text(), /undefined|NaN/, lang + " : valeur manquante dans la vue " + v);
      }
    });
  }
});
