// Genera public/firebase-config.js a partir de variables de entorno.
// En Firebase Hosting no hace falta: si no hay variables, el archivo
// carga la configuración automática de /__/firebase/init.js.
import { writeFileSync } from 'node:fs';

const env = process.env;
const cfg = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  appId: env.FIREBASE_APP_ID,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
};
const ok = cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId;
const out = ok
  ? `if (window.firebase && !firebase.apps.length) firebase.initializeApp(${JSON.stringify(cfg)});\n`
  : `document.write('<script src="/__/firebase/init.js"><\\/script>');\n`;
writeFileSync(new URL('../public/firebase-config.js', import.meta.url), out);
console.log(ok ? 'firebase-config.js: configuración desde variables de entorno' : 'firebase-config.js: usando /__/firebase/init.js');
