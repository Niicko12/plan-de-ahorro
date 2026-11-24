# Mi plan de ahorro

Panel personal para ahorrar hacia una meta grande (un auto, un enganche, un viaje, lo que sea) sin perder de vista los gastos del día a día.

Es una sola página HTML que funciona igual en el celular y en la computadora. Entras con Google o con tu correo, y tus datos se guardan en Firebase (Firestore). Cada persona solo puede ver y editar lo suyo.

![Panel principal con la maqueta 3D, los indicadores y las alertas](docs/panel.png)

> Las capturas usan datos inventados.

## Qué hace

- **Fondos de tu meta.** Divides la meta en partes, por ejemplo enganche, seguro, trámites y emergencia. Cada fondo es un edificio de una maqueta 3D isométrica que se va construyendo conforme ahorras.
- **Una maqueta viva.** El terreno tiene pasto, árboles, flores y un estanque con patos y fuente. Hay muñequitos que caminan con mochila, gorra o bolsa del súper, una persona que pasea a su perro, autos, pájaros, nubes y un globo aerostático. De noche se prenden los faroles y salen luciérnagas. Si tu teléfono pide reducir el movimiento, todo se queda quieto.
- **La maqueta cambia según tu meta.** Si ahorras para un auto, aparece una agencia con un auto girando en la vitrina. Una casa trae una obra con grúa; un viaje, un aeropuerto con un avión que despega; los estudios, una escuela con reloj y bandera; un negocio, un local con toldo. Cualquier otra meta muestra un banco con una alcancía. Se detecta por el nombre de tu meta o lo eliges en Ajustes.
- **Dónde estás hoy.** Patrimonio neto, ahorro, deudas, retiro, cuánto te sobra al mes y tu tasa de ahorro.
- **Alertas.** Fechas límite de tus tarjetas, si vas a tiempo para tu fecha meta, categorías que pasaron su límite y fondos completos.
- **Plan en 4 pasos.** Colchón de emergencia, liquidar deudas, pagos comprometidos y meta, cada paso con su avance.
- **Quincena a quincena.** Proyección de cada pago hasta tu fecha límite, con controles para simular cuánto gastas y qué gastos fijos dejas de pagar.
- **Tarjetas y deudas.** Saldo, tasa anual, día de corte, mejor día para comprar y fecha límite de pago.
- **Calendario de pagos editable.** Se arma con los datos de cada persona: días de pago, fechas de tarjetas, gastos fijos con día y pagos con fecha. Al tocar un día ves lo que hay, lo cambias o agregas un pago, un gasto fijo, dinero por recibir o una tarjeta en esa fecha.
- **Gastos fijos, pagos próximos, dinero por recibir y límites del mes** por categoría.
- **Retiro e inversiones** a largo plazo, en pesos o en UDIs.
- **Consejos con tus números**, por ejemplo "págate primero", qué hacer con el aguinaldo o cuánto ganas si recortas un gasto.
- **Nova, tu asistente.** Le preguntas con tus palabras cosas como "¿cómo voy?", "¿cuánto me queda?", "¿qué tengo que pagar?" o "¿cómo registro un gasto?" y te responde con tus números. También explica términos como día de corte o tasa de ahorro, y trae botones que te llevan directo a cada lugar. Es gratis: funciona en el navegador, sin IA externa, y tus preguntas no se mandan a ningún lado.
- **Deshacer.** Al guardar, editar, borrar, marcar un pago o importar de Gmail aparece **Deshacer** por 7 segundos. Los chips **Pagado ✓**, **Listo ✓** y **Recibido ✓** se tocan para quitar la marca si te equivocaste.
- **Movimientos.** Registro rápido de gastos, ahorros, pagos de deuda e ingresos. Tiene atajos para tus gastos fijos, filtros y opciones para editar y borrar.
- **Gastos desde Gmail.** Toca **✉ Gmail** y la app lee los avisos de compra que te mandan tu banco y PayPal, y los registra como gastos con su monto, fecha, comercio y categoría. Cada persona conecta su propio correo. Es de solo lectura y todo pasa en tu navegador: no hay servidor y no se guarda el correo, solo el gasto. El permiso dura una hora; mientras siga vigente, la app vuelve a revisar al abrirla y cada 10 minutos. Si borras un gasto importado, no se vuelve a importar.
- **Otra moneda.** Muestra tus montos también en otra moneda con el tipo de cambio que tú pongas.
- **Privacidad.** Botón para ocultar montos y bloqueo opcional con PIN.
- **Respaldo.** Descarga e importa tus datos en JSON.
- Tema claro y oscuro, funciona en el celular y sin conexión (se sincroniza al volver).

### Escenarios de la maqueta

