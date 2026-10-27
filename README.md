# Mapa de Matrícula UOC

Herramienta para planificar la matrícula del Grado en Ingeniería Informática de la UOC:

- **Marcador de créditos** con niveles, hitos y logros (parte de 60 créditos reconocidos por DAM).
- **Ranking de dificultad** (1–5) de cada asignatura, con filtros por tipo y por evaluación.
- **Simulador de matrícula** que avisa de requisitos, incompatibilidades y semestres demasiado cargados.
- **Comparativa de itinerarios** y combinaciones de asignaturas propuestas.

El progreso (asignaturas aprobadas y cesta) se guarda en el `localStorage` del navegador.

## Estructura

```
mapa-uoc/
├── index.html            # Estructura de la página
├── css/
│   └── styles.css        # Estilos y tema claro/oscuro
└── js/
    ├── main.js           # Punto de entrada y gestión de eventos
    ├── data/
    │   ├── asignaturas.js  # Catálogo de asignaturas (dificultad, evaluación, requisitos…)
    │   └── config.js       # Reconocidas, itinerarios, bloques, niveles, combos
    ├── core/
    │   ├── state.js        # Estado y guardado en localStorage
    │   ├── progreso.js     # Cálculo de créditos y niveles
    │   └── utils.js        # Utilidades compartidas
    └── ui/
        ├── marcador.js     # Anillo de créditos, hitos y logros
        ├── ranking.js      # Lista filtrable de asignaturas
        ├── cesta.js        # Simulador de matrícula
        └── itinerarios.js  # Itinerarios y combinaciones
```

## Cómo cambiar cosas

- **Dificultad o textos de una asignatura:** `js/data/asignaturas.js`.
- **Asignaturas reconocidas, niveles o combinaciones:** `js/data/config.js`.
- **Colores y tipografías:** variables al principio de `css/styles.css`.

## Probarlo en local

Usa módulos de JavaScript, así que no funciona abriendo `index.html` con doble clic. Sirve la carpeta con un servidor local:

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

O con la extensión **Live Server** de VS Code.

## Publicarlo

GitHub → **Settings → Pages** → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
