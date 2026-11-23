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
