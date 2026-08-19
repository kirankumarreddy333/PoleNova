import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Poles from './pages/Poles.jsx';
import PoleDetails from './pages/PoleDetails.jsx';
import Faults from './pages/Faults.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/poles"
        element={
          <ProtectedRoute>
            <Poles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/poles/:id"
        element={
          <ProtectedRoute>
            <PoleDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faults"
        element={
          <ProtectedRoute>
            <Faults />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
