const APP_STORE_URL = "https://apps.apple.com/in/app/bombino-expess/id6763043971";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.bombinoexp.app";

module.exports = function handler(req, res) {
  const ua = req.headers["user-agent"] || "";

  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) return res.redirect(302, APP_STORE_URL);
  if (isAndroid) return res.redirect(302, PLAY_STORE_URL);

  // Desktop fallback
  return res.redirect(302, "/index.html");
};
