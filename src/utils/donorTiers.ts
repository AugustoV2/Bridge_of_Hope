export const getDonorTier = (totalDonations: number) => {
    if (totalDonations >= 200) return { name: "Diamond", color: "text-gray-300" };
    if (totalDonations >= 150) return { name: "Obsidian", color: "text-gray-800" };
    if (totalDonations >= 120) return { name: "Pearl", color: "text-gray-400" };
    if (totalDonations >= 90) return { name: "Amethyst", color: "text-purple-600" };
    if (totalDonations >= 70) return { name: "Emerald", color: "text-green-600" };
    if (totalDonations >= 50) return { name: "Ruby", color: "text-red-600" };
    if (totalDonations >= 35) return { name: "Sapphire", color: "text-blue-600" };
    if (totalDonations >= 25) return { name: "Gold", color: "text-yellow-500" };
    if (totalDonations >= 10) return { name: "Silver", color: "text-gray-500" };
    return { name: "Bronze", color: "text-amber-700" };
  };