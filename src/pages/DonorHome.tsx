import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DonorHome = () => {
  const navigate = useNavigate();

  interface DonorData {
    full_name: string;
    totalDonations: number;
    itemsDonated: number;
    lastDonation: string;
    impactScore: number;
    recentDonations: { month: string; items: number }[];
  }

  interface ChartData {
    month: string;
    items: number;
  }

  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const donorId = localStorage.getItem('donor_id');
        if (!donorId) {
          throw new Error('Donor ID not found in local storage');
        }

        const response = await axios.get(
          `https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/donordetails?donor_id=${donorId}`
        );
        setDonorData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch donor data');
      } finally {
        setLoading(false);
      }
    };

    const fetchDonationHistory = async () => {
      try {
        // Generate dynamic dummy data for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        const dummyData = months.map((month, index) => ({
          month: `${month} ${currentYear}`,
          items: Math.floor(Math.random() * 50) + 10 // Random items between 10-60
        }));

        setChartData(dummyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch donation history');
      }
    };

    fetchDonorData();
    fetchDonationHistory();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!donorData) {
    return <div className="text-center mt-10 text-lg text-red-500">No donor data available.</div>;
  }

  const { full_name, totalDonations, itemsDonated, lastDonation, impactScore } = donorData;
  const maxItems = Math.max(...chartData.map((d) => d.items), 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {full_name}!</h1>
              <p className="text-rose-100">Your generosity continues to make a difference in our community.</p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/donateitems')}
                className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Make a Donation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/History')}
                className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                History
              </motion.button>
            </div>
          </div>
        </div>

        {error && <div className="text-center mb-4 text-red-500">{error}</div>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { icon: Package, label: 'Total Donations', value: totalDonations },
            { icon: TrendingUp, label: 'Items Donated', value: itemsDonated },
            {
              icon: Calendar,
              label: 'Last Donation',
              value: lastDonation !== 'N/A' ? new Date(lastDonation).toLocaleDateString() : 'N/A',
            },
            { icon: Award, label: 'Impact Score', value: impactScore },
          ].map(({ icon: Icon, label, value }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-rose-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


        {/* Full Width Animated Wave Chart */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Donation Impact Over Time</h2>
          <div className="h-64 w-full flex items-end">
            {Array.from({ length: 30 }).map((_, index) => {
              // Create a wave-like pattern with varying heights
              const height = 20 + Math.sin(index * 0.5) * 15 + Math.random() * 10;
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${height}%`,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.5,
                      type: 'spring',
                      damping: 10
                    }
                  }}
                  className="flex-1 max-w-[16px] bg-gradient-to-t from-rose-300 to-rose-500 rounded-t-full mx-auto"
                  style={{ originY: 1 }}
                  whileHover={{ 
                    height: `${height + 20}%`,
                    transition: { duration: 0.2 }
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonorHome;