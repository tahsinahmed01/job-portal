const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const jobs = [
  { id: 1, title: 'React Developer', company: 'TechCorp', location: 'Dhaka (Remote)', salary: '$60,000/yr' },
  { id: 2, title: 'UI/UX Designer', company: 'DesignStudio', location: 'Chittagong', salary: '$45,000/yr' },
  { id: 3, title: 'Backend Node.js Engineer', company: 'CodeLab', location: 'Sylhet (Hybrid)', salary: '$70,000/yr' }
];

app.get('/', (req, res) => {
  res.send('Job Portal Server is Running!');
});

app.get('/jobs', (req, res) => {
  res.json(jobs);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});