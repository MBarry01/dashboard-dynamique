import React, { useState, useEffect } from 'react';
import { Card, Title, Button } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpace: number;
  syllables: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

interface WordData {
  text: string;
  size: number;
  color: string;
  sentence: string;
}

export const TextAnalysisCanvas: React.FC = () => {
  const [text, setText] = useState('');
  const [hoveredWord, setHoveredWord] = useState<WordData | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [stats, setStats] = useState<TextStats>({
    words: 0,
    characters: 0,
    charactersNoSpace: 0,
    syllables: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [wordCloud, setWordCloud] = useState<WordData[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const speakText = (text: string) => {
    if (speechSynthesis && isVoiceEnabled) {
      speechSynthesis.cancel(); // Arrête toute lecture en cours
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; // Définit la langue en français
      utterance.rate = 1.0; // Vitesse normale
      utterance.pitch = 1.0; // Hauteur normale
      speechSynthesis.speak(utterance);
    }
  };

  const handleWordHover = (word: WordData) => {
    setHoveredWord(word);
    if (word.sentence) {
      speakText(word.sentence);
    }
  };

  const handleWordLeave = () => {
    setHoveredWord(null);
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  const findSentenceWithWord = (word: string, text: string): string => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentence = sentences.find(s => 
      s.toLowerCase().includes(word.toLowerCase())
    );
    return sentence ? sentence.trim() : '';
  };

  const analyzeText = () => {
    if (!text.trim()) return;

    const wordCount = text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const paragraphs = text.split('\n\n').filter(Boolean).length;
    const syllables = Math.ceil(wordCount * 1.5);
    const readingTime = Math.ceil(wordCount / 200);
    const speakingTime = Math.ceil(wordCount / 130);

    setStats({
      words: wordCount,
      characters,
      charactersNoSpace,
      syllables,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    });

    const wordFreq: { [key: string]: number } = {};
    const words = text.toLowerCase()
      .split(/\s+/)
      .map(word => word.replace(/[.,!?;:()]/g, ''))
      .filter(word => word.length > 3);

    words.forEach(word => {
      if (word) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const maxFreq = Math.max(...Object.values(wordFreq));
    const cloudWords = Object.entries(wordFreq)
      .map(([wordText, freq]) => {
        const sentence = findSentenceWithWord(wordText, text);
        return {
          text: wordText,
          size: Math.max(14, Math.min(72, (freq / maxFreq) * 60 + 14)),
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          sentence
        };
      })
      .filter(word => word.sentence)
      .sort((a, b) => b.size - a.size)
      .slice(0, 50);

    setWordCloud(cloudWords);
  };

  return (
    <Card className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Title>Analyse de Texte</Title>
          <p className="text-gray-500 text-sm">Analysez votre texte et visualisez les mots-clés</p>
        </div>
        <Button
          icon={isVoiceEnabled ? Volume2 : VolumeX}
          variant="secondary"
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className="ml-4"
        >
          {isVoiceEnabled ? 'Désactiver la voix' : 'Activer la voix'}
        </Button>
      </div>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Collez votre texte ici pour l'analyser..."
        />
        <Button
          icon={Play}
          className="mt-4 bg-blue-600 hover:bg-blue-700 inline-flex items-center"
          onClick={analyzeText}
          disabled={!text.trim()}
        >
          Analyser le texte
        </Button>
      </div>

      {stats.words > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 grid grid-cols-3 gap-px bg-[#151923]"
        >
          <StatsBox value={stats.words} label="Mots" />
          <StatsBox value={stats.characters} label="Caractères" />
          <StatsBox value={stats.charactersNoSpace} label="Caractères sans espace" />
          <StatsBox value={stats.syllables} label="Syllabes" />
          <StatsBox value={stats.sentences} label="Phrases" />
          <StatsBox value={stats.paragraphs} label="Paragraphes" />
          <StatsBox value={stats.readingTime} label="Temps de lecture (min)" />
          <StatsBox value={stats.speakingTime} label="Temps de parole (min)" />
        </motion.div>
      )}

      {wordCloud.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 min-h-[400px] flex items-center justify-center rounded-lg p-8 relative"
        >
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {wordCloud.map((word, index) => (
              <motion.div
                key={index}
                className="relative group"
                onMouseEnter={() => handleWordHover(word)}
                onMouseLeave={handleWordLeave}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ 
                    delay: index * 0.02,
                    type: "spring",
                    stiffness: 100
                  }}
                  style={{
                    fontSize: `${word.size}px`,
                    color: word.color,
                    fontWeight: word.size > 40 ? 'bold' : 'normal',
                  }}
                  className="cursor-pointer inline-block"
                >
                  {word.text}
                </motion.span>
                <AnimatePresence>
                  {hoveredWord === word && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg whitespace-normal"
                      style={{
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "max-content",
                        maxWidth: "300px",
                        marginTop: "10px"
                      }}
                    >
                      <p className="text-sm">{word.sentence}</p>
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -top-1.5 left-1/2 -translate-x-1/2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
};

const StatsBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="bg-[#1e2433] p-6 text-center">
    <div className="text-4xl font-bold text-gray-100 mb-2">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);