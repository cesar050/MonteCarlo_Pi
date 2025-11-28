# Simulación Monte Carlo para Estimación de π

## Descripción

Implementación del método Monte Carlo para estimar el valor de π mediante generación de puntos aleatorios en un círculo inscrito en un cuadrado. El proyecto incluye:

- Simulaciones con tamaños de muestra n ∈ {10³, 10⁴, 10⁵, 10⁶}
- 5 réplicas independientes con semillas fijas
- Método de variables antitéticas para comparación

##  Semillas Utilizadas
 Se utilizaron las siguientes semillas fijas en todas las simulaciones:

### Semillas de Réplicas
```javascript
const baseSeeds = [12345, 67890, 11111, 22222, 33333];
```

| Réplica | Semilla | Propósito |
|---------|---------|-----------|
| 1       | 12345   | Semilla estándar en ejemplos de generadores aleatorios |
| 2       | 67890   | Complemento numérico del anterior |
| 3       | 11111   | Patrón simple para facilitar reproducibilidad |
| 4       | 22222   | Patrón simple para facilitar reproducibilidad |
| 5       | 33333   | Patrón simple para facilitar reproducibilidad |

### Justificación de las Semillas

1. **Valores >10,000:** Evitan ciclos cortos en el generador LCG
2. **Patrones simples:** Facilitan la reproducibilidad y verificación manual
3. **Fijas y documentadas:** Cualquier persona puede obtener exactamente los mismos resultados
4. **5 réplicas:** Suficientes para estimar variabilidad sin ser computacionalmente excesivo

### Generador de Números Pseudo-Aleatorios

Se implementó un generador **Linear Congruential Generator (LCG)** con parámetros estándar ANSI C:
```javascript
state = (state × 1664525 + 1013904223) mod 2³²
random() = state / 2³²
```

**Parámetros:**
- Multiplicador (a): 1664525
- Incremento (c): 1013904223
- Módulo (m): 2³² = 4,294,967,296
- Período: 2³²

---

## 🚀 Instalación y Ejecución
```bash
# Clonar el repositorio
git clone https://github.com/cesar050/MonteCarlo_Pi.git

# Entrar al directorio
cd MonteCarlo_Pi/monte-carlo-sim

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:5173
```

## Estructura del Proyecto
```
monte-carlo-sim/
├── src/
│   ├── components/
│   │   ├── MonteCarloSimulation.jsx
│   │   ├── ResultsTable.jsx
│   │   └── Charts.jsx
│   ├── utils/
│   │   ├── monteCarlo.js       # ← Semillas definidas aquí
│   │   └── csvExport.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
