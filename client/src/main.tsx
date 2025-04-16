import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for Playfair Display font
const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: inline-block;
    padding-right: 100%;
    animation: marquee 25s linear infinite;
  }

  .headline-font {
    font-family: 'Playfair Display', serif;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
