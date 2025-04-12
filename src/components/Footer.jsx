import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-40 bg-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">About SafeEats</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Our Story</li>
              <li>How it Works</li>
              <li>Safety Standards</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-600 hover:text-custom">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-gray-600 hover:text-custom">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="hover:text-gray-600 hover:text-custom">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 SafeEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;