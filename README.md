# SuperNavigation

A lightweight navigation component with dynamic time display for different cities around the world. The component features a sleek header with a sliding indicator that highlights the active city selection.

## Features

- Dynamic city navigation with smooth indicator animation
- Real-time clock display based on selected city's timezone
- Responsive design with hidden scrollbar for improved user experience
- Automatic loading of city data from JSON configuration

## Project Structure

```
SuperNavigation/
├── assets/
│   ├── data/
│   │   └── navigation.json    # City data with timezone information
│   ├── scripts/
│   │   └── main.js            # Main JavaScript functionality
│   └── styles/
│       └── main.sass          # SASS styling (compiles to main.css)
└── index.html                 # Main HTML structure
```

## How it Works

1. The application loads city data from `navigation.json`
2. Navigation links are dynamically generated in the header
3. Clicking a city updates the active selection and moves the indicator
4. The time display updates to show the current time in the selected city's timezone
5. The navigation bar supports horizontal scrolling with a hidden scrollbar for a clean UI

## Browser Compatibility

The navigation component is designed to work across all modern browsers:
- Chrome, Safari, and Opera: Uses `-webkit-scrollbar` to hide scrollbars
- Firefox: Uses `scrollbar-width: none`
- IE and Edge: Uses `-ms-overflow-style: none`

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Click on different cities to see the navigation indicator animate and time update

## Customization

To add or modify cities, edit the `assets/data/navigation.json` file following the existing structure:

```json
{
  "cities": [
    {
      "section": "city-slug",
      "label": "City Name",
      "timezone": "Region/City"
    }
  ]
}
```

