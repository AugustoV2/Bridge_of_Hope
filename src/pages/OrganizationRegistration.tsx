import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, FileText, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';


const OrganizationRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    address: '',
    headName: '',
    organisation_id: localStorage.getItem('organization_id'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send the form data to the API
      const response = await axios.post('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/oraganisationDetails', {
        organizationName: formData.organizationName,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        headName: formData.headName,
        organizations_id: localStorage.getItem('organizations_id'),
      });

      

      // if (response.status !== 200) {
      //   throw new Error(data.message || 'Failed to submit organization details');
      // }

      toast.success('Organization profile created! Awaiting verification.');
      navigate('/OrgHome');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-2xl shadow-rose-100/50 px-6 py-8 sm:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Register Your Organization
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Help us verify your organization to start accepting donations and making a difference in the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter organization name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="registrationNumber"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="headName" className="block text-sm font-medium text-gray-700 mb-2">
                Head of Organization
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="headName"
                  required
                  value={formData.headName}
                  onChange={(e) => setFormData(prev => ({ ...prev, headName: e.target.value }))}
                  className="appearance-none block w-full pl-12 pr-6 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter head of organization name"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-rose-100 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200 mt-8"
            >
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationRegistration;