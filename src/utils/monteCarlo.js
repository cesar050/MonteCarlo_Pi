export const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

export const runMonteCarloSimulation = (n, seed) => {
  const startTime = performance.now();
  const random = seededRandom(seed);
  
  let insideCircle = 0;
  const points = [];
  
  for (let i = 0; i < n; i++) {
    const u = random() * 2 - 1;
    const v = random() * 2 - 1;
    const isInside = (u * u + v * v) <= 1;
    
    if (isInside) insideCircle++;
    
    if (points.length < 2000 || n <= 10000) {
      points.push({ x: u, y: v, inside: isInside });
    }
  }
  
  const pHat = insideCircle / n;
  const piHat = 4 * pHat;
  const se = 4 * Math.sqrt((pHat * (1 - pHat)) / n);
  const ciLow = piHat - 1.96 * se;
  const ciHigh = piHat + 1.96 * se;
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

export const runMultipleReplicas = (n, numReplicas = 5) => {
  const results = [];
  const baseSeeds = [12345, 67890, 11111, 22222, 33333];
  
  for (let i = 0; i < numReplicas; i++) {
    const seed = baseSeeds[i];
    const result = runMonteCarloSimulation(n, seed);
    results.push({ ...result, replica: i + 1 });
  }
  
  return results;
};

export const runAntitheticSimulation = (n, seed) => {
  const startTime = performance.now();
  const random = seededRandom(seed);
  
  let insideCircle = 0;
  let sumPiHat = 0;
  let sumSquaredPiHat = 0;
  const points = [];
  
  const halfN = Math.floor(n / 2);
  
  for (let i = 0; i < halfN; i++) {
    const u = random() * 2 - 1;
    const v = random() * 2 - 1;
    
    const isInside1 = (u * u + v * v) <= 1;
    const isInside2 = ((-u) * (-u) + (-v) * (-v)) <= 1;
    
    if (isInside1) insideCircle++;
    if (isInside2) insideCircle++;
    
    const piEstimate = 4 * ((isInside1 ? 1 : 0) + (isInside2 ? 1 : 0)) / 2;
    sumPiHat += piEstimate;
    sumSquaredPiHat += piEstimate * piEstimate;
    
    if (points.length < 1000) {
      points.push({ x: u, y: v, inside: isInside1 });
      points.push({ x: -u, y: -v, inside: isInside2 });
    }
  }
  
  const totalN = halfN * 2;
  const pHat = insideCircle / totalN;
  const piHat = 4 * pHat;
  const se = 4 * Math.sqrt((pHat * (1 - pHat)) / totalN);
  const ciLow = piHat - 1.96 * se;
  const ciHigh = piHat + 1.96 * se;
  const runtime = performance.now() - startTime;
  
  const variance = (sumSquaredPiHat / halfN) - Math.pow(sumPiHat / halfN, 2);
  
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
    variance,
    isAntithetic: true
  };
};