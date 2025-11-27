import { useState } from 'react';
import { runMonteCarloSimulation, runMultipleReplicas, runAntitheticSimulation } from '../utils/monteCarlo';

const MonteCarloSimulation = ({ onResultsUpdate }) => {
  const [currentResult, setCurrentResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSingleSimulation = (n) => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runMonteCarloSimulation(n, Date.now());
      setCurrentResult(result);
      onResultsUpdate(result, 'single');
      setIsSimulating(false);
    }, 100);
  };

  const runReplicasSimulation = (n) => {
    setIsSimulating(true);
    setTimeout(() => {
      const results = runMultipleReplicas(n, 5);
      setCurrentResult(results[0]);
      onResultsUpdate(results, 'replicas');
      setIsSimulating(false);
    }, 100);
  };

  const runWithAntithetics = (n) => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runAntitheticSimulation(n, Date.now());
      setCurrentResult(result);
      onResultsUpdate(result, 'antithetic');
      setIsSimulating(false);
    }, 100);
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '15px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '40px' }}>Simulación Monte Carlo - Estimación de π</h1>
      
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#2196F3', marginBottom: '15px' }}>Simulación Individual</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={() => runSingleSimulation(1000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000 (10³)</button>
          <button onClick={() => runSingleSimulation(10000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 10,000 (10⁴)</button>
          <button onClick={() => runSingleSimulation(100000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 100,000 (10⁵)</button>
          <button onClick={() => runSingleSimulation(1000000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000,000 (10⁶)</button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#FF9800', marginBottom: '15px' }}>5 Réplicas (R=5)</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={() => runReplicasSimulation(1000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000 (10³)</button>
          <button onClick={() => runReplicasSimulation(10000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 10,000 (10⁴)</button>
          <button onClick={() => runReplicasSimulation(100000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 100,000 (10⁵)</button>
          <button onClick={() => runReplicasSimulation(1000000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000,000 (10⁶)</button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>Ejecuta 5 réplicas con semillas distintas: [12345, 67890, 11111, 22222, 33333]</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#9C27B0', marginBottom: '15px' }}>Variables Antitéticas (1-U, 1-V)</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={() => runWithAntithetics(1000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000 (10³)</button>
          <button onClick={() => runWithAntithetics(10000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 10,000 (10⁴)</button>
          <button onClick={() => runWithAntithetics(100000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 100,000 (10⁵)</button>
          <button onClick={() => runWithAntithetics(1000000)} disabled={isSimulating} style={isSimulating ? buttonDisabledStyle : buttonStyle}>n = 1,000,000 (10⁶)</button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>Para cada (U,V) genera (1-U, 1-V) para reducir varianza</p>
      </div>

      {currentResult && (
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Visualización</h2>
            <div style={{ display: 'inline-block', border: '3px solid #000000ff', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'white' }}>
              <svg width="500" height="500" style={{ display: 'block' }}>
                <rect x="0" y="0" width="500" height="500" fill="white" />
                
                <circle 
                  cx="250" 
                  cy="250" 
                  r="250" 
                  fill="none" 
                  stroke="#2196F3" 
                  strokeWidth="3"
                />
                
                {currentResult.points.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={(point.x + 1) * 250}
                    cy={(1 - point.y) * 250}
                    r="2"
                    fill={point.inside ? '#f44336' : '#e0ee1fff'}
                    opacity="0.6"
                  />
                ))}
              </svg>
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#f44336', borderRadius: '50%' }}></div>
                  <span>Dentro del círculo (x² + y² ≤ 1)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#e0ee1fff', borderRadius: '50%' }}></div>
                  <span>Fuera del círculo</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', fontStyle: 'italic' }}>
                Método: Generar puntos uniformes (U,V) en [-1,1]×[-1,1]. Contar cuántos caen dentro del círculo unitario. π ≈ 4 × (puntos_dentro / total_puntos)
              </p>
            </div>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Resultados</h2>
            <div style={{ fontSize: '16px', lineHeight: '2' }}>
              <p><strong>n:</strong> {currentResult.n.toLocaleString()}</p>
              <p><strong>Semilla:</strong> {currentResult.seed}</p>
              {currentResult.replica && <p><strong>Réplica:</strong> {currentResult.replica} de 5</p>}
              {currentResult.isAntithetic && <p><strong>Método:</strong> <span style={{ color: '#9C27B0' }}>Variables Antitéticas</span></p>}
              <p><strong>π̂ (pi_hat):</strong> <span style={{ color: '#2196F3', fontSize: '18px' }}>{currentResult.piHat.toFixed(6)}</span></p>
              <p><strong>π real:</strong> <span style={{ color: '#4CAF50', fontSize: '18px' }}>{Math.PI.toFixed(6)}</span></p>
              <p><strong>Error absoluto |π̂ - π|:</strong> <span style={{ color: '#FF5722' }}>{Math.abs(currentResult.piHat - Math.PI).toFixed(6)}</span></p>
              <p><strong>SE (Error Estándar):</strong> {currentResult.se.toFixed(6)}</p>
              <p><strong>IC 95%:</strong> [{currentResult.ciLow.toFixed(4)}, {currentResult.ciHigh.toFixed(4)}]</p>
              <p><strong>¿π ∈ IC?:</strong> <span style={{ color: currentResult.ciLow <= Math.PI && Math.PI <= currentResult.ciHigh ? '#4CAF50' : '#f44336', fontWeight: 'bold' }}>
                {currentResult.ciLow <= Math.PI && Math.PI <= currentResult.ciHigh ? 'Sí ✓' : 'No ✗'}
              </span></p>
              <p><strong>Tiempo:</strong> {currentResult.runtime.toFixed(2)} ms</p>
              <p><strong>Puntos dentro:</strong> {currentResult.insideCircle.toLocaleString()} / {currentResult.totalPoints.toLocaleString()}</p>
              <p><strong>p̂ = proporción:</strong> {(currentResult.insideCircle / currentResult.totalPoints).toFixed(6)}</p>
              {currentResult.variance !== undefined && (
                <p><strong>Varianza:</strong> {currentResult.variance.toFixed(8)}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonteCarloSimulation;