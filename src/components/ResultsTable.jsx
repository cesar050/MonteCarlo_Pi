const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <h3>Tabla de Resultados</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>n</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Réplica</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Semilla</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>π̂</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>SE</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>IC Inferior</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>IC Superior</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tiempo (ms)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.n.toLocaleString()}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.replica || 1}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.seed}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.piHat.toFixed(6)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.se.toFixed(6)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.ciLow.toFixed(6)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.ciHigh.toFixed(6)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.runtime.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;