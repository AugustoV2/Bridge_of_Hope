import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    donationPreferences: [] as string[],
  });

  const donationTypes = ['Monetary', 'Food', 'Clothing', 'Medical Supplies', 'Educational Materials'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://nnr0wds4-8000.inc1.devtunnels.ms/donor', {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        donation_preferences: formData.donationPreferences,
        donor_id: localStorage.getItem('donor_id'),
      });

      toast.success(response.data.message || 'Profile created successfully!');
      navigate('/DonorHome'); // Redirect after success
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      donationPreferences: prev.donationPreferences.includes(preference)
        ? prev.donationPreferences.filter((p) => p !== preference)
        : [...prev.donationPreferences, preference],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Donor Profile</h2>
            <p className="mt-2 text-sm text-gray-600">Help us understand how you'd like to make a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Preferences</label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {donationTypes.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handlePreferenceToggle(type)}
                    className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                      formData.donationPreferences.includes(type)
                        ? 'bg-rose-100 text-rose-700 border-2 border-rose-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${
                      formData.donationPreferences.includes(type) ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              {isLoading ? 'Creating Profile...' : 'Complete Registration'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorRegistration;
