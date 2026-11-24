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
