function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            Community Issue Mapping App
          </p>
          <p className="text-gray-400 text-sm">
            Empowering citizens to build better communities through transparency and accountability
          </p>
          <p className="text-gray-500 text-xs mt-4">
            &copy; {new Date().getFullYear()} CIMA Kenya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
