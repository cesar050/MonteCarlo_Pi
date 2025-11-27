export const exportToCSV = (results) => {
  const headers = ['n', 'replica', 'seed', 'pi_hat', 'SE', 'CI_low', 'CI_high', 'runtime_ms'];
  
  const rows = results.map(r => [
    r.n,
    r.replica,
    r.seed,
    r.piHat.toFixed(6),
    r.se.toFixed(6),
    r.ciLow.toFixed(6),
    r.ciHigh.toFixed(6),
    r.runtime.toFixed(2)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'monte_carlo_results.csv';
  link.click();
  window.URL.revokeObjectURL(url);
};