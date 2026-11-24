const test = require("node:test");
const assert = require("node:assert/strict");
const { withApp, day } = require("./harness");

const base = (o = {}) => ({ tasks: [], tpls: [], goals: [], gen: {}, ...o });
const task = (o = {}) => ({ id: 2000, title: "Étudier", start: "09:00", dur: 30, pri: 2, date: day(0), st: "", ...o });

test("la citation du jour s’affiche avec sa source, et ↻ en propose une autre", () => withApp({ state: base({ tasks: [task()] }) }, async (a) => {
  assert.ok(a.$(".mvc .mvt"), "carte de citation absente");
  assert.ok(a.$(".mvc .mvs").textContent.length > 4, "source absente");
  const avant = a.$(".mvc .mvt").textContent;
  let autre = false;
  for (let i = 0; i < 6 && !autre; i++) { a.click("[data-act=mvn]"); autre = a.$(".mvc .mvt").textContent !== avant; }
  assert.ok(autre, "↻ ne change jamais la citation");
}));

test("les sources se désactivent dans les réglages", () => withApp({ state: base({ tasks: [task()] }) }, async (a) => {
  a.click(".gear");
  ["stoic", "wisdom", "spirit"].forEach((k) => a.click(`[data-act=mvt][data-k=${k}]`));
  assert.deepEqual([a.state().mv.stoic, a.state().mv.wisdom, a.state().mv.spirit], [0, 0, 0]);
  a.click("[data-v=d]");
  assert.equal(a.$(".mvc .mvt"), null, "citation affichée sans aucune source");
  a.click(".gear"); a.click("[data-act=mvt][data-k=spirit]");
  a.click("[data-v=d]");
  assert.ok(a.$(".mvc .mvt"));
}));

test("la priorité du jour se choisit et s’enregistre", () => withApp({ state: base({ tasks: [task(), task({ id: 2001, title: "Gym", start: "11:00" })] }) }, async (a) => {
  a.set("mvp", "2001"); a.change("mvp");
  assert.equal(a.state().pr[day(0)], "2001");
  assert.match(a.text(), /Gym/);
}));

test("« J’ai du mal » : motif, citation, pourquoi, plan B et minuteur de 5 minutes", () => withApp({
  state: base({
    goals: [{ id: 1, title: "Anglais", date: day(60), start: day(-5), target: 0, unit: "", type: "lang", log: [], acts: [], why: "Travailler à Londres" }],
    tasks: [task({ gl: 1, pb: "Lire 1 page" })],
  }),
}, async (a) => {
  a.click("[data-act=gtog]");
  a.click("[data-act=open]");
  a.click("[data-act=hm]");
  assert.ok(a.$(".mvh"), "fiche absente");
  a.click("[data-act=hmr][data-k=t]");
  const f = a.$(".mvh").textContent;
  assert.match(f, /Travailler à Londres/);
  assert.match(f, /Lire 1 page/);
  assert.ok(a.$(".mvh .mvt"), "citation absente");
  a.click("[data-act=hm5]");
  assert.equal(a.$(".mvh"), null, "la fiche doit se fermer");
  assert.ok(a.w.pm && a.w.pm.mini || /5 min/.test(a.text()), "minuteur de 5 min absent");
}));

test("le pourquoi d’un objectif et le plan B d’une tâche sont enregistrés", () => withApp({}, async (a) => {
  a.click("[data-v=g]"); a.click("[data-act=gnew]");
  a.set("gti", "Anglais"); a.set("gdt", day(60)); a.set("gwy", "Pour mon voyage"); a.submit("gf");
  assert.equal(a.state().goals[0].why, "Pour mon voyage");
  assert.match(a.text(), /Pour mon voyage/);
  a.click("[data-v=d]"); a.click("[data-act=add]");
  a.set("title", "Lire"); a.set("pb", "Une page"); a.submit("f");
  assert.equal(a.state().tasks.find((t) => t.title === "Lire").pb, "Une page");
}));

