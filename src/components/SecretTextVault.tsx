"use client";
import { useState, useEffect } from "react";

interface CommunityText {
  _id: string;
  text: string;
  category: string;
  usageCount: number;
}

interface SecretTextVaultProps {
  onTextSelect: (text: string) => void;
  onClose: () => void;
}

// Simple puzzles/riddles
const puzzles = [
  {
    question: "What gets wetter the more it dries?",
    answer: "towel",
    hint: "Something you use after a shower..."
  },
  {
    question: "I'm tall when I'm young, short when I'm old. What am I?",
    answer: "candle",
    hint: "Light me up..."
  },
  {
    question: "What has keys but no locks?",
    answer: "keyboard",
    hint: "You're using one right now..."
  },
  {
    question: "2 + 2 × 3 = ?",
    answer: "8",
    hint: "Remember order of operations..."
  },
  {
    question: "What comes after Wednesday?",
    answer: "thursday",
    hint: "Days of the week..."
  }
];

export function SecretTextVault({ onTextSelect, onClose }: SecretTextVaultProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[Math.floor(Math.random() * puzzles.length)]);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [communityTexts, setCommunityTexts] = useState<CommunityText[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'motivational', 'funny', 'minimalist', 'chaotic', 'philosophical'];

  const checkAnswer = () => {
    if (userAnswer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase()) {
      setIsUnlocked(true);
      fetchCommunityTexts();
    } else {
      // Wrong answer animation
      const input = document.querySelector('.puzzle-input') as HTMLElement;
      if (input) {
        input.style.animation = 'shake 0.5s';
        setTimeout(() => input.style.animation = '', 500);
      }
    }
  };

  const fetchCommunityTexts = async (category?: string) => {
    setLoading(true);
    try {
      const url = category && category !== 'all' 
        ? `/api/community-text?category=${category}`
        : '/api/community-text';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setCommunityTexts(data.data);
      }
    } catch (error) {
      console.error('Error fetching community texts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchCommunityTexts(category);
  };

  const handleTextSelect = (text: string) => {
    onTextSelect(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-6 shadow-brutalLg max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-brand-green p-4 border-b-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-bold uppercase tracking-wider text-black">
              🔐 Secret Text Vault
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-black text-white border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isUnlocked ? (
            /* Puzzle Section */
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🧩</div>
                <h3 className="font-bold text-lg mb-4">Solve this to unlock exclusive texts!</h3>
              </div>

              <div className="bg-gray-100 p-4 border-3 shadow-brutal">
                <p className="font-bold text-center mb-4">{currentPuzzle.question}</p>
                
                <input
                  className="puzzle-input w-full px-3 py-2 border-3 shadow-brutal focus:shadow-brutalMd transition-all duration-200 text-center font-bold uppercase"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={checkAnswer}
                    className="flex-1 bg-brand-green text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold py-2 px-4"
                  >
                    Unlock! 🔓
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-gray-200 text-black border-3 shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold py-2 px-4"
                  >
                    💡
                  </button>
                </div>

                {showHint && (
                  <div className="mt-3 text-sm text-gray-600 text-center italic">
                    Hint: {currentPuzzle.hint}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Unlocked Community Texts */
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="font-bold text-lg">Vault Unlocked!</h3>
                <p className="text-sm text-gray-600">Choose from exclusive community suggestions:</p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 border-2 text-xs font-bold uppercase transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-brand-green text-black shadow-brutal'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Community Texts */}
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="text-2xl animate-spin">🔄</div>
                  </div>
                ) : communityTexts.length > 0 ? (
                  communityTexts.map((text) => (
                    <button
                      key={text._id}
                      onClick={() => handleTextSelect(text.text)}
                      className="w-full p-3 text-left bg-gray-50 border-3 shadow-brutal hover:shadow-brutalMd hover:bg-brand-green transition-all duration-200 group"
                    >
                      <div className="font-bold">{text.text}</div>
                      <div className="text-xs text-gray-500 flex justify-between mt-1">
                        <span>#{text.category}</span>
                        <span>Used {text.usageCount}x</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No texts available in this category yet! 🤷‍♂️
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
