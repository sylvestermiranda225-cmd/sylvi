import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import all necessary page and layout components
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Features from './components/Features';
 
import Footer from './components/Footer';
import AppUI from './components/AppUI';
import Chatbot from './components/Chatbot';
import LoginPage from './components/LoginPage';    
import SignupPage from './components/SignupPage';  
import ProtectedRoute from "./components/ProtectedRoute"; // This helper component is required

// This component groups all the sections of the main landing page
const LandingPage = () => (
  <div className="relative z-0 bg-primary">
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar />
      <Hero />
    </div>
    <Features />
 
    <Footer />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes (Everyone can see these) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* --- Protected Routes (Only logged-in users can see these) --- */}
        {/* The main path "/" is now protected. If not logged in, it will redirect to /login. */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent" 
          element={
            <ProtectedRoute>
              <AppUI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } 
        />

        {/* --- Fallback Route --- */}
        {/* If a user enters any other URL, redirect them to the home page, which will then check for auth. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;