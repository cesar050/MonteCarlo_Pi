// ============================================================================
// GENERADOR DE NÚMEROS PSEUDO-ALEATORIOS
// ============================================================================
// Implementación de Linear Congruential Generator (LCG) con parámetros ANSI C
// Fórmula: state = (state × a + c) mod m
// donde a=1664525, c=1013904223, m=2^32
export const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

// ============================================================================
// SIMULACIÓN MONTE CARLO - INDIVIDUAL
// ============================================================================
// Estima π generando n puntos uniformes en [-1,1]×[-1,1]
// Cuenta cuántos caen dentro del círculo unitario (x²+y²≤1)
// Retorna: π̂ = 4 × (puntos_dentro / n)
export const runMonteCarloSimulation = (n, seed) => {
  const startTime = performance.now();
  const random = seededRandom(seed);
  
  let insideCircle = 0;
  const points = [];
  
  // Muestreo adaptativo para visualización: limita puntos mostrados según n
  let maxPoints;
  if (n <= 1000) {
    maxPoints = n;  // Muestra todos los puntos
  } else if (n <= 10000) {
    maxPoints = 2000;  // Muestra 2,000 puntos
  } else if (n <= 100000) {
    maxPoints = 4000;  // Muestra 4,000 puntos
  } else {
    maxPoints = 6000;  // Muestra 6,000 puntos
  }
  
  const samplingRate = Math.max(1, Math.floor(n / maxPoints));
  
  for (let i = 0; i < n; i++) {
    const u = random() * 2 - 1;  // Coordenada X en [-1, 1]
    const v = random() * 2 - 1;  // Coordenada Y en [-1, 1]
    const isInside = (u * u + v * v) <= 1;  // Verifica si está dentro del círculo
    
    if (isInside) insideCircle++;
    
    // Guarda puntos para visualización (con muestreo)
    if (i % samplingRate === 0 && points.length < maxPoints) {
      points.push({ x: u, y: v, inside: isInside });
    }
  }
  
  // Cálculos estadísticos
  const pHat = insideCircle / n;  // Proporción de puntos dentro
  const piHat = 4 * pHat;  // Estimación de π
  const se = 4 * Math.sqrt((pHat * (1 - pHat)) / n);  // Error estándar
  const ciLow = piHat - 1.96 * se;  // Límite inferior IC 95%
  const ciHigh = piHat + 1.96 * se;  // Límite superior IC 95%
  const runtime = performance.now() - startTime;
  
  return {
    n,
    seed,
    piHat,
    se,
    ciLow,
    ciHigh,
    runtime,
    points,
    insideCircle,
    totalPoints: n
  };
};

// ============================================================================
// SIMULACIÓN MONTE CARLO - MÚLTIPLES RÉPLICAS
// ============================================================================
// Ejecuta R=5 réplicas independientes con semillas FIJAS para reproducibilidad
export const runMultipleReplicas = (n, numReplicas = 5) => {
  const results = [];
  
  // ========================================================================
  // SEMILLAS FIJAS PARA REPRODUCIBILIDAD CIENTÍFICA
  // ========================================================================
  // Estas 5 semillas garantizan que cualquier persona obtenga exactamente
  // los mismos resultados al ejecutar el código.
  //
  // Justificación de los valores:
  // - 12345: Semilla estándar en ejemplos de generadores aleatorios
  // - 67890: Complemento numérico del anterior
  // - 11111, 22222, 33333: Patrones simples que facilitan reproducibilidad
  // - Todas >10,000: Evitan ciclos cortos en el generador LCG
  // ========================================================================
  const baseSeeds = [12345, 67890, 11111, 22222, 33333];
  
  // Ejecuta cada réplica con su semilla correspondiente
  for (let i = 0; i < numReplicas; i++) {
    const seed = baseSeeds[i];  // Selecciona semilla de la réplica i
    const result = runMonteCarloSimulation(n, seed);
    results.push({ ...result, replica: i + 1 });
  }
  
  // Calcula VARIANZA ENTRE RÉPLICAS para medir consistencia del método
  const piHats = results.map(r => r.piHat);
  const meanPiHat = piHats.reduce((sum, pi) => sum + pi, 0) / numReplicas;
  const variance = piHats.reduce((sum, pi) => sum + Math.pow(pi - meanPiHat, 2), 0) / (numReplicas - 1);
  
  return results.map(r => ({ ...r, variance }));
};

