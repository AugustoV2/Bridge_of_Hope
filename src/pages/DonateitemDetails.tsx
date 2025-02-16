import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, CheckCircle } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedCondition || !image) {
      alert("Please select a condition and add an image of the item");
      return;
    }

    setIsSubmitting(true);

    // Simulated API call
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: id,
          condition: selectedCondition,
          image,
          notes,
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
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={openCamera}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg"
                >
                  <Camera className="h-6 w-6 text-gray-600" />
                </button>
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
          disabled={isSubmitting || !selectedCondition || !image}
          className={`w-full py-4 rounded-lg font-semibold text-white ${
            isSubmitting || !selectedCondition || !image
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