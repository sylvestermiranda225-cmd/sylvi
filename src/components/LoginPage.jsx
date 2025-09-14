import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';

 
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to log in.');

            localStorage.setItem('token', data.token);

            // ## THE FIX: Redirect to '/' which is the Hero page ##
            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back">
            <form onSubmit={handleSubmit}>
                <AuthInput id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} icon={<EmailIcon />} />
                <AuthInput id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} icon={<LockIcon />} />
                
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    type="submit" disabled={loading}
                    className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-semibold rounded-lg text-md px-5 py-3.5 text-center transition-all duration-300 disabled:bg-gray-500"
                >
                    {loading ? 'Signing In...' : 'Log In'}
                </motion.button>

                <p className="text-sm font-light text-gray-400 text-center mt-6">
                    Don't have an account yet? <Link to="/signup" className="font-medium text-cyan-400 hover:underline">Sign Up</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;