| Auto | Casa | Viaje |
|---|---|---|
| ![Agencia de autos](docs/maqueta/auto.png) | ![Casa en obra con grúa](docs/maqueta/casa.png) | ![Aeropuerto con avión](docs/maqueta/viaje.png) |
| **Estudios** | **Negocio** | **Otra meta** |
| ![Escuela con bandera](docs/maqueta/estudios.png) | ![Local con toldo](docs/maqueta/negocio.png) | ![Banco y alcancía](docs/maqueta/general.png) |

### Más pantallas

| Movimientos | Ajustes |
|---|---|
| ![Historial de movimientos y formulario para registrar](docs/movs.png) | ![Ajustes: fechas, sueldo, moneda y listas editables](docs/ajustes.png) |

<p align="center"><img src="docs/login.png" alt="Pantalla de inicio de sesión con Google" width="560"></p>

## Cómo está hecho

- `public/index.html`: toda la app (HTML, CSS y JavaScript sin framework). Las gráficas son SVG hechas a mano y la maqueta usa [three.js](https://threejs.org/).
- Inicio de sesión con **Firebase Authentication**: Google, correo y contraseña (con confirmación de correo obligatoria y recuperación) o enlace al correo sin contraseña.
- Datos en **Cloud Firestore**, en `data/users/{uid}/{documento}`. Hay un documento `config` con tu plan y un documento por movimiento.
- `firestore.rules`: solo el dueño de la cuenta, con correo confirmado, puede leer y escribir sus documentos. Además valida cada movimiento (monto, fecha y tamaño).

### Seguridad

- Los errores al entrar no dicen si un correo tiene cuenta, y hay freno tras varios intentos fallidos.
- Contraseñas de al menos 10 caracteres con mayúscula, minúscula y número, revisadas en la app y exigidas por Firebase.
- Encabezados HTTP: `X-Frame-Options`, `Strict-Transport-Security`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` y una `Content-Security-Policy` básica (en `firebase.json` y `vercel.json`).
- Gmail es de solo lectura y solo se usa cuando la persona toca el botón. El permiso vive en la pestaña unos 55 minutos y no se guardan correos.
- PIN opcional para abrir el panel, guardado como huella (hash), nunca el PIN.
- Funciona en **Vercel** o en **Firebase Hosting**. No hay llaves en el código: en Vercel, `scripts/build-config.mjs` crea `public/firebase-config.js` con variables de entorno; en Firebase Hosting la configuración se carga sola desde `/__/firebase/init.js`.

## Publicar tu propia copia

Necesitas Node.js y una cuenta de Google.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Niicko12/plan-de-ahorro.git
   cd plan-de-ahorro
   ```
2. Inicia sesión en Firebase y crea un proyecto:
   ```bash
   npx firebase-tools login
   npx firebase-tools projects:create mi-ahorro-xxxx
   npx firebase-tools apps:create WEB "Mi plan de ahorro" --project mi-ahorro-xxxx
   ```
3. Copia `.firebaserc.example` a `.firebaserc` y pon el ID de tu proyecto.
4. En la [consola de Firebase](https://console.firebase.google.com/):
   - **Authentication → Método de inicio de sesión → Google → Habilitar.**
   - **Authentication → Método de inicio de sesión → Agregar proveedor → Correo electrónico/contraseña.** Activa los dos interruptores: contraseña y vínculo del correo electrónico.
   - **Authentication → Configuración → Política de contraseñas:** mínimo 10 caracteres, con mayúscula, minúscula y número, en modo **Exigir**.
   - **Authentication → Configuración → Acciones del usuario:** deja activada la protección contra la enumeración de correos.
   - **Firestore Database → Crear base de datos** (edición Standard, modo de producción).
5. Publica las reglas y la página:
   ```bash
   npx firebase-tools deploy
   ```
   Al terminar te da una dirección como `https://mi-ahorro-xxxx.web.app`.

### En Vercel

1. Haz los pasos 1 a 4 de arriba y publica solo las reglas: `npx firebase-tools deploy --only firestore:rules`.
2. Saca la configuración de tu app web con `npx firebase-tools apps:sdkconfig WEB`.
3. Importa el repositorio en Vercel y agrega estas variables de entorno:
   `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` y `FIREBASE_MESSAGING_SENDER_ID`.
4. En Firebase, **Authentication → Configuración → Dominios autorizados**, agrega tu dominio de Vercel (por ejemplo `tu-app.vercel.app`).

### Gastos desde Gmail

Para que funcione el botón **✉ Gmail**, activa la Gmail API en tu proyecto: abre `https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=TU-PROYECTO` y toca **Habilitar**. Es gratis.

Gmail es un permiso restringido de Google. Mientras tu app no pase la verificación de Google, cada persona verá el aviso "Google no verificó esta app" (toca **Configuración avanzada → Ir a…**) y el permiso se puede dar a un máximo de 100 cuentas.

Para probarla en tu computadora usa `npx firebase-tools serve`. Abrir el archivo directamente no funciona, porque la configuración de Firebase solo existe en el servidor.

## Licencia

MIT. Ver [LICENSE](LICENSE).

Los cálculos son orientativos y no sustituyen a un asesor financiero.
