/* ================================================================
   柳背锦 · 个人档案 —— 交互脚本（原生 JS，无框架）
   功能：移动菜单 / 滚动渐显 / 复制联系方式 + Toast /
        证书灯箱 / 导出 PDF / 年份自动更新
   ================================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- 移动端菜单 ---------- */
  function initMenu() {
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.addEventListener("click", e => {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---------- 复制 + Toast ---------- */
  let toastTimer;
  function showToast(msg) {
    const t = $(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
  }

  function copyText(text, msg) {
    const done = () => showToast(msg);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;top:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function initCopy() {
    document.addEventListener("click", e => {
      const toastBtn = e.target.closest("[data-toast]");
      if (toastBtn) { showToast(toastBtn.dataset.toast); return; }
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      copyText(btn.dataset.copy, btn.dataset.msg || "已复制到剪贴板");
    });
  }

  /* ---------- 导出 PDF（调用浏览器打印） ---------- */
  function initPrint() {
    $$("[data-print]").forEach(btn => btn.addEventListener("click", () => window.print()));
  }

  /* ---------- 滚动渐显 ---------- */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    $$(".reveal").forEach(n => io.observe(n));
  }

  /* ---------- 页脚年份 ---------- */
  function initYear() {
    $$("[data-year]").forEach(n => { n.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initCopy();
    initPrint();
    initReveal();
    initYear();
  });
})();
