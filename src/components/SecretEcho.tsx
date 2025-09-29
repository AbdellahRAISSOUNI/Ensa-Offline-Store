"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface SecretEchoProps {
  productId: string;
  onTextSelect: (text: string) => void;
  onClose: () => void;
}

interface PuzzleData {
  _id: string;
  category: string;
  rarity: 'common' | 'rare' | 'legendary';
  unlockRequirement: {
    puzzleType: string;
    difficulty: number;
    hint: string;
  };
}

interface UnlockedText {
  _id: string;
  text: string;
  category: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export function SecretEcho({ productId, onTextSelect, onClose }: SecretEchoProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentView, setCurrentView] = useState<'main' | 'puzzle' | 'unlocked'>('main');
  const [availablePuzzles, setAvailablePuzzles] = useState<PuzzleData[]>([]);
  const [unlockedTexts, setUnlockedTexts] = useState<UnlockedText[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleData | null>(null);
  const [puzzleSolution, setPuzzleSolution] = useState('');
  const [userStats, setUserStats] = useState({ totalUnlocked: 0, totalPuzzlesSolved: 0 });
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAchievement, setShowAchievement] = useState<any>(null);

  useEffect(() => {
    loadSecretEcho();
    
    // Entrance animation
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const loadSecretEcho = async () => {
    try {
      setLoading(true);
      const storedSessionId = localStorage.getItem('secretEchoSession') || generateSessionId();
      setSessionId(storedSessionId);
      localStorage.setItem('secretEchoSession', storedSessionId);

      const response = await fetch(`/api/secret-echo?sessionId=${storedSessionId}`);
      const data = await response.json();

      if (data.success) {
        setAvailablePuzzles(data.data.availablePuzzles);
        setUnlockedTexts(data.data.unlockedTexts);
        setUserStats(data.data.userProgress.stats);
        setAchievements(data.data.userProgress.achievements);
      }
    } catch (error) {
      console.error('Failed to load Secret Echo:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const solvePuzzle = async () => {
    if (!selectedPuzzle || !puzzleSolution.trim()) return;

    try {
      const response = await fetch('/api/secret-echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'solve_puzzle',
          sessionId,
          puzzleId: selectedPuzzle._id,
          solution: puzzleSolution
        })
      });

      const data = await response.json();

      if (data.success && data.data.success) {
        // Success! Show unlock animation
        const newText = data.data.unlockedText;
        setUnlockedTexts(prev => [...prev, newText]);
        setUserStats(prev => ({ ...prev, totalUnlocked: prev.totalUnlocked + 1 }));
        
        // Show achievement if any
        if (data.data.newAchievements?.length > 0) {
          setShowAchievement(data.data.newAchievements[0]);
          setTimeout(() => setShowAchievement(null), 3000);
        }

        // Celebrate animation
        celebrateUnlock();
        
        // Go to unlocked view
        setTimeout(() => {
          setCurrentView('unlocked');
          setPuzzleSolution('');
          setSelectedPuzzle(null);
        }, 1500);
        
      } else {
        // Wrong answer - shake animation
        shakeAnimation();
      }
    } catch (error) {
      console.error('Failed to solve puzzle:', error);
      shakeAnimation();
    }
  };

  const celebrateUnlock = () => {
    // Create celebration particles
    const colors = ['#10B981', '#000000', '#F59E0B'];
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 10000;
        left: 50%;
        top: 50%;
      `;
      document.body.appendChild(particle);

      gsap.to(particle, {
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        rotation: Math.random() * 360,
        scale: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  };

  const shakeAnimation = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 border-yellow-500 bg-yellow-50';
      case 'rare': return 'text-purple-500 border-purple-500 bg-purple-50';
      case 'common': return 'text-green-500 border-green-500 bg-green-50';
      default: return 'text-gray-500 border-gray-500 bg-gray-50';
    }
  };

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '👑';
      case 'rare': return '💎';
      case 'common': return '✨';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 border-6 shadow-brutal">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            <span className="font-display font-bold">Loading Secret Echo...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white border-6 shadow-brutalLg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <h2 className="font-display font-bold text-xl">Secret Echo</h2>
              <p className="text-sm opacity-80">Unlock exclusive custom text</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs">
              <div>Unlocked: {userStats.totalUnlocked}</div>
              <div>Solved: {userStats.totalPuzzlesSolved}</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white text-black border-2 hover:bg-gray-100 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Achievement Notification */}
        {showAchievement && (
          <div className="bg-yellow-400 text-black p-3 border-b-3 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <div className="font-bold">{showAchievement.name}</div>
                <div className="text-sm">{showAchievement.description}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main View */}
        {currentView === 'main' && (
          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 border-3 bg-green-50">
                <div className="text-2xl font-bold text-green-600">{userStats.totalUnlocked}</div>
                <div className="text-xs font-bold">UNLOCKED</div>
              </div>
              <div className="text-center p-3 border-3 bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">{userStats.totalPuzzlesSolved}</div>
                <div className="text-xs font-bold">SOLVED</div>
              </div>
              <div className="text-center p-3 border-3 bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">{achievements.length}</div>
                <div className="text-xs font-bold">BADGES</div>
              </div>
            </div>

            {/* Available Puzzles */}
            <div>
              <h3 className="font-display font-bold mb-3">🧩 Available Puzzles</h3>
              <div className="grid gap-3">
                {availablePuzzles.slice(0, 4).map((puzzle) => (
                  <button
                    key={puzzle._id}
                    onClick={() => {
                      setSelectedPuzzle(puzzle);
                      setCurrentView('puzzle');
                    }}
                    className="flex items-center justify-between p-4 border-3 hover:shadow-brutal transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getRarityEmoji(puzzle.rarity)}</span>
                      <div>
                        <div className="font-bold capitalize">{puzzle.category}</div>
                        <div className="text-sm text-gray-600">
                          Difficulty: {'★'.repeat(puzzle.unlockRequirement.difficulty)}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 border-2 text-xs font-bold uppercase ${getRarityColor(puzzle.rarity)}`}>
                      {puzzle.rarity}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unlocked Texts */}
            {unlockedTexts.length > 0 && (
              <div>
                <h3 className="font-display font-bold mb-3">✨ Your Collection</h3>
                <button
                  onClick={() => setCurrentView('unlocked')}
                  className="w-full p-4 border-3 bg-brand-green text-black hover:shadow-brutal transition-all font-bold"
                >
                  View {unlockedTexts.length} Unlocked Texts →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Puzzle View */}
        {currentView === 'puzzle' && selectedPuzzle && (
          <div className="p-6 space-y-6">
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              ← Back to puzzles
            </button>

            <div className="text-center">
              <div className="text-4xl mb-2">{getRarityEmoji(selectedPuzzle.rarity)}</div>
              <h3 className="font-display font-bold text-xl capitalize mb-2">
                {selectedPuzzle.category} Text
              </h3>
              <div className={`inline-block px-3 py-1 border-2 text-sm font-bold uppercase ${getRarityColor(selectedPuzzle.rarity)}`}>
                {selectedPuzzle.rarity}
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-3">
              <div className="font-bold mb-2">🔍 Hint:</div>
              <p className="text-gray-700">{selectedPuzzle.unlockRequirement.hint}</p>
            </div>

            <div>
              <label className="block font-bold mb-2">Your Solution:</label>
              <input
                type="text"
                value={puzzleSolution}
                onChange={(e) => setPuzzleSolution(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && solvePuzzle()}
                className="w-full p-3 border-3 shadow-brutal focus:shadow-brutalMd transition-all"
                placeholder="Type your answer..."
                autoFocus
              />
            </div>

            <button
              onClick={solvePuzzle}
              disabled={!puzzleSolution.trim()}
              className="w-full bg-black text-white p-3 border-3 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold transition-all"
            >
              🔓 Unlock Text
            </button>
          </div>
        )}

        {/* Unlocked Texts View */}
        {currentView === 'unlocked' && (
          <div className="p-6 space-y-6">
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              ← Back to main
            </button>

            <h3 className="font-display font-bold text-xl">Your Text Collection</h3>

            <div className="grid gap-3">
              {unlockedTexts.map((text) => (
                <button
                  key={text._id}
                  onClick={() => {
                    onTextSelect(text.text);
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 border-3 hover:shadow-brutal transition-all text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getRarityEmoji(text.rarity)}</span>
                    <div>
                      <div className="font-bold">"{text.text}"</div>
                      <div className="text-sm text-gray-600 capitalize">{text.category}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 border-2 text-xs font-bold uppercase ${getRarityColor(text.rarity)}`}>
                    {text.rarity}
                  </div>
                </button>
              ))}
            </div>

            {unlockedTexts.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🔒</div>
                <p>No texts unlocked yet. Solve puzzles to build your collection!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
