import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown, Heart, Search } from 'lucide-react';

// Define the Donor interface
interface Donor {
  donor_id: number;
  full_name: string;
  items_donated: number;
  avatar?: string; // Optional field for donor avatar
}

const DonationLeaderboard: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('items_donated'); // Default sorting by items donated
  const [showTierInfo, setShowTierInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch donors data from the backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get<Donor[]>('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/leaderBoard');
        setDonors(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Filter donors based on search term
  const filteredDonors = donors.filter((donor) =>
    donor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort donors based on selected sort option
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    if (sortBy === 'items_donated') {
      return b.items_donated - a.items_donated; // Sort by items donated
    } else if (sortBy === 'name') {
      return a.full_name.localeCompare(b.full_name);
    }
    return 0;
  });

  // Get top 3 donors for special highlighting
  const topDonors = [...donors].sort((a, b) => b.items_donated - a.items_donated).slice(0, 3);

  const getTopDonorIcon = (donorId: number) => {
    const index = topDonors.findIndex((donor) => donor.donor_id === donorId);
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Donation Leaderboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Recognizing our generous donors who make a difference by donating essential items!
        </p>
      </div>

      {/* Tier information modal */}
      {showTierInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Donor Tier Information</h2>
              <button
                onClick={() => setShowTierInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <span className="text-gray-300 font-bold text-lg">Diamond</span>
                <p className="text-gray-600">50+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-gray-800 font-bold text-lg">Obsidian</span>
                <p className="text-gray-600">40+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-gray-400 font-bold text-lg">Pearl</span>
                <p className="text-gray-600">30+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-purple-600 font-bold text-lg">Amethyst</span>
                <p className="text-gray-600">25+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-green-600 font-bold text-lg">Emerald</span>
                <p className="text-gray-600">20+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-red-600 font-bold text-lg">Ruby</span>
                <p className="text-gray-600">15+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-blue-600 font-bold text-lg">Sapphire</span>
                <p className="text-gray-600">10+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-yellow-500 font-bold text-lg">Gold</span>
                <p className="text-gray-600">5+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-gray-500 font-bold text-lg">Silver</span>
                <p className="text-gray-600">3+ items donated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <span className="text-amber-700 font-bold text-lg">Bronze</span>
                <p className="text-gray-600">1+ items donated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top donors showcase */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Top Donors</h2>
          <button
            onClick={() => setShowTierInfo(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Trophy className="h-4 w-4" />
            <span>View Tier Info</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topDonors.map((donor, index) => (
            <div
              key={donor.donor_id}
              className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform hover:scale-105 ${
                index === 0 ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
                <div className="relative">
                <img
                  src={
                  index === 0
                    ? 'https://www.thedigitalspeaker.com/content/images/2022/07/Five-NFT-Challenges.webp'
                    : index === 1
                    ? 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F52c18f05-0251-463f-8128-8add0c4ee71c_600x600.png'
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jK1yE4CbW9NEKYqQD20duOv1xPiPKsQqEg&s'
                  }
                  alt={donor.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  {index === 0 ? <Crown className="h-8 w-8 text-yellow-500" /> :
                   index === 1 ? <Medal className="h-8 w-8 text-gray-400" /> :
                   <Medal className="h-8 w-8 text-amber-700" />}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">{donor.full_name}</h3>
              <div className="mt-2 flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span className="text-gray-700">{donor.items_donated} items donated</span>
              </div>
              {index === 0 && (
                <div className="mt-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  #1 Top Donor
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search donors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="items_donated">Sort by Items Donated</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donors list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items Donated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDonors.map((donor, index) => (
              <tr key={donor.donor_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">#{index + 1}</span>
                    {getTopDonorIcon(donor.donor_id) && (
                      <span className="ml-2">{getTopDonorIcon(donor.donor_id)}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          donor.avatar ||
                          (index === 0
                            ? 'https://www.thedigitalspeaker.com/content/images/2022/07/Five-NFT-Challenges.webp'
                            : index === 1
                            ? 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F52c18f05-0251-463f-8128-8add0c4ee71c_600x600.png'
                            : index === 2
                            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jK1yE4CbW9NEKYqQD20duOv1xPiPKsQqEg&s'
                            : index === 3
                            ? 'https://www.cnet.com/a/img/resize/7589227193923c006f9a7fd904b77bc898e105ff/hub/2021/11/29/f566750f-79b6-4be9-9c32-8402f58ba0ef/richerd.png?auto=webp&width=768'
                            : index === 4
                            ? 'https://preview.redd.it/how-do-i-get-my-money-back-for-delisted-nfts-v0-60k5r5a8tahc1.jpeg?width=640&crop=smart&auto=webp&s=16fcc84e362a598fbf1ee0688b9c9a892cfb20d0'
                            : index === 5
                            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR40ZNzQtPmAVIQrW877zVGSTjzDBe5Pt_RDg&s'
                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-e06Fw9P4JgtHo6u6tHZBn6-Ke4ecxwxeXg&s')
                        }
                        alt={donor.full_name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donor.full_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-1 fill-red-500" />
                    {donor.items_donated} items
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {sortedDonors.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No donors found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DonationLeaderboard;