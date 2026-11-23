const test = require("node:test");
const assert = require("node:assert/strict");
const { withApp, day } = require("./harness");

test("d’anciennes données sont migrées sans rien perdre", () => withApp({
  state: { tasks: [{ id: 1, title: "Gym", start: "07:00", dur: 60, pri: 2, date: day(0), st: "" }], tpls: [] },
}, async (a) => {
  assert.equal(a.w.eval("S.v"), a.w.eval("DV"));
  assert.equal(a.w.eval("S.plan.tier"), "free");
  assert.match(a.text(), /Gym/);
  a.click("[data-act=add]"); a.set("title", "Lire"); a.submit("f");
  assert.equal(a.state().v, a.w.eval("DV"));
  assert.equal(a.state().tasks.length, 2);
}));

test("tout est débloqué avant la publication, puis le premium se verrouille", () => withApp({}, async (a) => {
  assert.equal(a.w.eval("can('sync')"), true);
  a.w.eval("OPEN=false");
  assert.equal(a.w.eval("can('sync')"), false, "fonction premium verrouillée pour un compte gratuit");
  assert.equal(a.w.eval("can('tasks')"), true, "les fonctions de base restent gratuites");
  a.w.eval("S.plan={tier:'premium',period:'year'}");
  assert.equal(a.w.eval("can('sync')"), true);
  a.w.eval("S.plan={tier:'premium',period:'month',until:'2000-01-01'}");
  assert.equal(a.w.eval("can('sync')"), false, "abonnement expiré");
}));

test("la carte Formule reste cachée pour les utilisateurs normaux", () => withApp({}, async (a) => {
  a.click(".gear");
  assert.doesNotMatch(a.text(), /Tout est débloqué|Version des données/);
}));
