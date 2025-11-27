import { useState } from 'react';
import MonteCarloSimulation from './components/MonteCarloSimulation';
import ResultsTable from './components/ResultsTable';
import Charts from './components/Charts';
import { exportToCSV } from './utils/csvExport';

function App() {
  const [allResults, setAllResults] = useState([]);

  const handleResultsUpdate = (results, type) => {
    if (type === 'replicas') {
      setAllResults(prev => [...prev, ...results]);
    } else {
      setAllResults(prev => [...prev, results]);
    }
  };

  const clearResults = () => {
    setAllResults([]);
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <MonteCarloSimulation onResultsUpdate={handleResultsUpdate} />
        
        {allResults.length > 0 && (
          <>
            <div style={{ padding: '20px 30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => exportToCSV(allResults)} 
                style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                📊 Exportar CSV
              </button>
              <button 
                onClick={clearResults} 
                style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🗑️ Limpiar Resultados
              </button>
            </div>
            
            <div style={{ backgroundColor: 'white', margin: '20px 30px', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <ResultsTable results={allResults} />
            </div>
            
            <div style={{ backgroundColor: 'white', margin: '20px 30px', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <Charts results={allResults} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;