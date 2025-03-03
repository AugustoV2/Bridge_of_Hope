import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Package, Calendar, X, AlertCircle, Users, Clock, CheckCircle2, MessageSquare, Inbox, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PickupRequest {
  donor_id: string;
  condition: string;
  number_items: number;
  donation_date: string;
  additional_notes: string;
  image: string;
  response: string;
  itemname: string;
  status?: string;
  pickup_date?: string;
  pickup_time?: string;
}

interface DonorDetails {
  name: string;
  address: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

type TabType = 'active' | 'accepted';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

const StatusBadge = ({ condition }: { condition: string }) => {
  const getStatusColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'good':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fair':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(condition)}`}>
      {condition}
    </span>
  );
};

const TabButton = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  count 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-sm ${
      active 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-100 text-gray-600'
    }`}>
      {count}
    </span>
  </button>
);

const PickupRequests: React.FC = () => {
  const navigate = useNavigate();
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [donorDetails, setDonorDetails] = useState<{ [key: string]: DonorDetails }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedPickupDate, setSelectedPickupDate] = useState<string>('');
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');

  // Available pickup time slots
  const pickupTimeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active pickup requests
        const pickupResponse = await axios.get(`https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/organisationPickup?${localStorage.getItem("organizations_id")}`);
        const pickupData = pickupResponse.data;

        // Fetch accepted requests
        const acceptedResponse = await axios.get('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/req_accept');
        const acceptedData = acceptedResponse.data;

        // Combine all requests
        const allRequests = [...pickupData, ...acceptedData];

        // Get unique donor IDs
        const donorIds = [...new Set(allRequests.map((request: PickupRequest) => request.donor_id))];

        // Fetch donor details
        const donorDetailsResponse = await axios.get('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/donorInfo', {
          params: { donor_ids: donorIds.join(',') }
        });

        const detailsMap = donorDetailsResponse.data.reduce((acc: any, donor: any) => {
          acc[donor.donor_id] = {
            name: donor.full_name,
            address: donor.address
          };
          return acc;
        }, {});

        // Set the combined requests and donor details
        setPickupRequests(allRequests);
        setDonorDetails(detailsMap);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRequests = pickupRequests.filter(request => {
    switch (activeTab) {
      case 'active':
        return !request.status; // Only show requests without a status (active)
      case 'accepted':
        return request.status === 'accepted'; // Only show accepted requests
      default:
        return true;
    }
  });
  
  const counts = {
    active: pickupRequests.filter(r => !r.status).length,
    accepted: pickupRequests.filter(r => r.status === 'accepted').length,
  };

  const handleAccept = (request: PickupRequest) => {
    setSelectedRequest(request);
    setSelectedPickupDate(''); // Reset selected date
    setSelectedPickupTime(''); // Reset selected time
    setShowAcceptModal(true);
  };

  const confirmAccept = async () => {
    if (selectedRequest && selectedPickupDate && selectedPickupTime) {
      try {
        const response = await axios.post('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/acceptRequest', {
          donor_id: selectedRequest.donor_id,
          organisation_id: localStorage.getItem("organizations_id"),
          pickup_date: selectedPickupDate,
          pickup_time: selectedPickupTime
        });
        if (response.status === 200) {
          setPickupRequests(prevRequests => 
            prevRequests.map(request => 
              request.donor_id === selectedRequest.donor_id 
                ? { ...request, status: 'accepted', pickup_date: selectedPickupDate, pickup_time: selectedPickupTime } 
                : request
            )
          );
          setShowAcceptModal(false);
        }
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/OrgHome')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pickup Requests</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review and manage incoming donation pickup requests from your community
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-12">
          <TabButton
            active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
            icon={Inbox}
            label="Active"
            count={counts.active}
          />
          <TabButton
            active={activeTab === 'accepted'}
            onClick={() => setActiveTab('accepted')}
            icon={CheckCircle}
            label="Accepted"
            count={counts.accepted}
          />
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} requests</h3>
            <p className="text-gray-600">
              {activeTab === 'active' 
                ? "There are no pending pickup requests at the moment."
                : "You haven't accepted any pickup requests yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100`}
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-6">
                        <div className={`rounded-2xl p-4 shadow-lg ${
                          request.response === 'accepted' 
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {donorDetails[request.donor_id]?.name || 'Unknown Donor'}
                            </h3>
                            <StatusBadge condition={request.condition} />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                              <Package className="h-5 w-5 mr-3 text-blue-500" />
                              <span className="font-medium">{request.itemname} ({request.number_items} items)</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                              <span>{donorDetails[request.donor_id]?.address || 'Address not available'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-5 w-5 mr-3 text-blue-500" />
                              <span>Requested on {new Date(request.donation_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            {request.pickup_time && (
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                                <span className="font-medium text-emerald-600">Pickup scheduled: {request.pickup_date} at {request.pickup_time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {activeTab === 'active' && (
                      <div className="flex items-center justify-end lg:border-l lg:pl-8">
                        <button
                          onClick={() => handleAccept(request)}
                          className="w-full px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {request.additional_notes && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Additional Notes</p>
                          <p className="text-gray-600">{request.additional_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          <Modal
            isOpen={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
            title="Accept Pickup Request"
          >
            {selectedRequest && (
              <div>
                <div className="space-y-6 mb-8">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Select Pickup Date
                    </h4>
                    <input
                      type="date"
                      value={selectedPickupDate}
                      onChange={(e) => setSelectedPickupDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                    />
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Select Pickup Time
                    </h4>
                    <div className="space-y-3">
                      {pickupTimeSlots.map((timeSlot, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`time-${index}`}
                            name="pickupTime"
                            value={timeSlot}
                            checked={selectedPickupTime === timeSlot}
                            onChange={() => setSelectedPickupTime(timeSlot)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`time-${index}`}
                            className={`ml-3 block text-sm font-medium ${
                              selectedPickupTime === timeSlot 
                                ? 'text-blue-700 font-semibold' 
                                : 'text-gray-700'
                            }`}
                          >
                            {timeSlot}
                          </label>
                        </div>
                      ))}
                    </div>
                    {!selectedPickupTime && (
                      <p className="mt-3 text-sm text-blue-600">
                        Please select a pickup time to continue
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAcceptModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAccept}
                    disabled={!selectedPickupDate || !selectedPickupTime}
                    className={`px-8 py-3 rounded-xl shadow-lg hover:shadow-xl font-medium ${
                      selectedPickupDate && selectedPickupTime
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 transition-colors' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Pickup
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PickupRequests;