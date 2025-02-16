import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DonationItem {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  impact: string;
}

const donationItems: DonationItem[] = [
  {
    id: 1,
    name: "Winter Coats",
    category: "Clothing",
    description: "Warm winter coats for adults and children",
    image: "https://images.unsplash.com/photo-1515434126000-961d90ff09db?auto=format&fit=crop&q=80&w=500",
    impact: "Helps keep someone warm during winter months"
  },
  {
    id: 2,
    name: "Non-perishable Food",
    category: "Food",
    description: "Canned goods, dried foods, and other non-perishable items",
    image: "https://post.healthline.com/wp-content/uploads/2020/01/dried-fruit-nuts-raisins-1296x728-header-1296x728.jpg",
    impact: "Provides meals for families in need"
  },
  {
    id: 3,
    name: "School Supplies",
    category: "Education",
    description: "Notebooks, pencils, backpacks, and other school essentials",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=500",
    impact: "Helps students succeed in their education"
  },
  {
    id: 4,
    name: "Hygiene Products",
    category: "Personal Care",
    description: "Soap, shampoo, toothbrushes, and other hygiene items",
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=500",
    impact: "Maintains dignity and health for individuals"
  },
  {
    id: 5,
    name: "Baby Supplies",
    category: "Children",
    description: "Diapers, wipes, formula, and other baby necessities",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=500",
    impact: "Supports new parents and their infants"
  },
  {
    id: 6,
    name: "Books",
    category: "Education",
    description: "New or gently used books for all ages",
    image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=500",
    impact: "Promotes literacy and learning"
  },
  {
    id: 7,
    name: "Other",
    category: "Other",
    description: "Donated new or gently used items supporting various causes.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuxX3k0vWLWGhi9W4L84-I6x8igMwheaFRukOaZWqrsquWMu4-BkZL0GoK2j3-ly--o8&usqp=CAU",
    impact: "Promotes literacy and learning"
  }
];

const DonationItems = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: number) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/DonorHome')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          {selectedItems.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-rose-700 transition-colors"
            >
              Continue with {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
            </motion.button>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Items to Donate</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the items you'd like to donate. Your contributions make a real difference in our community.
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer ${
                selectedItems.includes(item.id) ? 'ring-2 ring-rose-500' : ''
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={`p-2 rounded-full ${
                      selectedItems.includes(item.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-gray-500'
                    } shadow-md`}
                  >
                    <Heart className="h-5 w-5" fill={selectedItems.includes(item.id) ? "currentColor" : "none"} />
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Box className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-sm font-medium text-rose-500">{item.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="bg-rose-50 rounded-lg p-4">
                  <p className="text-sm text-rose-700">
                    <strong>Impact:</strong> {item.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationItems;