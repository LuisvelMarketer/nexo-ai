# NEXO — Especificación Técnica v1.0

> Tu asistente de IA personal. Control total del celular por voz. Jarvis en tu bolsillo.

---

## 1. Visión y Propuesta de Valor

**NEXO** es un asistente de IA conversacional que vive en tu celular y tiene acceso a todas tus herramientas: mensajes, llamadas, agenda, finanzas y más. A diferencia de Siri o Google Assistant, NEXO es proactivo, contextualmente inteligente y controlado por un LLM local (DeepSeek) que entiende lenguaje natural sin complejos menús.

**Tagline:** "Tu vida, simplificada. NEXO lo hace por ti."

**Usuario ideal:** Cualquier persona que use celular múltiples veces al día y quiera hacer más en menos tiempo.

---

## 2. Diseño Visual

### Paleta de colores
```
Primary:        #6C5CE7 (Violet)
Secondary:      #00D9FF (Cyan)
Accent:         #FF6B6B (Coral)
Background:     #0A0A0F (Dark)
Surface:        #1A1A2E (Card)
Text Primary:   #FFFFFF
Text Secondary: #A0A0B0
Success:        #00D9A4
Warning:        #FFD93D
```

### Tipografía
- Headlines: Inter Bold, 24-32px
- Body: Inter Regular, 16px
- Labels: JetBrains Mono, 14px (stats, números)

### Iconografía
- Estilo: Line icons, stroke 1.5px, 24x24px
- Color: Cyan #00D9FF para acciones principales

### Tono de comunicación
- Profesional pero amigable
- Respuestas cortas y directas
- Nunca repetitivo, aprende del usuario
- Nombre: NEXO (gender-neutral, pronounce como "NÉKS-O")

---

## 3. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    iPhone (React Native)               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Chat UI │  │ Voice UI │  │Dashboard │              │
│  └────┬────┘  └────┬─────┘  └────┬─────┘              │
│       │            │            │                     │
│  ┌────▼────────────▼────────────▼─────┐               │
│  │         NEXO SDK (iOS Shortcuts)   │               │
│  └─────────────────┬───────────────────┘               │
└────────────────────┼──────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼──────────────────────────────────┐
│              Django REST API (Backend)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ AI Core  │  │ Finance  │  │ Agenda   │            │
│  │(DeepSeek)│  │ Module   │  │ Module   │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │                    │
│  ┌────▼─────────────▼─────────────▼─────┐             │
│  │          SQLite / PostgreSQL         │             │
│  └───────────────────────────────────────┘            │
└────────────────────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
 WhatsApp       CallKit           SendGrid
 Business API   (Siri Shortcuts)  (Email)
