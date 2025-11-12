# CIMA - Community Issue Mapping App (Kenya)

A modern web application for citizens to report local community problems such as potholes, waste management issues, unsafe areas, water supply problems, and electricity outages. The app visualizes issues on an interactive map and provides a professional dashboard for tracking and managing reports.

## Features

- **Interactive Map**: Visualize all reported issues on an OpenStreetMap-powered map with custom markers
- **Issue Reporting**: Easy-to-use form for submitting community issues with location detection
- **Dashboard**: Professional dashboard with statistics, filters, and detailed issue tracking
- **Category-Based Reporting**: Quick access to report issues by category (Road, Water, Electricity, Waste, Security)
- **Real-Time Filtering**: Filter issues by category, county, and status
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Maps**: Leaflet & React-Leaflet (OpenStreetMap)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. Clone the repository or download the project files

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE=http://localhost:5000
```
Replace with your backend API URL.

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Backend Setup

This frontend requires a MERN backend with the following API endpoints:

### API Contract

**Base URL**: Set via `VITE_API_BASE` environment variable

**Endpoints**:

1. `GET /api/issues` - Fetch all issues
   - Returns: Array of issue objects

2. `POST /api/issues` - Create a new issue
   - Request body:
   ```json
   {
     "title": "string",
     "category": "Road|Waste|Water|Electricity|Security",
     "description": "string",
     "reporterName": "string",
     "location": {
       "county": "string",
       "ward": "string",
       "address": "string",
       "coordinates": [longitude, latitude]
     },
     "status": "New|In Progress|Resolved",
     "createdAt": "ISO Date String",
     "imageUrl": "string (optional)"
   }
   ```

3. `PATCH /api/issues/:id` - Update an issue (for future features)

## Project Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Main app component with routing
├── index.css             # Global styles and Tailwind
├── assets/               # Static assets
├── components/           # Reusable components
│   ├── Navbar.jsx        # Top navigation bar
│   ├── Sidebar.jsx       # Dashboard sidebar with filters
│   ├── MapView.jsx       # Leaflet map component
│   ├── ReportModal.jsx   # Modal for reporting issues
│   ├── ReportForm.jsx    # Issue submission form
│   ├── DashboardCards.jsx # Statistics cards
│   ├── IssueList.jsx     # Table of issues
│   ├── Footer.jsx        # Footer component
│   └── IconButton.jsx    # Reusable icon button
├── pages/                # Page components
│   ├── Home.jsx          # Landing page
│   └── Report.jsx        # Dashboard/report page
└── utils/                # Utility functions
    └── api.js            # Axios API client
```

## Design Theme

- **Primary Color**: #16A34A (Green)
- **Accent**: White and gray neutrals
- **Font**: System fonts (Inter/Poppins fallback)

## Key Features Explanation

### Location Detection
Users can click "Detect" to automatically populate latitude/longitude using the browser's geolocation API.

### Map Integration
- Default center: Nairobi, Kenya
- Markers show issue details in popups
- Clicking an issue in the list focuses the map on that marker

### Filters
- Category filter: All, Road, Waste, Water, Electricity, Security
- County dropdown: Sample Kenyan counties included
- Status filter: All, New, In Progress, Resolved

### Accessibility
- Modal focus trapping
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## Development Notes

1. The backend is **not included** in this repository. You need to set up a separate MERN backend.
2. Image upload is stubbed - real Cloudinary integration can be added to the backend.
3. The app uses mock data until connected to a real backend.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

Contributions are welcome! Please follow standard React and JavaScript best practices.

## Contact

For questions or support, please open an issue in the repository.
