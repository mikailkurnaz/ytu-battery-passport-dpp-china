(() => {
  const app = document.getElementById("app");
  if (!app) return;

  const state = { tab: "overview", data: null, error: null };

  const TABS = [
    { id: "overview", label: "Genel Kimlik" },
    { id: "materials", label: "Malzeme" },
    { id: "sustainability", label: "Sürdürülebilirlik" },
    { id: "compliance", label: "Uyumluluk" },
    { id: "recycling", label: "Geri Dönüşüm / EPR" }
  ];

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const kv = (k, v) =>
    `<div class="kv"><div class="k">${esc(k)}</div><div class="v">${esc(v ?? "Veri mevcut değil")}</div></div>`;

  function tabsHTML() {
    return `
      <div class="tabs">
        ${TABS.map(t => `<button class="tab ${state.tab === t.id ? "active" : ""}" data-tab="${t.id}">${esc(t.label)}</button>`).join("")}
      </div>
    `;
  }

  function overviewHTML(d) {
    const p = d.chinaPassport || {};
    const g = d.generalIdentity || {};
    return `
      <h1>Çin Batarya Pasaportu</h1>
      <div class="sub">Demo | Çin pasaportu ekranı (ayrı repo)</div>
      ${tabsHTML()}
      <div class="row">
        <div class="box">
          ${kv("Pasaport ID", p.passportId)}
          ${kv("Versiyon", p.version)}
          ${kv("Durum", p.status)}
          ${kv("Son Güncelleme", p.lastUpdate)}
        </div>
        <div class="box">
          ${kv("Üretici", g.manufacturer)}
          ${kv("Pil Kategorisi", g.batteryCategory)}
          ${kv("Üretim Yeri", g.productionPlace)}
          ${kv("Üretim Tarihi", g.productionDate)}
          ${kv("Model", g.model)}
          ${kv("Ağırlık", g.weight)}
          ${kv("Kimya", g.chemistry)}
          ${kv("İzlenebilirlik Kodu", g.traceabilityCode)}
        </div>
      </div>
    `;
  }

  function materialsHTML(d) {
    const m = d.materials || {};
    return `
      <h1>Malzeme</h1>
      <div class="sub">Kritik ham maddeler & tehlikeli maddeler (demo)</div>
      ${tabsHTML()}
      <div class="row">
        <div class="box">
          ${kv("Kritik Ham Maddeler", m.criticalRawMaterials)}
          ${kv("Tehlikeli Maddeler", m.hazardousSubstances)}
        </div>
        <div class="box">
          <div class="sub">Not: Çin pasaportu için ileride detaylı bileşim eklenebilir.</div>
        </div>
      </div>
    `;
  }

  function sustainabilityHTML(d) {
    const s = d.sustainability || {};
    return `
      <h1>Sürdürülebilirlik</h1>
      <div class="sub">Sorumlu tedarik & geri dönüştürülmüş içerik (demo)</div>
      ${tabsHTML()}
      <div class="row">
        <div class="box">
          ${kv("Sorumlu Tedarik Raporu", s.responsibleSourcingReport)}
          ${kv("Geri Dönüştürülmüş İçerik Payı", s.recycledContentShare)}
          ${kv("Yenilenebilir İçerik Payı", s.renewableContentShare)}
        </div>
        <div class="box">
          <div class="sub">Not: Bu alanlar gerçek üretim verileri ile güncellenecektir.</div>
        </div>
      </div>
    `;
  }

  function complianceHTML(d) {
    const c = d.compliance || {};
    return `
      <h1>Uyumluluk</h1>
      <div class="sub">China RoHS / CCC / GB standartları (demo)</div>
      ${tabsHTML()}
      <div class="row">
        <div class="box">
          ${kv("China RoHS", c.chinaRoHS)}
          ${kv("CCC", c.ccc)}
          ${kv("GB Standartları", c.gbStandards)}
        </div>
        <div class="box">
          <div class="sub">Not: Sertifika numarası/test adı bu demo ekranda gösterilmez.</div>
        </div>
      </div>
    `;
  }

  function recyclingHTML(d) {
    const r = d.recycling || {};
    return `
      <h1>Geri Dönüşüm / EPR</h1>
      <div class="sub">EPR ve take-back bilgileri (demo)</div>
      ${tabsHTML()}
      <div class="row">
        <div class="box">
          ${kv("EPR Bilgisi", r.eprInfo)}
          ${kv("Geri Alma / Take-back", r.takeBackInfo)}
        </div>
        <div class="box">
          <div class="sub">Not: Çin yerel mevzuatına göre özelleştirilecektir.</div>
        </div>
      </div>
    `;
  }

  function contentHTML(d) {
    if (state.tab === "overview") return overviewHTML(d);
    if (state.tab === "materials") return materialsHTML(d);
    if (state.tab === "sustainability") return sustainabilityHTML(d);
    if (state.tab === "compliance") return complianceHTML(d);
    if (state.tab === "recycling") return recyclingHTML(d);
    return overviewHTML(d);
  }

  function wire() {
    app.querySelectorAll("[data-tab]").forEach(btn => {
      btn.onclick = () => { state.tab = btn.getAttribute("data-tab"); render(); };
    });
  }

  function render() {
    const d = state.data || {};
    app.innerHTML = contentHTML(d) + (state.error ? `<pre style="margin-top:12px;color:#fff;background:#000;padding:10px;border-radius:12px;">${esc(state.error)}</pre>` : "");
    wire();
  }

  async function load() {
    try {
      const r = await fetch("./passport.json?ts=" + Date.now(), { cache: "no-store" });
      const j = await r.json();
      state.data = j;
      state.error = null;
    } catch (e) {
      state.data = {};
      state.error = "passport.json okunamadı: " + (e.message || String(e));
    }
    render();
  }

  load();
})();
