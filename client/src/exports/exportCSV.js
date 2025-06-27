export const exportToCSV = (questions) => {
  // Define CSV headers
  const headers = ['Question', 'Type', 'Topic', 'Difficulty'];

  // Format each question row
  const rows = questions.map(q => [
    q.title || 'Untitled',
    q.type || '',
    q.topic || '',
    q.difficulty || ''
  ]);

  // Join rows into a CSV string
  const csvContent = [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');

  // Create and trigger CSV download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "questions_export.csv");
  link.click();
};
