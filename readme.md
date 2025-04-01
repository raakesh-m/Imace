# Imace - AI-Powered Image Search 📷✨

Imace is a modern web application that allows you to search your images using natural language and explore them in an interactive 3D space with a beautiful, responsive UI.

## Features

- **Natural Language Search:** Find your photos by describing them, just like you would to a friend!
- **Interactive 3D Visualization:** Explore your images in a 3D space, revealing visual relationships between them.
- **Responsive UI:** Beautiful glass-morphism design that works on all devices.
- **Masonry Layout:** Flexible image gallery with both grid and masonry views.
- **Local Processing:** All processing happens on your machine, ensuring your privacy.

## Technologies Used

- **Frontend:**
  - Next.js & React
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Three.js and React Three Fiber for 3D visualization
  - Zustand for state management
  - SWR for data fetching

- **Backend:**
  - FastAPI (Python)
  - CLIP model for image embeddings
  - Scikit-learn for vector similarity search

## How it works

Imace uses the CLIP model to encode your images and search queries, allowing for accurate semantic matching. The 3D visualization arranges images in space based on their semantic similarities.

## Disclaimer

**Warning:** This code was lovingly crafted (and slightly panicked over). Proceed with caution and a sense of humor! 😅 If you find any bugs, please submit an issue (or better yet, a pull request with a fix!).

## Running the project

To get Imace up and running, follow these steps:

**Backend:**

1. **Navigate to the `backend` directory:** `cd backend`
2. **Create a virtual environment:**
   - Using `venv`: `python3 -m venv venv`
   - Using `virtualenv`: `virtualenv venv`
3. **Activate the virtual environment:**
   - On Linux/macOS: `source venv/bin/activate`
   - On Windows: `venv\Scripts\activate`
4. **Install dependencies:** `pip install -r requirements.txt`
5. **Start the Uvicorn server:** `uvicorn app:app --reload`

**Frontend:**

1. **Navigate to the `frontend` directory:** `cd frontend`
2. **Install pnpm (if you don't have it):** `npm install -g pnpm`
3. **Install dependencies:** `pnpm install`
4. **Run the frontend:** `pnpm run dev`
5. **Open in browser:** Navigate to `http://localhost:3000`

## User Interface

- **Search Bar:** Type natural language descriptions to find your images.
- **Image Gallery:** View your images in either grid or masonry layout.
- **3D View:** Explore your images in 3D space with full rotation, zoom, and interactive features.
- **Settings Panel:** Upload, manage, and delete your images.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

The source code is licensed under the MIT license.
