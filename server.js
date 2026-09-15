const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    document: 'Client_TRD.pdf',
    engine: 'Gemini AI + Knowledge RAG',
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Client TRD Chatbot Web App is running!`);
  console.log(`📡 Local Access URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
