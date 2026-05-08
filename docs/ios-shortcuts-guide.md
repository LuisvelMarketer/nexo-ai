# NEXO - iOS Shortcuts Setup Guide

NEXO usa **Siri Shortcuts** para ejecutar acciones reales en tu iPhone como hacer llamadas, enviar mensajes y crear recordatorios.

---

## Cómo funciona la integración

```
NEXO (Frontend) → Backend (Django) → Genera acción → Muestra preview
                                                    ↓
                                              Usuario confirma
                                                    ↓
                                        iOS Shortcuts ejecuta acción real
```

---

## Shortcuts que necesitas crear

### 1. Llamar a un contacto

1. Abrí la app **Shortcuts** en tu iPhone
2. Tap **+** para crear nuevo Shortcut
3. Nombre: `NEXO - Llamar`
4. Agregar acción: **Phone** → **Call**
5. En "Contact", elegir **Ask When Run**
6. Tap **+** para agregar otra acción
7. Buscar **Text** → escribir tu mensaje de bienvenida
8. Agregar acción: **Phone** → **Speak Text** (con el mensaje)
9. Agregar acción: **Phone** → **Call**
10. Tocar **Done**

**Mensaje sugerido para el intro:**
> "Hola, soy [Tu Nombre]. Mi asistente NEXO te llama. Un momento por favor."

---

### 2. Enviar mensaje de WhatsApp

1. Abrir **Shortcuts**
2. Tap **+** → Nombre: `NEXO - WhatsApp`
3. Agregar acción: **Apps** → **WhatsApp** → **Send Message**
4. Configurar:
   - Recipient: **Ask When Run**
   - Message: **Magic Variable** (seleccionar "Ask When Run")
5. Done

---

### 3. Crear recordatorio

1. Abrir **Shortcuts**
2. Tap **+** → Nombre: `NEXO - Recordar`
3. Agregar acción: **Reminders** → **Add Reminder**
4. Configurar:
   - Reminder: **Ask When Run**
   - List: **Reminders** (o la lista que prefieras)
5. Done

---

### 4. Agregar a calendario

1. Abrir **Shortcuts**
2. Tap **+** → Nombre: `NEXO - Evento`
3. Agregar acción: **Calendar** → **Add Event**
4. Configurar:
   - Title: **Ask When Run**
   - Date: **Ask When Run**
   - Time: **Ask When Run**
5. Done

---

## Para usar desde NEXO

Cuando NEXO detecta que necesitas hacer una llamada, mostrará:

```
📞 "Llamando a tu esposa..."
┌─────────────────────────────────┐
│  [Preview de la acción]          │
│                                 │
│  📱 +54 11 XXXX XXXX           │
│  Mensaje: "Llego en 10"        │
│                                 │
│  [Confirmar] [Cancelar]        │
└─────────────────────────────────┘
```

Tocás **Confirmar** → Se abre el Shortcut con los datos cargados → Confirmás → Se ejecuta.

---

## Automatización avanzada (Opcional)

### Agregar al Home Screen

1. En el Shortcut, tocar **⋮** (tres puntos)
2. Tocar **Add to Home Screen**
3. Elegir nombre e icono (recomiendo 📞 o 🤖)
4. Agregar

---

### Automatización con ubicación

Si querés que NEXO te recuerde algo cuando llegás a un lugar:

1. Ir a **Shortcuts** → **Automation** → **+**
2. Elegir **Location** → **Arriving** or **Leaving**
3. Elegir ubicación
4. Agregar acción: **Reminders** → **Add Reminder**

---

## Troubleshooting

### El Shortcut no se ejecuta
- Verificá que tenés permiso de acceso a Contacts, Reminders, Calendar
- Ve a **Settings** → **Shortcuts** → verificar permisos

### NEXO no puede abrir WhatsApp directamente
- Solo puede generar el mensaje, vos copiá y pegás en WhatsApp
- O usá el Shortcut de WhatsApp que creaste arriba

### La llamada no se hace automáticamente
- Por seguridad de Apple, siempre requiere confirmación
- Esto es normal y es para proteger tu privacidad

---

## Alternativa: Widget de NEXO

Podés agregar un widget de NEXO en tu Home Screen:

1. Mantené presionado en el Home Screen
2. Tap **+** (esquina superior)
3. Buscar **NEXO** o **Shortcuts**
4. Elegir tamaño (small o medium)
5. Agregar Widget

El widget muestra tus acciones frecuentes para acceso rápido.

---

## Próximas mejoras

- Integración directa con Shortcuts vía URL scheme
- Automatización de respuestas con AI
- Widgets personalizables

---

*Esta guía se actualiza regularmente. Si tenés problemas, contactá al soporte.*
*NEXO v1.0 - iOS Shortcuts Integration*