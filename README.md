# NEXO - Tu asistente IA personal 📱

> Jarvis en tu bolsillo. Control total del celular por voz.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 🎯 Qué es NEXO?

**NEXO** es un asistente de IA conversacional que vive en tu celular y tiene acceso a todas tus herramientas: mensajes, llamadas, agenda, finanzas y más. A diferencia de Siri o Google Assistant, NEXO es proactivo, contextualmente inteligente y controlado por DeepSeek.

### Características principales

- 🗣️ **Control por voz** - Decí lo que necesitás, NEXO lo hace
- 💰 **Finanzas personales** - Tracking automático de gastos e ingresos
- 📅 **Agenda inteligente** - Eventos, tareas y recordatorios proactivos
- 📞 **Llamadas y mensajes** - Integración con iOS Shortcuts
- 🔍 **Búsqueda local** - Encontrá lugares cerca tuyo
- 🤖 **IA con contexto** - Aprende de vos y se anticipa

---

## 🚀 Inicio rápido

### Prerequisites

- Python 3.9+
- Node.js 18+
- Git
- Cuenta de DeepSeek API (gratuita)

### 1. Clonar el repositorio

```bash
git clone https://github.com/LuisvelMarketer/nexo-ai.git
cd nexo-ai
```

### 2. Configurar Backend (Django)

```bash
cd backend

# Crear virtual environment
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu DEEPSEEK_API_KEY

# Migrar base de datos
python manage.py migrate

# Crear super usuario (opcional)
python manage.py createsuperuser

# Correr servidor
python manage.py runserver 8080
```

### 3. Configurar Frontend (Next.js)

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Correr desarrollo
npm run dev
```

### 4. Abrir en navegador

```
Backend API:  http://localhost:8080
Frontend:     http://localhost:3000
```

---

## 📁 Estructura del proyecto

```
nexo-ai/
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   └── nexo/
│       ├── settings.py      # Configuración Django
│       ├── urls.py          # Rutas principales
│       ├── users/           # Modelo de usuario
│       ├── core/            # Conversaciones, preferencias
│       ├── finance/         # Transacciones, presupuestos
│       ├── agenda/          # Eventos, tareas
│       ├── contacts/        # Contactos
│       └── api/
│           ├── views.py     # Endpoints de la API
│           ├── serializers.py
│           └── urls.py
│
├── frontend/                 # Next.js App
│   ├── package.json
│   └── src/
│       ├── app/             # Páginas (layout, page)
│       ├── components/      # Componentes UI
│       ├── screens/         # Pantallas (Dashboard, Chat, etc)
│       ├── services/        # Llamadas a la API
│       ├── store/           # Estado global (Zustand)
│       ├── theme/           # Colores, estilos
│       └── types/           # TypeScript types
│
├── docs/                     # Documentación
│   └── ios-shortcuts-guide.md
│
├── SPEC.md                   # Especificación técnica
└── README.md                 # Este archivo
```

---

## 🎨 Diseño

### Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#6C5CE7` | Acciones principales, botones |
| Secondary | `#00D9FF` | Acentos, elementos destacados |
| Accent | `#FF6B6B` | Alertas, gastos |
| Background | `#0A0A0F` | Fondo principal |
| Surface | `#1A1A2E` | Tarjetas, elementos elevados |
| Success | `#00D9A4` | Ingresos, confirmaciones |
| Warning | `#FFD93D` | Alertas, recordatorios |

### Tipografía

- **Headlines:** Inter Bold, 24-32px
- **Body:** Inter Regular, 16px
- **Stats/Números:** JetBrains Mono, 14px

---

## 🔌 APIs

### Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/chat/` | Chat con NEXO (DeepSeek) |
| GET | `/api/dashboard/` | Resumen del dashboard |
| GET/POST | `/api/transactions/` | Transacciones |
| GET/POST | `/api/events/` | Eventos del calendario |
| GET/POST | `/api/tasks/` | Tareas |
| GET/POST | `/api/contacts/` | Contactos |
| GET | `/api/agenda/today/` | Agenda de hoy |
| GET | `/api/agenda/tomorrow/` | Agenda de mañana |
| POST | `/api/expense/` | Registrar gasto rápido |

### Ejemplo de uso

```javascript
// Registrar un gasto
POST /api/expense/
{
  "text": "Gasté $50 en almuerzo"
}

// Respuesta
{
  "id": 1,
  "type": "expense",
  "amount": 50,
  "category": "food",
  "description": "Gasté $50 en almuerzo",
  "created_at": "2026-05-08T14:30:00Z"
}
```

---

## 📱 iOS Shortcuts

NEXO se integra con Siri Shortcuts para ejecutar acciones reales en tu iPhone.

Ver la [guía completa](docs/ios-shortcuts-guide.md) para configurar.

### Shortcuts básicos necesarios

1. **NEXO - Llamar** - Para hacer llamadas
2. **NEXO - WhatsApp** - Para enviar mensajes
3. **NEXO - Recordar** - Para crear recordatorios
4. **NEXO - Evento** - Para agregar al calendario

---

## 🚢 Deploy

### Railway (Recomendado)

1. Conectar repo de GitHub en [Railway](https://railway.app)
2. Agregar variable: `DEEPSEEK_API_KEY`
3. Deploy automático

### Render

1. Crear Web Service en [Render](https://render.com)
2. Conectar repo
3. Build command: `cd backend && pip install -r requirements.txt`
4. Start command: `cd backend && gunicorn nexo.wsgi:application`
5. Agregar variable: `DEEPSEEK_API_KEY`

---

## 🧪 Testing

### Backend

```bash
cd backend
python manage.py test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## 📈 Roadmap

- [ ] **v1.1** - Integración WhatsApp Business API
- [ ] **v1.2** - Notificaciones push proactivas
- [ ] **v2.0** - App nativa iOS (React Native)
- [ ] **v2.1** - App nativa Android
- [ ] **v2.2** - Widgets de Home Screen
- [ ] **v3.0** - Modo offline (LLM local)

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear branch (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -m 'Agregar nueva función'`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abrir Pull Request

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

## 📧 Contacto

- **GitHub:** [LuisvelMarketer](https://github.com/LuisvelMarketer)
- **Email:** luisvel@velatix.ai

---

*Hecho con ❤️ por Luis Alfredo Velasquez Duran*
*NEXO v1.0 - 2026*