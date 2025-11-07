import React from "react";
import { PawPrint } from "lucide-react";


const Header = () => {
  return (
    <div className="icon">
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pet Clinic Management 
              </h1> 
          </div>
        </div>
      </div>
    </header>
    </div>
  );
};

export default Header;
