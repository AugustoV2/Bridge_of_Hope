
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';


const UserTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Bridge of Hope
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose your account type to continue
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-2xl shadow-rose-100/50 sm:rounded-xl sm:px-10">
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/donorlogin')}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all duration-200"
            >
              <User className="w-6 h-6" />
              <span className="text-lg font-medium">Continue as Donor</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/organisationlogin')}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white text-rose-600 border-2 border-rose-200 rounded-lg shadow-md hover:bg-rose-50 transition-all duration-200"
            >
              <Building2 className="w-6 h-6" />
              <span className="text-lg font-medium">Continue as Organization</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserTypeSelection;