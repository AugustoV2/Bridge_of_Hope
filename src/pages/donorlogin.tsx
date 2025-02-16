import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DonorLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://nnr0wds4-8000.inc1.devtunnels.ms/login', {
        email,
        password,
        user_type: 'donor',
      });
      console.log(response.data.message);

      if (response.data.message === 'Login successful' && response.data.Details === 'Yes') {
        localStorage.setItem('donor_id', response.data.donor_id);
        navigate('/DonorHome');
      } 
      else if (response.data.message === 'Login successful' && response.data.Details === 'No') {
        localStorage.setItem('donor_id', response.data.donor_id);
        navigate('/donor');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://nnr0wds4-8000.inc1.devtunnels.ms/register', {
        email,
        password,
        user_type: 'donor',
      });

      if (response.data.user) {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/donor');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex items-center justify-center space-x-3">
          <User className="w-8 h-8 text-rose-500" />
          <h2 className="text-3xl font-extrabold text-gray-900">Donor Login</h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in or create a new donor account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-2xl shadow-rose-100/50 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/select-type')}
                className="text-sm font-medium text-rose-600 hover:text-rose-500 transition-colors"
              >
                ← Back to selection
              </button>
              <div className="text-sm">
                <a href="#" className="font-medium text-rose-600 hover:text-rose-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-rose-100 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Sign in'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-rose-200 rounded-lg shadow-md text-sm font-medium text-rose-600 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Create new account'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorLogin;