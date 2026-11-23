// Charge l'application (index.html + fichiers externes) dans jsdom, avec une horloge fixe :
// mercredi 16 décembre 2026, 10 h 00. Les tests sont donc déterministes.
const { JSDOM, VirtualConsole, ResourceLoader } = require("jsdom");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const NOW = new Date(2026, 11, 16, 10, 0, 0).getTime();

class LocalFiles extends ResourceLoader {
  fetch(url) {
    return Promise.resolve(fs.readFileSync(path.join(ROOT, new URL(url).pathname)));
  }
}

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** Date ISO décalée de n jours par rapport à l'horloge fixe. */
const day = (n = 0) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + n);
  return isoDate(d);
};

async function openApp({ lang = "fr-CA", state = null, answers = [] } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (e) => errors.push(e.message));
  const prompts = [];
  const queue = [...answers];

  const dom = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), {
    url: "https://example.test/",
    runScripts: "dangerously",
    resources: new LocalFiles(),
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(w) {
      const RealDate = w.Date;
      let tick = 0;
      w.Date = class extends RealDate {
        constructor(...a) { a.length ? super(...a) : super(NOW); }
        static now() { return NOW + tick++; }
      };
      Object.defineProperty(w.navigator, "language", { value: lang });
      w.confirm = () => true;
      w.prompt = (question, preset) => { prompts.push({ question, preset }); return queue.length ? queue.shift() : null; };
      if (state) w.localStorage.setItem("planner-v2", JSON.stringify(state));
    },
  });
  const w = dom.window;
  await new Promise((resolve) => w.addEventListener("load", resolve));
  const d = w.document;

  const $ = (sel) => d.querySelector(sel);
  const app = {
    w, d, $, prompts, errors,
    all: (sel) => [...d.querySelectorAll(sel)],
    click(sel) {
      const el = $(sel);
      if (!el) throw new Error("Élément introuvable : " + sel);
      el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    },
    set(id, value) { d.getElementById(id).value = value; },
    check(id, on = true) { d.getElementById(id).checked = on; },
    change(id) { d.getElementById(id).dispatchEvent(new w.Event("change", { bubbles: true })); },
    submit(id) { d.getElementById(id).dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true })); },
    state: () => JSON.parse(w.localStorage.getItem("planner-v2")),
    text: () => d.querySelector("main").textContent.replace(/\s+/g, " "),
    toast: () => d.getElementById("toast").textContent,
    close: () => w.close(),
  };
  return app;
}

/** Ouvre l'app, exécute le test, ferme toujours la fenêtre (arrête les minuteries). */
async function withApp(options, fn) {
  const app = await openApp(options);
  try {
    await fn(app);
    if (app.errors.length) throw new Error("Erreurs dans la page : " + app.errors.join(" | "));
  } finally { app.close(); }
}

module.exports = { withApp, openApp, day, NOW };
