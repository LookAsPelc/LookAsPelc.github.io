import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, Search, Star, Map, Compass } from 'lucide-react';

const quotes = [
  "The page you are looking for is merely a social construct.",
  "I think, therefore I am... 404.",
  "Not all who wander are lost. But you? You serve definitely are.",
  "We found the Answer (42), but we lost the Question (URL).",
  "The unexamined URL is not worth visiting.",
  "This page has ascended to a higher plane of existence.",
  "Error 404: Meaning of Life not found. Try coffee instead.",
  "Maybe the real page was the friends we made along the way."
];

export default function Existential404() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [quote, setQuote] = useState(quotes[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate random stars for background
  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  const handleMouseMove = (e) => {
    // Calculate mouse position relative to center for parallax
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    setMousePos({ x, y });
  };

  const handleNewQuote = () => {
    setIsSpinning(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans selection:bg-purple-500 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />

      {/* Stars Layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-40 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        {/* The Big 404 */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-600 drop-shadow-2xl">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <span className="text-xl md:text-2xl font-light tracking-[1.5em] text-blue-200/30 uppercase blur-[1px]">
              Nothingness
            </span>
          </div>
        </div>

        {/* Subtext */}
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white/90">
          Reality Glitch Detected
        </h2>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
          You've reached the void. We searched the servers, the database, and the collective unconscious, but the page you are looking for does not exist in this dimension.
        </p>

        {/* The Quote Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-xl w-full mb-10 shadow-2xl transform transition-all hover:scale-105 duration-300">
          <div className="flex justify-center mb-4 text-purple-400">
            <Compass size={32} />
          </div>
          <p className="text-lg italic text-slate-200 font-serif">
            "{quote}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => window.location.href = '/'}
            className="group flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
            Return to Reality
          </button>
          
          <button 
            onClick={handleNewQuote}
            className="group flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white border border-slate-700 px-6 py-4 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-500 transition-all duration-200"
          >
            <RefreshCw size={20} className={`transition-transform duration-500 ${isSpinning ? 'rotate-180' : ''}`} />
            Consult the Oracle
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-slate-500 text-sm">
          <p className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-help">
            <Search size={14} />
            Searching for meaning... since 1970 (Unix Epoch)
          </p>
        </div>
      </div>
    </div>
  );
}