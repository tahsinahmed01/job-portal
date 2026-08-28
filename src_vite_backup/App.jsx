import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import JobDetails from './components/JobDetails';
import './App.css';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
