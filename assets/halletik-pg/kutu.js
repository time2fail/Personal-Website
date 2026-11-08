/* Hallet İK P&G denemesi kutusu (blog yazıları).

   Yazıda iki işaret olur (tools/yazi-ekle.py ekler):
     <div id="halletik-pg-yer"></div>   ilk bölümden sonra
     <script src="/assets/halletik-pg/kutu.js" defer data-kaynak="https://www.halletik.com"></script>

   Bilgisayarda (≥1040 px) kutu sağ sütunda, Sözlük'ün altında durur; okuyucu dokununca
   büyür. Telefonda yazının içinde, yer tutucunun olduğu yerde durur. Kutunun içi
   halletik'teki /gomulu/pg sayfasıdır; o sayfa "hazir" demezse kutu hiç görünmez.

   Mesajlar (halletik: src/lib/embedMessages.ts):
     çerçeveden: { kaynak: "halletik-pg", tip: "hazir" | "buyut" | "kucult" }
     çerçeveye:  { kaynak: "halletik-pg", tip: "boyut", buyuk: true | false } */
(function () {
  "use strict";

  var script = document.currentScript;
  var yer = document.getElementById("halletik-pg-yer");
  if (!script || !yer) return;

  var origin;
  try {
    origin = new URL(script.getAttribute("data-kaynak") || "https://www.halletik.com").origin;
  } catch (e) {
    return;
  }

  var KAYNAK = "halletik-pg";
  var KAPALI_KEY = "halletik-pg-kapali";
  var HAZIR_SURE_MS = 15000; // kutu bekerken gizli; yavaş mobil bağlantıya pay
  var masaustuMq = window.matchMedia("(min-width: 1040px)");

  var kutu = document.createElement("section");
  kutu.className = "hpg is-bekliyor";
  kutu.setAttribute("aria-label", "P&G denemesi");
  kutu.innerHTML =
    '<div class="hpg-bas">' +
      '<button type="button" class="hpg-ac" aria-expanded="true" aria-controls="hpg-govde">' +
        '<span class="hpg-baslik">P&amp;G DENEMESİ</span>' +
        '<svg class="hpg-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<button type="button" class="hpg-kucult" hidden>Küçült</button>' +
    '</div>' +
    '<div class="hpg-govde" id="hpg-govde"><div class="hpg-cerceve"><iframe title="P&amp;G denemesi (Hallet İK)"></iframe></div></div>';

  var acBtn = kutu.querySelector(".hpg-ac");
  var kucultBtn = kutu.querySelector(".hpg-kucult");
  var iframe = kutu.querySelector("iframe");

  var hazir = false;
  var buyuk = false;
  var kapali = false;
  try { kapali = sessionStorage.getItem(KAPALI_KEY) === "1"; } catch (e) {}

  function masaustu() { return masaustuMq.matches; }
  function yanda() { return kutu.parentElement !== yer; }

  // Bilgisayarda Sözlük'ün yanındaki sütuna, telefonda (ya da sütun yoksa) yer tutucuya
  function yerlestir() {
    var hedef = yer;
    if (masaustu()) {
      var sozluk = document.getElementById("sozluk");
      var layout = sozluk && sozluk.parentElement;
      if (layout && layout.classList.contains("layout")) hedef = layout;
    }
    if (kutu.parentElement !== hedef) hedef.appendChild(kutu); // taşınırsa çerçeve yeniden yüklenir
  }

  function gonder() {
    if (!hazir || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ kaynak: KAYNAK, tip: "boyut", buyuk: !yanda() || buyuk }, origin);
  }

  function guncelle() {
    var genis = yanda() && buyuk && !kapali;
    kutu.classList.toggle("is-kapali", kapali);
    kutu.classList.toggle("is-buyuk", genis);
    acBtn.setAttribute("aria-expanded", kapali ? "false" : "true");
    acBtn.setAttribute("aria-label", kapali ? "P&G denemesini aç" : "P&G denemesini kapat");
    kucultBtn.hidden = !genis;
    // Sözlük yan sütunda kutunun üstüne binmesin; büyük hâl geçici, ona göre kısalmaz
    if (!yanda() || !hazir) document.documentElement.style.setProperty("--halletik-pg-h", "0px");
    else if (!genis) document.documentElement.style.setProperty("--halletik-pg-h", kutu.offsetHeight + 24 + "px");
    gonder();
  }

  function kucult() {
    if (!buyuk) return;
    buyuk = false;
    guncelle();
  }

  function vazgec() {
    window.removeEventListener("message", mesaj);
    kutu.remove();
    document.documentElement.style.removeProperty("--halletik-pg-h");
  }

  function mesaj(e) {
    if (e.origin !== origin || e.source !== iframe.contentWindow) return;
    var m = e.data;
    if (!m || m.kaynak !== KAYNAK) return;
    if (m.tip === "hazir") {
      if (!hazir) {
        hazir = true;
        clearTimeout(zamanlayici);
        kutu.classList.remove("is-bekliyor");
      }
      guncelle();
    } else if (m.tip === "buyut") {
      if (yanda() && !buyuk && !kapali) {
        buyuk = true;
        guncelle();
      }
    } else if (m.tip === "kucult") {
      kucult();
    }
  }

  var zamanlayici = null;

  // Çerçeve kutu ekrana yaklaşınca yüklenir; 8 saniyede "hazir" gelmezse kutu kaldırılır
  function yukle() {
    if (iframe.getAttribute("src")) return;
    iframe.src = origin + "/gomulu/pg";
    zamanlayici = setTimeout(function () { if (!hazir) vazgec(); }, HAZIR_SURE_MS);
  }

  window.addEventListener("message", mesaj);
  yerlestir();
  guncelle();

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) {
        io.disconnect();
        yukle();
      }
    }, { rootMargin: "600px 0px" });
    io.observe(kutu);
    io.observe(yer);
  } else {
    yukle();
  }

  acBtn.addEventListener("click", function () {
    kapali = !kapali;
    if (kapali) buyuk = false;
    try { sessionStorage.setItem(KAPALI_KEY, kapali ? "1" : "0"); } catch (e) {}
    guncelle();
  });
  kucultBtn.addEventListener("click", kucult);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") kucult();
  });
  masaustuMq.addEventListener("change", function () {
    buyuk = false;
    yerlestir();
    guncelle();
  });
})();
