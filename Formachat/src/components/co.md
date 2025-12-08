Got it. Here's the content for your 4 cards:

---

**Card 1: Beta Perks**
- Free access during entire beta period
- 40% off for first 6 months after launch
- Direct input on feature roadmap
- Priority support from founders
- First access to new features before public release

Status: `available`

---

**Card 2: What's Live Now**
- AI-powered chat widget with Grok and vector search
- Multi-channel deployment: web embed, iframe, direct URL, QR codes
- Real-time analytics dashboard tracking sessions and leads
- Business profile manager with instant updates
- Automated session lifecycle management

Status: `available`

---

**Card 3: Under The Hood**
- Vector embeddings powered by Pinecone for intelligent responses
- Smart session management with hourly health checks
- Intelligent context retrieval across conversations
- Production-ready scalable infrastructure
- Automated workflow optimization

Status: `available`

---

**Card 4: Coming Soon**
- WhatsApp and Telegram integration
- Voice conversation support
- OAuth login with Google and GitHub
- Payment processing through chat
- Developer API and API key access
- AI agents for autonomous conversations

Status: `coming-soon`

---

Clean. Direct. No BS. Ready to drop into your component.



response


Live reload enabled.
widget.js:73 [Formachat Widget] Initialized
 [App] Initializing FormaChat Frontend...
 [App] Embed/Widget mode detected.
 [Router] Processing path: "/chat/6907f9dacb1e52ba321f2a8d" | Embed Mode: true
 [Router] Embed mode active
 [Router] 💬 Loading chat widget... Object
 [Chat Widget] Initializing... Object
 [BusinessService] Fetching business: 6907f9dacb1e52ba321f2a8d (public: true)
 [BusinessService] Using endpoint: http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d
 [API Cache] Creating new request: GET:http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d:
 [API] No access token available!
executeRequest @ api.utils.ts?t=1765184406270:111Understand this warning
 [API] Making request: Object
main.ts:15 [App] Initializing FormaChat Frontend...
main.ts:26 [App] Embed/Widget mode detected.
router.ts:96 [Router] Processing path: "/chat/6907f9dacb1e52ba321f2a8d" | Embed Mode: true
router.ts:117 [Router] Embed mode active
router.ts:177 [Router] 💬 Loading chat widget... Object
chat-widget.ts:270 [Chat Widget] Initializing... Object
business.service.ts:53 [BusinessService] Fetching business: 6907f9dacb1e52ba321f2a8d (public: true)
business.service.ts:59 [BusinessService] Using endpoint: http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d
api.utils.ts:56 [API Cache] Creating new request: GET:http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d:
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160Understand this warning
api.utils.ts:174 [API] Making request: Object
 [BusinessService] ✓ Fetched business: Bright Minds Tutoring Fashion 3
 [ChatService] Creating session for business: 6907f9dacb1e52ba321f2a8d
 [API] No access token available!
executeRequest @ api.utils.ts?t=1765184406270:111Understand this warning
 [API] Added X-Idempotency-Key: idmp_1765184424449_z3awlrad3d
 [API] Making request: Object
business.service.ts:67 [BusinessService] ✓ Fetched business: Bright Minds Tutoring Fashion 3
chat.service.ts:24 [ChatService] Creating session for business: 6907f9dacb1e52ba321f2a8d
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160Understand this warning
api.utils.ts:170 [API] Added X-Idempotency-Key: idmp_1765184424464_zfj34pe3di
api.utils.ts:174 [API] Making request: Object
 [ChatService] ✓ Session created: 209c1371-d4d4-44fd-b8b1-b3c6be18a5fe
chat.service.ts:34 [ChatService] ✓ Session created: 6fb43fa1-40ba-4a85-a7e0-597249e3084a
 [ChatService] Sending message to session: 209c1371-d4d4-44fd-b8b1-b3c6be18a5fe
 [API] No access token available!
executeRequest @ api.utils.ts?t=1765184406270:111
apiFetch @ api.utils.ts?t=1765184406270:93
apiPost @ api.utils.ts?t=1765184406270:210
sendChatMessage @ chat.service.ts?t=1765184406270:16
handleSend @ chat-widget.ts?t=1765184406270:411
(anonymous) @ chat-widget.ts?t=1765184406270:428Understand this warning
 [API] Added X-Idempotency-Key: idmp_1765184468792_spddq46kpf
 [API] Making request: {url: 'http://localhost:4002/api/chat/session/209c1371-d4d4-44fd-b8b1-b3c6be18a5fe/message/stream', method: 'POST', headers: {…}, hasBody: true}
 [API] Non-JSON response received: {url: 'http://localhost:4002/api/chat/session/209c1371-d4d4-44fd-b8b1-b3c6be18a5fe/message/stream', status: 200, contentType: 'text/event-stream'}
executeRequest @ api.utils.ts?t=1765184406270:159
await in executeRequest
apiFetch @ api.utils.ts?t=1765184406270:93
apiPost @ api.utils.ts?t=1765184406270:210
sendChatMessage @ chat.service.ts?t=1765184406270:16
handleSend @ chat-widget.ts?t=1765184406270:411
(anonymous) @ chat-widget.ts?t=1765184406270:428Understand this error
 [API] HTML Response: data: {"chunk":"Hi"}

data: {"chunk":"!"}

data: {"chunk":" Welcome"}

data: {"chunk":" to"}

data: {"chunk":" Bright"}

data: {"chunk":" Minds"}

data: {"chunk":" Tutor"}

data: {"chunk":"ing"}

data: {"chunk":"."}

data: {"chunk":" How"}

data: {"chunk":" can"}

data: {"chunk":" I"}

data: {"chunk":" assist"}