// ============================================================================
// VARIABLES ANTITÉTICAS - INDIVIDUAL
// ============================================================================
// Por cada punto (U,V) genera su opuesto (-U,-V) para reducir varianza
// Aprovecha simetría: si (U,V) está dentro, (-U,-V) también (misma distancia)
export const runAntitheticSimulation = (n, seed) => {
  const startTime = performance.now();
  const random = seededRandom(seed);
  
  let insideCircle = 0;
  let sumPiHat = 0;
  let sumSquaredPiHat = 0;
  const points = [];
  
  const halfN = Math.floor(n / 2);  // Solo genera n/2 puntos originales
  
  // Muestreo adaptativo para visualización
  let maxPoints;
  if (n <= 1000) {
    maxPoints = halfN;
  } else if (n <= 10000) {
    maxPoints = 1000;
  } else if (n <= 100000) {
    maxPoints = 2000;
  } else {
    maxPoints = 3000;
  }
  
  const samplingRate = Math.max(1, Math.floor(halfN / maxPoints));
  
  for (let i = 0; i < halfN; i++) {
    const u = random() * 2 - 1;
    const v = random() * 2 - 1;
    
    // Evalúa punto original (U,V) y su antitético (-U,-V)
    const isInside1 = (u * u + v * v) <= 1;  // Punto original
    const isInside2 = ((-u) * (-u) + (-v) * (-v)) <= 1;  // Punto antitético
    
    if (isInside1) insideCircle++;
    if (isInside2) insideCircle++;
    
    // Calcula estimación de π para este par
    const piEstimate = 4 * ((isInside1 ? 1 : 0) + (isInside2 ? 1 : 0)) / 2;
    sumPiHat += piEstimate;
    sumSquaredPiHat += piEstimate * piEstimate;
    
    // Guarda ambos puntos para visualización
    if (i % samplingRate === 0 && points.length < maxPoints * 2) {
      points.push({ x: u, y: v, inside: isInside1 });
      if (points.length < maxPoints * 2) {
        points.push({ x: -u, y: -v, inside: isInside2 });
      }
    }
  }
  
  const totalN = halfN * 2;
  const pHat = insideCircle / totalN;
  const piHat = 4 * pHat;
  const se = 4 * Math.sqrt((pHat * (1 - pHat)) / totalN);
  const ciLow = piHat - 1.96 * se;
  const ciHigh = piHat + 1.96 * se;
  const runtime = performance.now() - startTime;
  
  // Varianza INTERNA del método antitético
  const varianceInternal = (sumSquaredPiHat / halfN) - Math.pow(sumPiHat / halfN, 2);
  
  return {
    n: totalN,
    seed,
    piHat,
    se,
    ciLow,
    ciHigh,
    runtime,
    points,
    insideCircle,
    totalPoints: totalN,
    varianceInternal,
    isAntithetic: true
  };
};

// ============================================================================
// VARIABLES ANTITÉTICAS - MÚLTIPLES RÉPLICAS
// ============================================================================
// Ejecuta R=5 réplicas con método antitético usando las MISMAS semillas fijas
// que el método normal para permitir comparación justa de varianzas
export const runMultipleAntitheticReplicas = (n, numReplicas = 5) => {
  const results = [];
  
  // ========================================================================
  // MISMAS SEMILLAS que el método normal para comparación válida
  // ========================================================================
  const baseSeeds = [12345, 67890, 11111, 22222, 33333];
  
  for (let i = 0; i < numReplicas; i++) {
    const seed = baseSeeds[i];  // Usa la MISMA semilla que método normal
    const result = runAntitheticSimulation(n, seed);
    results.push({ ...result, replica: i + 1 });
  }
  
  // Calcula VARIANZA ENTRE RÉPLICAS para comparar con método normal
  const piHats = results.map(r => r.piHat);
  const meanPiHat = piHats.reduce((sum, pi) => sum + pi, 0) / numReplicas;
  const varianceBetweenReplicas = piHats.reduce((sum, pi) => 
    sum + Math.pow(pi - meanPiHat, 2), 0) / (numReplicas - 1);
  
  return results.map(r => ({ 
    ...r, 
    variance: varianceBetweenReplicas  // Para comparar con método normal
  }));
};

