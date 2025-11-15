import { useState } from 'react';
import { MapPin, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Road', 'Waste', 'Water', 'Electricity', 'Security'];

const COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  "Murang'a",
  'Nairobi City',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot'
];

const COUNTY_WARDS = {
  'Nairobi City': [
    'Westlands', 'Parklands', 'Central Business District', 'Kilimos', 'Koinange Street',
    'Luthuli Avenue', 'River Road', 'Tom Mboya Street', 'Kilimani', 'Hurligham',
    'Kileleshwa', 'Lavington', 'Langata Road', 'Ngong Road', 'Mombasa Road'
  ],
  'Kiambu': [
    'Kiambaa', 'Kikuyu', 'Limuru', 'Ruiru', 'Thika', 'Juja', 'Karuri', 'Gatundu North',
    'Gatundu South', 'Githunguri', 'Kabete', 'Thika Town'
  ],
  'Nakuru': [
    'Nakuru Town East', 'Nakuru Town West', 'Koinange Street', 'London', 'Bazaar', 'Flamingo',
    'Menengai', 'Nakuru East', 'Nakuru North', 'Nakuru South', 'Nakuru West', 'Rongai', 'Subukia'
  ],
  'Mombasa': [
    'Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita', 'Msambweni'
  ],
  'Kisumu': [
    'Kisumu Central', 'Kisumu East', 'Kisumu West', 'Muhoroni', 'Nyakach', 'Nyando', 'Seme'
  ],
  'Uasin Gishu': [
    'Eldoret East', 'Eldoret North', 'Eldoret South', 'Eldoret West', 'Wareng', 'Kesses'
  ],
  'Kakamega': [
    'Lurambi', 'Navakholo', 'Mumias East', 'Mumias West', 'Matungu', 'Butere', 'Khwisero', 'Shinyalu'
  ],
  'Kericho': [
    'Ainamoi', 'Bureti', 'Belgut', 'Sigowet/Soin', 'Soin Sigowet'
  ],
  'Bungoma': [
    'Mt. Elgon', 'Sirisia', 'Kabuchai', 'Bumula', 'Kanduyi', 'Webuye East', 'Webuye West', 'Kimilili'
  ],
  'Kilifi': [
    'Kilifi North', 'Kilifi South', 'Kaloleni', 'Rabai', 'Ganze', 'Malindi', 'Magarini'
  ],
  'Machakos': [
    'Masinga', 'Yatta', 'Kangundo', 'Matungulu', 'Kathiani', 'Mavoko', 'Macha', 'Mwala'
  ],
  'Meru': [
    'Tigania West', 'Tigania East', 'North Imenti', 'Buuri', 'Central Imenti', 'South Imenti'
  ],
  'Kajiado': [
    'Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'
  ],
  'Laikipia': [
    'Laikipia West', 'Laikipia East', 'Laikipia North'
  ],
  'Narok': [
    'Narok East', 'Narok North', 'Narok South', 'Narok West'
  ],
  'Nyeri': [
    'Tetu', 'Kieni', 'Mathira', 'Othaya', 'Mukurweini', 'Nyeri Town'
  ],
  "Murang'a": [
    "Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"
  ],
  'Kirinyaga': [
    'Mwea', 'Gichugu', 'Ndia', 'Kirinyaga Central'
  ],
  'Embu': [
    'Manyatta', 'Runyenjes', 'Mbeere North', 'Mbeere South'
  ],
  'Kitui': [
    'Kitui Rural', 'Kitui Central', 'Kitui East', 'Kitui West', 'Kitui South'
  ],
  'Makueni': [
    'Makueni', 'Kaiti', 'Kibwezi West', 'Kibwezi East'
  ],
  'Tharaka-Nithi': [
    'Tharaka', 'Chuka', 'Igambang\'ombe', 'Maara'
  ]
  // For counties not listed, users can enter manually or you can expand this list
};

function ReportForm({ onSubmit, initialCategory = '', onCancel }) {
  const [formData, setFormData] = useState({
    reporterName: '',
    title: '',
    description: '',
    category: initialCategory,
    county: '',
    ward: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableWards, setAvailableWards] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'county') {
      // Update available wards based on selected county
      setAvailableWards(COUNTY_WARDS[value] || []);
      // Reset ward selection when county changes
      setFormData(prev => ({ ...prev, ward: '' }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setIsDetectingLocation(false);
      },
      (error) => {
        alert('Unable to retrieve your location: ' + error.message);
        setIsDetectingLocation(false);
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.county) newErrors.county = 'County is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    let imageUrl = '';
    if (formData.image) {
      imageUrl = await convertToBase64(formData.image);
    }

    const issueData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      location: {
        county: formData.county,
        ward: formData.ward,
        address: formData.address,
        coordinates: formData.longitude && formData.latitude
          ? [parseFloat(formData.longitude), parseFloat(formData.latitude)]
          : [36.817223, -1.286389],
      },
      imageUrl,
    };

    onSubmit(issueData);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="reporterName"
          name="reporterName"
          value={formData.reporterName}
          onChange={handleChange}
          placeholder="Anonymous"
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Issue Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`input-field ${errors.category ? 'border-red-500' : ''}`}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            County <span className="text-red-500">*</span>
          </label>
          <select
            id="county"
            name="county"
            value={formData.county}
            onChange={handleChange}
            className={`input-field ${errors.county ? 'border-red-500' : ''}`}
          >
            <option value="">Select County</option>
            {COUNTIES.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
          {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
        </div>

        <div>
          <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
            Ward/Subcounty
          </label>
          {availableWards.length > 0 ? (
            <select
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Ward/Subcounty</option>
              {availableWards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder={formData.county ? "Enter Ward/Subcounty" : "Select County first"}
              className="input-field"
              disabled={!formData.county}
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., Moi Avenue"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Coordinates
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="input-field"
          />
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="input-field"
          />
          <button
            type="button"
            onClick={detectLocation}
            disabled={isDetectingLocation}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 disabled:opacity-50 transition-all duration-300"
          >
            <MapPin className="w-4 h-4" />
            <span>{isDetectingLocation ? 'Detecting...' : 'Detect'}</span>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image (Optional)
        </label>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 cursor-pointer transition-all duration-300">
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {formData.image && (
            <span className="text-sm text-gray-600">{formData.image.name}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
        >
          Submit Report
        </button>
      </div>
    </motion.form>
  );
}

export default ReportForm;
