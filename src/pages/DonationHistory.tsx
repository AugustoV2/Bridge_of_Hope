import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Package } from 'lucide-react';

type Donation = {
  donor_id: string;
  condition: string;
  number_items: number;
  donation_date: string;
  additional_notes: string;
  image: string;
  response: string;
  itemname: string;
};

const DonationHistory: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const donorId = localStorage.getItem('donor_id'); // Fetch donor_id from local storage

  useEffect(() => {
    const fetchDonorDetails = async () => {
      try {
        const response = await fetch(`https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/donationDetails?donor_id=${donorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch donor details');
        }
        const data = await response.json();
        setDonations(data); // Set the donations directly from the backend response
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDetails();
  }, [donorId]);

  const categories = [
    ...new Set(donations.map((donation) => donation.itemname)),
  ];

  const filteredDonations = selectedCategory
    ? donations.filter(
        (donation) => donation.itemname === selectedCategory
      )
    : donations;

  const totalDonations = filteredDonations.reduce(
    (sum, donation) => sum + donation.number_items,
    0
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Function to export data as CSV
  const exportToCSV = () => {
    if (filteredDonations.length === 0) {
      alert('No data to export.');
      return;
    }

    // Create CSV headers
    const headers = ['Date', 'Items', 'Quantity', 'Condition', 'Notes'];
    const rows = filteredDonations.map((donation) => [
      formatDate(donation.donation_date),
      donation.itemname,
      donation.number_items,
      donation.condition,
      donation.additional_notes,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'donation_history.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (donations.length === 0) {
    return <div>No donations found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
            Your Donation History
          </h2>
          <div className="flex items-center space-x-4">
            <div className="bg-rose-100 text-rose-800 px-4 py-2 rounded-full flex items-center">
              <Package className="h-4 w-4 mr-1" />
              <span className="font-medium">Total Items: {totalDonations}</span>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-2"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="mt-4 p-4 bg-white border rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === ''
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Condition
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(donation.donation_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.itemname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.number_items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.condition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.additional_notes}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No donations found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{filteredDonations.length}</span>{' '}
            donations
          </p>
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={() => window.location.href = '/donateitems'}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
            >
              Make New Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;