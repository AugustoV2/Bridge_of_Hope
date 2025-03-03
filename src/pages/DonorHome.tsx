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
        const donorId = localStorage.getItem('donor_id');
        if (!donorId) {
          throw new Error('Donor ID not found in local storage');
        }

        const response = await axios.get(`http://127.0.0.1:8000/chart?donor_id=${donorId}`);
        setChartData(response.data); // Update chart data state
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch donation history');
      }
    };

    fetchDonorData();
    fetchDonationHistory(); // Call fetchDonationHistory on component mount
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!donorData) {
    return <div className="text-center mt-10 text-lg text-red-500">No donor data available.</div>;
  }

  const { full_name, totalDonations, itemsDonated, lastDonation, impactScore } = donorData;
  const maxItems = Math.max(...chartData.map((d) => d.items), 1); // Use chartData for maxItems

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

        {/* Donation Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Donation History</h2>
          <div className="h-64 flex items-end space-x-2">
            {chartData.map((donation, index) => (
              <div key={donation.month} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(donation.items / maxItems) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-8 bg-rose-500 rounded-t-lg"
                  style={{ originY: 1 }}
                />
                <div className="mt-2 text-sm font-medium text-gray-600">{donation.month}</div>
                <div className="text-xs text-gray-500">{donation.items} items</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonorHome;