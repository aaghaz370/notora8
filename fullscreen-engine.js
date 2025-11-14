// ------------------------------
// NOTORA GLOBAL FULLSCREEN ENGINE
// ------------------------------

(function () {
  if (localStorage.getItem("notora_fullscreen") === "on") {
    const el = document.documentElement;

    if (!document.fullscreenElement) {
      setTimeout(() => {
        el.requestFullscreen().catch(err => {});
      }, 300);
    }
  }
})();