test("en anglais, la motivation s’affiche en anglais", () => withApp({ lang: "en-US", state: base({ tasks: [task({ title: "Study" })] }) }, async (a) => {
  assert.match(a.text(), /Priority of the day/);
  assert.doesNotMatch(a.text(), /Priorité du jour|Une autre citation/);
  a.click("[data-act=open]"); a.click("[data-act=hm]");
  assert.match(a.$(".mvh").textContent, /struggling/);
  a.click("[data-act=hmr][data-k=l]");
  assert.doesNotMatch(a.$(".mvh").textContent, /Ton pourquoi|Pas envie/);
}));

test("dans les 5 autres langues, les textes de motivation retombent sur l’anglais", async () => {
  for (const lang of ["pt-BR", "zh-CN", "hi-IN", "ar-EG", "ru-RU"]) {
    await withApp({ lang, state: base({ tasks: [task({ title: "Study" })] }) }, async (a) => {
      assert.doesNotMatch(a.text(), /Priorité du jour|Une autre citation/, lang);
      a.click(".gear");
      assert.doesNotMatch(a.text(), /Citation du jour|Spiritualité/, lang);
    });
  }
});

test("une tâche liée démarre à la fin réelle de la précédente", () => withApp({
  state: base({ tasks: [task({ id: 3000, title: "Réveil", start: "05:00", dur: 0 }), task({ id: 3001, title: "Méditation", start: "05:00", dur: 15, af: 3000 })] }),
}, async (a) => {
  const m = () => a.state().tasks.find((t) => t.id === 3001);
  a.click("[data-act=done][data-id='3000']");   // fait à 10 h 00 (horloge du test)
  assert.equal(m().start, "10:00");
  assert.match(a.text(), /après Réveil/);
}));

test("le formulaire permet d’enchaîner une nouvelle tâche après une autre", () => withApp({
  state: base({ tasks: [task({ id: 3000, title: "Réveil", start: "05:00", dur: 0 })] }),
}, async (a) => {
  a.click("[data-act=add]"); a.set("title", "Méditation"); a.set("start", "09:00"); a.set("dur", "15"); a.set("af", "3000"); a.submit("f");
  const m = a.state().tasks.find((t) => t.title === "Méditation");
  assert.equal(String(m.af), "3000"); assert.equal(m.start, "05:00");
}));

test("les langues supplémentaires affichent la citation et les menus de motivation dans leur langue", async () => {
  for (const [lang, mot] of [["pt-BR", "Prioridade do dia"], ["zh-CN", "今日重点"], ["hi-IN", "आज की प्राथमिकता"], ["ar-EG", "أولوية اليوم"], ["ru-RU", "Приоритет дня"]]) {
    await withApp({ lang, state: base({ tasks: [task({ title: "Study" })] }) }, async (a) => {
      assert.match(a.text(), new RegExp(mot), lang);
      assert.doesNotMatch(a.$(".mvc .mvt").textContent, /[A-Za-z]{4,} [A-Za-z]{3,} [A-Za-z]{3,}/, lang + " : citation encore en anglais");
    });
  }
});

test("la pause entre tâches liées décale l’heure de départ", () => withApp({
  state: base({ tasks: [task({ id: 3000, title: "Réveil", start: "05:00", dur: 0 }), task({ id: 3001, title: "Méditation", start: "05:00", dur: 15, af: 3000, ag: 10 })] }),
}, async (a) => {
  a.click("[data-act=done][data-id='3000']");
  assert.equal(a.state().tasks.find((t) => t.id === 3001).start, "10:10");
}));

test("bilan du soir : « Écrire dans le journal » ouvre le journal et place le curseur dans la zone de texte", () => withApp({ state: { tasks: [{ id: 3000, title: "Lire", start: "09:00", dur: 30, pri: 2, date: day(0), st: "" }], tpls: [], ob: 1 } }, async (a) => {
  a.w.document.body.insertAdjacentHTML("beforeend", '<button id="xmvb" data-act="mvb">');
  a.click("#xmvb");
  assert.ok(a.$("#jrn"), "la zone de texte du journal doit être affichée");
}));
