import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';

const OrgHome = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({
    organisation_name: "Hope Community Center",
    Total_Pickups: 0,
    Pending_Pickups: 0,
    Completed_Today: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{month: string, pickups: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizations_id = localStorage.getItem('organizations_id');
        const response = await axios.get(`https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/organisationdetails?organizations_id=${organizations_id}`);
        if (response.status === 200 && response.data) {
          setOrgData({
            ...response.data,
            successRate: 0,
          });
        }

        // Generate dummy chart data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const dummyData = months.map(month => ({
          month: `${month} ${currentYear}`,
          pickups: Math.floor(Math.random() * 30) + 5 // Random pickups between 5-35
        }));
        setChartData(dummyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  const maxPickups = Math.max(...chartData.map(d => d.pickups), 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {orgData.organisation_name}
              </h1>
              <p className="text-blue-100">
                Manage your donation pickups and track your impact
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/Orgpickups')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <Truck className="mr-2 h-5 w-5" />
              View Pickup Requests
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pickups</p>
                <p className="text-2xl font-semibold text-gray-900">{orgData.Total_Pickups}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Pickups</p>
                <p className="text-2xl font-semibold text-gray-900">{orgData.Pending_Pickups}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900">{orgData.Completed_Today}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{orgData.successRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>

      

        {/* Animated Wave Chart */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pickup Activity</h2>
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
                  className="flex-1 max-w-[16px] bg-gradient-to-t from-blue-300 to-blue-500 rounded-t-full mx-auto"
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

export default OrgHome;