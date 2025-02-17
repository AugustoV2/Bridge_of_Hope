import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, Gift, Calendar } from 'lucide-react';

const DonationConfirmation = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-12 h-12 text-rose-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Generous Donation!
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              Your kindness makes a real difference in our community. Together, we're creating positive change and helping those in need.
            </p>

            <div className="flex items-center justify-center space-x-8 py-4">
              <div className="flex items-center text-gray-600">
                <Gift className="w-5 h-5 mr-2 text-rose-500" />
                <span>Donation Received</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-rose-500" />
                <span>{currentDate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/DonorHome')}
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </motion.button>
          
          <p className="text-sm text-gray-500">
            A confirmation email will be sent to you shortly with the details of your donation.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonationConfirmation;