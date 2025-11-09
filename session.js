// Global session restore (runs on every Notora page)
(function(){
  try {
    const user = localStorage.getItem("notoraUser");
    const token = localStorage.getItem("notoraToken");

    if (!user || !token) {
      const cookies = Object.fromEntries(document.cookie.split("; ").map(c => c.split("=")));
      if (cookies.notoraUser && cookies.notoraToken) {
        localStorage.setItem("notoraUser", decodeURIComponent(cookies.notoraUser));
        localStorage.setItem("notoraToken", cookies.notoraToken);
        console.log("✅ Restored session globally from cookies");
      }
    }
  } catch (err) {
    console.error("Global session restore failed:", err);
  }
})();
