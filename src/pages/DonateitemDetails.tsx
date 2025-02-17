import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, CheckCircle, Copy, Maximize, Minimize } from 'lucide-react';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface ItemCondition {
  label: string;
  value: string;
  description: string;
}

const conditions: ItemCondition[] = [
  {
    label: "New",
    value: "new",
    description: "Item is brand new, unused, with original packaging if applicable"
  },
  {
    label: "Like New",
    value: "like_new",
    description: "Item appears new, may be missing original packaging"
  },
  {
    label: "Good",
    value: "good",
    description: "Item shows minor wear but is fully functional"
  },
  {
    label: "Fair",
    value: "fair",
    description: "Item shows noticeable wear but is still usable"
  }
];

const DonationItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [numberOfItems, setNumberOfItems] = useState<number>(1); // State for number of items
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For expandable text box

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageClick = async () => {
    if (!image) return;

    setAnalyzing(true);
    try {
      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
      const result = await model.generateContent(image);
      const response = await result.response;
      setApiResponse(response.text()); // Set the API response
    } catch (error) {
      setApiResponse('Error analyzing image: ' + (error as Error).message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCondition  || numberOfItems < 1) {
      alert("Please select a condition, add an image, and specify the number of items (at least 1).");
      return;
    }

    setIsSubmitting(true);

    try {
      id === '1' ? 'winterclothes' : id === '2' ? 'Non-perishable Food'  : id === '3' ? 'School Supplies' : id === '4' ? 'Hygiene Products' : id === '5' ? 'Baby Supplies' : id === '6' ? 'Toys' : id === '7' ? 'other' : 'other';
      const response = await fetch('https://classical-lorinda-blaaaaug-8f2c0766.koyeb.app/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: id,
          donor_id: localStorage.getItem('donor_id'),
          condition: selectedCondition,
          numberOfItems,
          donation_date: new Date().toISOString(), 
          Additional_Notes:notes,
          image:image || '',
         
          
          
          
        }),
      });

      if (response.ok) {
        navigate('/donation-confirmation');
      } else {
        throw new Error('Failed to submit donation');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Items
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Item Details</h1>
          <p className="text-gray-600">
            Please provide details about the condition of your item
          </p>
        </div>

        {/* API Response Display */}
        {(apiResponse || analyzing) && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Image Analysis Results</h3>
            {analyzing ? (
              <div className="animate-pulse text-gray-500">Analyzing image...</div>
            ) : (
              <div className="relative">
                <textarea
                  readOnly
                  value={apiResponse}
                  className={`w-full p-4 bg-gray-50 rounded-md border border-gray-200 text-sm resize-none ${
                    isExpanded ? 'h-64' : 'h-32'
                  }`}
                  placeholder="Image analysis results will appear here..."
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(apiResponse)}
                    className="bg-white p-1 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-white p-1 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    {isExpanded ? (
                      <Minimize className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Maximize className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Condition Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Item Condition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditions.map((condition) => (
              <motion.button
                key={condition.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCondition(condition.value)}
                className={`p-4 rounded-lg border-2 text-left ${
                  selectedCondition === condition.value
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{condition.label}</span>
                  {selectedCondition === condition.value && (
                    <CheckCircle className="h-5 w-5 text-rose-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Number of Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Number of Items</h2>
          <input
            type="number"
            value={numberOfItems || ''}
            onChange={(e) => setNumberOfItems(Number(e.target.value))}
            min="1"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Enter the number of items"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Item Photo</h2>
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
            
            {image ? (
              <div className="relative w-full max-w-md">
                <img
                  src={image}
                  alt="Captured item"
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={handleImageClick}
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={handleImageClick}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <Upload className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={openCamera}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <Camera className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCamera}
                className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                <Camera className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">Click to take a photo</p>
              </motion.button>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details about the item..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedCondition  || numberOfItems < 1}
          className={`w-full py-4 rounded-lg font-semibold text-white ${
            isSubmitting || !selectedCondition  || numberOfItems < 1
              ? 'bg-gray-400'
              : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Upload className="animate-spin h-5 w-5 mr-2" />
              Submitting...
            </span>
          ) : (
            'Submit Donation'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default DonationItemDetails;