```

---

## 4. Módulos Funcionales

### 4.1 NEXO Core (AI Engine)
**Responsabilidad:** Procesar lenguaje natural y generar acciones

**Flujo:**
1. Usuario escribe/habla → texto
2. Texto → Django API → DeepSeek
3. DeepSeek interpreta intención + contexto
4. Devuelve JSON estructurado con acción
5. NEXO ejecuta acción (Shortcuts, API, DB)

**Capabilities:**
- Reconocimiento de intención (llamar, escribir, buscar, recordar, consultar)
- Extracción de entidades (contactos, fechas, montos, ubicaciones)
- Contexto conversacional (sesión de chat, historial reciente)
- Fallback inteligente (si no entiende, pregunta clarificación)

**Ejemplo de respuesta DeepSeek:**
```json
{
  "action": "send_whatsapp",
  "params": {
    "contact": "esposa",
    "message": "Llego en 10 minutos",
    "confidence": 0.95
  },
  "nexo_response": "Enviando mensaje a tu esposa: 'Llego en 10 minutos' 📨"
}
```

### 4.2 Control Center
**Responsabilidad:** Ejecutar acciones en el celular

**Integraciones:**
- **Siri Shortcuts:** Llamadas, recordatorios, timers
- **WhatsApp Business API:** Mensajes
- **Calendario:** Agregar/leer eventos
- **Contactos:** Buscar info de contactos

**Flujo de ejecución:**
```
Backend devuelve acción → Frontend parsea → Muestra preview
→ Usuario confirma → Ejecuta via Shortcut/Safari → Feedback
```

### 4.3 Finanzas Personales (Supervisor)
**Responsabilidad:** Tracking y alertas de dinero

**Features:**
- Registrar ingresos y gastos (por voz: "Gasté $50 en almuerzo")
- Categorías automáticas (comida, transporte, entretenimiento)
- Alertas proactivas:
  - "Hoy gastaste $200, 80% de tu presupuesto diario"
  - "Esta semana consumiste 60% de tu presupuesto mensual"
- Resumen semanal: "Esta semana ganaste $500, gastaste $320"
- Búsqueda: "¿Cuánto gasté en restaurantes este mes?"

**Categorías predefinidas:**
- 🍔 Comida
- 🚗 Transporte
- 🎬 Entretenimiento
- 🛒 Compras
- 💊 Salud
- 🏠 Hogar
- 📚 Educación
- ✈️ Viajes
- 💰 Ingresos
- 📦 Otros

### 4.4 Agenda Diaria (Agenda + Proactivo)
**Responsabilidad:** Mantener日程 organizado y recordarte

**Features:**
- Agregar eventos por voz: "Tengo reunión mañana a las 9 con Juan"
- Ver día actual: "Qué tengo hoy?"
- Ver mañana: "Qué tengo mañana?"
- Resumen mañana: NEXO te muestra a las 8am tu agenda
- Recordatorios proactivos: "Tienes reunión en 15 minutos en sala 4"
- Cumpleaños detectados desde contactos
- Tareas: "Agregar comprar leche a mi lista"

**Entidades de tiempo:**
- Hoy, mañana, esta semana
- Fechas específicas
- Relativas ("en 2 horas", "la próxima semana")

### 4.5 Búsqueda Local
**Responsabilidad:** Encontrar lugares cercanos

**Features:**
- "Buscame una peluquería cerca"
- "Hay sushi abierto cerca que acepte tarjeta?"
- "Cuál es el银行 más cercano?"
- Filtros: abiertos ahora, rating, distancia, forma de pago
- Navegación: Abre en Maps

**APIs externas:**
- Google Places API / Foursquare
- OpenStreetMap (gratis, sin API key)

### 4.6 Proactividad Engine
**Responsabilidad:** Anticipar necesidades

**Triggers:**
- Hora del día (8am → resumen, 9pm → resumen financiero)
- Eventos próximos (15 min antes de reunión)
- Patrones detectados ("siempre pedís taxi los viernes")

**Ejemplos:**
- "Buenos días! Hoy tienes 3 reuniones, $150 presupuesto restante, clima 22°"
- "Recordatorio: en 15 min tienes llamada con María"
- "Es viernes! Tu patrón dice que pedís delivery. ¿Querés que Reserve en Sushi World?"

---

## 5. Modelos de Datos

### User
```
id, name, phone, email, created_at, preferences (JSON)
```

### Transaction
```
id, user_id, type (income/expense), amount, category,
description, created_at, recurring (bool)
```

### Event
```
id, user_id, title, description, datetime, location,
contact_id, reminder (int minutes), completed (bool)
```

### Contact
```
id, name, phone, whatsapp, email, relationship, birthday
```

### Task
```
id, user_id, title, due_date, completed, priority
```

### Conversation
```
id, user_id, message, direction (in/out), timestamp
```

---

## 6. APIs Externas

| Servicio | Uso | Costo |
|----------|-----|-------|
| DeepSeek API | LLM central | $0 (tier gratuito) |
| Google Places | Búsqueda local | $0-17/mes (free tier) |
| WhatsApp Business API | Mensajes | $0.05/msj |
| SendGrid | Emails | $0-30/mes (free tier) |
| OpenStreetMap | Mapa fallback | Free |
| Apple Maps | Navegación | Free |

---

## 7. Flujo de Usuario (User Journey)

### Día 1 — Onboarding
1. User descarga NEXO
2. Registra nombre, número, email
3. Conecta contactos (permiso iOS)
4. NEXO saluda: "Hola [Nombre]! Soy NEXO. Puedo llamarr, escribir, recordar gastos, agendar eventos y más. Qué necesitas hoy?"
5. Tutorial de 30 segundos: "Di 'Llamá a' o 'Escribile a' seguido del nombre"

### Uso Diario Típico
```
08:00 → "Buenos días NEXO"
       → NEXO: "Buenos días! Hoy: 2 reuniones (10am, 3pm),
          Gastaste $80 esta semana, Clima: 22° soleado.
          Presupuesto remaining: $420. Algo más?"