data: {"chunk":" you"}

data: {"chunk":" with"}

data: {"chunk":" your"}

data: {"chunk":" learning"}

data: {"chunk":" goals"}

data: {"chunk":" today"}

data: {"chunk":"?"}

data: [DON
executeRequest @ api.utils.ts?t=1765184406270:165
await in executeRequest
apiFetch @ api.utils.ts?t=1765184406270:93
apiPost @ api.utils.ts?t=1765184406270:210
sendChatMessage @ chat.service.ts?t=1765184406270:16
handleSend @ chat-widget.ts?t=1765184406270:411
(anonymous) @ chat-widget.ts?t=1765184406270:428Understand this error
main.ts:15 [App] Initializing FormaChat Frontend...
main.ts:26 [App] Embed/Widget mode detected.
router.ts:96 [Router] Processing path: "/chat/6907f9dacb1e52ba321f2a8d" | Embed Mode: true
router.ts:117 [Router] Embed mode active
router.ts:177 [Router] 💬 Loading chat widget... {businessId: '6907f9dacb1e52ba321f2a8d', embedMode: true}
chat-widget.ts:270 [Chat Widget] Initializing... {businessId: '6907f9dacb1e52ba321f2a8d', isEmbedMode: true}
business.service.ts:53 [BusinessService] Fetching business: 6907f9dacb1e52ba321f2a8d (public: true)
business.service.ts:59 [BusinessService] Using endpoint: http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d
api.utils.ts:56 [API Cache] Creating new request: GET:http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d:
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160
(anonymous) @ api.utils.ts:132
getCachedRequest @ api.utils.ts:57
apiFetch @ api.utils.ts:132
apiGet @ api.utils.ts:276
getBusinessById @ business.service.ts:61
renderChatWidget @ chat-widget.ts:277
(anonymous) @ router.ts:180
handleRoute @ router.ts:121
init @ router.ts:160
initApp @ main.ts:28
(anonymous) @ main.ts:64Understand this warning
api.utils.ts:174 [API] Making request: {url: 'http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d', method: 'GET', headers: {…}, hasBody: false}
main.ts:15 [App] Initializing FormaChat Frontend...
main.ts:26 [App] Embed/Widget mode detected.
router.ts:96 [Router] Processing path: "/chat/6907f9dacb1e52ba321f2a8d" | Embed Mode: true
router.ts:117 [Router] Embed mode active
router.ts:177 [Router] 💬 Loading chat widget... {businessId: '6907f9dacb1e52ba321f2a8d', embedMode: true}
chat-widget.ts:270 [Chat Widget] Initializing... {businessId: '6907f9dacb1e52ba321f2a8d', isEmbedMode: true}
business.service.ts:53 [BusinessService] Fetching business: 6907f9dacb1e52ba321f2a8d (public: true)
business.service.ts:59 [BusinessService] Using endpoint: http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d
api.utils.ts:56 [API Cache] Creating new request: GET:http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d:
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160
(anonymous) @ api.utils.ts:132
getCachedRequest @ api.utils.ts:57
apiFetch @ api.utils.ts:132
apiGet @ api.utils.ts:276
getBusinessById @ business.service.ts:61
renderChatWidget @ chat-widget.ts:277
(anonymous) @ router.ts:180
handleRoute @ router.ts:121
init @ router.ts:160
initApp @ main.ts:28
(anonymous) @ main.ts:64Understand this warning
api.utils.ts:174 [API] Making request: {url: 'http://localhost:4001/api/v1/businesses/public/6907f9dacb1e52ba321f2a8d', method: 'GET', headers: {…}, hasBody: false}
business.service.ts:67 [BusinessService] ✓ Fetched business: Bright Minds Tutoring Fashion 3
chat.service.ts:24 [ChatService] Creating session for business: 6907f9dacb1e52ba321f2a8d
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160
apiFetch @ api.utils.ts:135
apiPost @ api.utils.ts:284
createChatSession @ chat.service.ts:26
renderChatWidget @ chat-widget.ts:290
await in renderChatWidget
(anonymous) @ router.ts:180
handleRoute @ router.ts:121
init @ router.ts:160
initApp @ main.ts:28
(anonymous) @ main.ts:64Understand this warning
api.utils.ts:170 [API] Added X-Idempotency-Key: idmp_1765184557122_b6b82yts03
api.utils.ts:174 [API] Making request: {url: 'http://localhost:4002/api/chat/session/create', method: 'POST', headers: {…}, hasBody: true}
business.service.ts:67 [BusinessService] ✓ Fetched business: Bright Minds Tutoring Fashion 3
chat.service.ts:24 [ChatService] Creating session for business: 6907f9dacb1e52ba321f2a8d
api.utils.ts:160 [API] No access token available!
executeRequest @ api.utils.ts:160
apiFetch @ api.utils.ts:135
apiPost @ api.utils.ts:284
createChatSession @ chat.service.ts:26
renderChatWidget @ chat-widget.ts:290
await in renderChatWidget
(anonymous) @ router.ts:180
handleRoute @ router.ts:121
init @ router.ts:160
initApp @ main.ts:28
(anonymous) @ main.ts:64Understand this warning
api.utils.ts:170 [API] Added X-Idempotency-Key: idmp_1765184557130_nvkna8yr2r
api.utils.ts:174 [API] Making request: {url: 'http://localhost:4002/api/chat/session/create', method: 'POST', headers: {…}, hasBody: true}
chat.service.ts:34 [ChatService] ✓ Session created: 640b84ea-acbf-4613-8573-cdd15e4d85a2
chat.service.ts:34 [ChatService] ✓ Session created: 6f827783-84d6-4de6-9eaa-1c343ea2c120