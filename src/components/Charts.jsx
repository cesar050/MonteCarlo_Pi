import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ErrorBar, ResponsiveContainer } from 'recharts';

const Charts = ({ results }) => {
  if (!results || results.length === 0) return null;

  const aggregatedData = results.reduce((acc, result) => {
    const existing = acc.find(item => item.n === result.n);
    if (existing) {
      existing.piHats.push(result.piHat);
      existing.errors.push(Math.abs(result.piHat - Math.PI));
    } else {
      acc.push({
        n: result.n,
        piHats: [result.piHat],
        errors: [Math.abs(result.piHat - Math.PI)]
      });
    }
    return acc;
  }, []);

  const chartData = aggregatedData.map(item => ({
    n: item.n,
    piHat: item.piHats.reduce((a, b) => a + b, 0) / item.piHats.length,
    errorBar: 1.96 * Math.sqrt(item.piHats.reduce((sum, val) => sum + Math.pow(val - item.piHats.reduce((a, b) => a + b, 0) / item.piHats.length, 2), 0) / item.piHats.length),
    error: item.errors.reduce((a, b) => a + b, 0) / item.errors.length
  })).sort((a, b) => a.n - b.n);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Gráficos de Resultados</h3>
      
      <div style={{ marginBottom: '40px' }}>
        <h4>π̂ vs n (con barras de error 95%)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" label={{ value: 'Tamaño de muestra (n)', position: 'insideBottom', offset: -5 }} />
            <YAxis domain={[2.8, 3.5]} label={{ value: 'π̂', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="piHat" fill="#8884d8" name="π estimado">
              <ErrorBar dataKey="errorBar" width={4} strokeWidth={2} stroke="red" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
          π real = {Math.PI.toFixed(6)}
        </div>
      </div>

      <div>
        <h4>Error Absoluto |π̂ - π| vs n</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" label={{ value: 'Tamaño de muestra (n)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Error Absoluto', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="error" stroke="#ff7300" name="Error Absoluto" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;