09:45 → NEXO: "Recordatorio: Reunión con Juan en 15 min"

10:30 → "Gasté $50 en taxi"
       → NEXO: "Registrado: $50 en transporte.
          Te quedan $370 para hoy."

14:00 → "Escribele a mi esposa que llegué"
       → NEXO muestra preview → User confirma → Enviado

19:00 → "Qué tengo mañana?"
       → NEXO: "Mañana: Almuerzo con Ana (12pm),
          Presentación proyecto (4pm), Cena con amigos (8pm)"
```

---

## 8. MVP — Funcionalidades Prioridad 1

### Fase 1 (MVP Core)
- [ ] Chat interface (texto)
- [ ] Voice input (Siri integration)
- [ ] Registrar gastos por voz
- [ ] Ver resumen financiero
- [ ] Agregar eventos a calendario
- [ ] Ver agenda (hoy/manana)
- [ ] Buscar lugares cercanos
- [ ] iOS Shortcuts para llamada (1 toque)

### Fase 2 (Conexiones)
- [ ] WhatsApp Business API
- [ ] Enviar emails
- [ ] Recordatorios proactivos
- [ ] Lista de tareas

### Fase 3 (Proactivo)
- [ ] Resumen matutino automático
- [ ] Alertas de presupuesto
- [ ] Detección de patrones

---

## 9. Stack Técnico

### Backend
- **Framework:** Django 5.x + Django REST Framework
- **Database:** SQLite (dev), PostgreSQL (prod)
- **AI:** DeepSeek API (modelo: deepseek-chat)
- **Task Queue:** Celery + Redis (para proactividad)
- **Hosting:** Render.com / Railway

### Frontend
- **Framework:** React Native (para App Store)
- **Estado:** Zustand
- **Comunicación:** Axios (REST)
- **Voice:** iOS Speech Recognition + AVFoundation

### iOS Shortcuts (Manual setup por usuario)
Guía incluida en onboarding para crear Shortcuts:
- "Llamar a [contacto]"
- "Enviar mensaje WhatsApp"
- "Crear recordatorio"

---

## 10. Revenue Model

| Tier | Precio | Features |
|------|--------|----------|
| **Free** | $0 | 50 actions/day, básico |
| **Pro** | $4.99/mes | Unlimited actions, proactividad, exportación datos |
| **Business** | $14.99/mes | Múltiples usuarios, team dashboard, API access |

**Potencial expansión:**
- Partnerships con bancos (trackeo automático)
- Sponsored results (búsqueda local)
- Affiliate en recomendaciones (restaurants, services)

---

## 11. Métricas de Éxito

- DAU/MAU ratio > 40%
- Actions per session > 5
- 7-day retention > 50%
- NPS > 50
- Top action: Registrar gastos (most used)
- Top action: Ver agenda (second most used)

---

## 12. Competitors

| App | Qué les falta | NEXO se diferencia |
|-----|--------------|-------------------|
| Siri | No proactivo, no contexto financiero | Todo en uno |
| Google Assistant | Mismos problemas | Interfaz superior |
| Siri Shortcuts | No es IA, requiere programación manual | IA que entiende contexto |
| Notion | No conversacional | Chat nativo |
| Todoist | No tiene IA ni integración | IA + todo |

---

## 13. Roadmap

### Semana 1-2: Backend + AI Core
- Django setup
- DeepSeek integration
- Endpoints básicos

### Semana 3-4: Frontend MVP
- React Native setup
- Chat UI
- Voice input
- Finance module

### Semana 5-6: Integraciones
- iOS Shortcuts setup flow
- Calendario integration
- Búsqueda local

### Semana 7-8: Testing + Deploy
- TestFlight (iOS)
- Bug fixes
- App Store submission

---

## 14. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Apple rechaza Shortcuts | Media | Documentación clara, alternativa web |
| DeepSeek outage | Baja | Cache respuestas, fallback a respuestas predefinidas |
| WhatsApp API restricciones | Alta | Empezar sin WhatsApp, ofrecer después |
| Usuarios no entiende valor | Media | Tutorial onboarding fuerte |

---

*Documento vivo. Actualizar con cada sprint.*
*NEXO v1.0 — 2026*