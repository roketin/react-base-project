# Pages Folder

This folder contains all the page components for the React application.

## Structure

The pages folder is structured as follows:

Each file represents a different page on the website. For example, `HomePage.tsx` is the component for the home page, `AboutPage.tsx` is for the about page, and so on.

## Usage

To use a page component, you typically import it in your routing configuration. For example, if you're using `react-router-dom`, you might do something like this:

```javascript
// main.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }
])

```
