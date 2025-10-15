'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  archived: boolean;
}

interface UserStats {
  streak: number;
  totalSessions: number;
  totalMessages: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: string[];
  level: number;
  experience: number;
  goal: {
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    current: number;
    description: string;
  };
  journey: {
    duration: number; // days
    startDate: string;
    endDate: string;
    completed: boolean;
    xpMultiplier: number;
  };
  streakFreeze: number;
  streakRecovery: boolean;
  materials: string[];
  totalXPEarned: number;
  totalXPSpent: number;
}

interface DailyQuestion {
  id: string;
  question: string;
  category: string;
  date: string;
  answered: boolean;
  answer?: string;
}

const emotionPrompts = {
  happy: [
    "What's bringing you joy right now?",
    "Tell me about a moment today that made you smile.",
    "What are you grateful for in this moment?"
  ],
  sad: [
    "I'm here to listen. What's weighing on your heart?",
    "It's okay to feel this way. What would help you feel supported?",
    "What small thing could bring you comfort right now?"
  ],
  anxious: [
    "Let's breathe together. What's making you feel anxious?",
    "What would help you feel more grounded right now?",
    "What's one thing you can control in this moment?"
  ],
  angry: [
    "I hear your frustration. What's really bothering you?",
    "What boundaries do you need to set?",
    "What would help you feel heard and respected?"
  ],
  confused: [
    "Let's explore this together. What feels unclear to you?",
    "What questions are you holding right now?",
    "What would help you gain clarity?"
  ],
  excited: [
    "I love your enthusiasm! What's got you excited?",
    "Tell me more about what's energizing you.",
    "How can you channel this positive energy?"
  ]
};


const dailyQuestions = [
  "What's one thing you're grateful for today, and why does it matter to you?",
  "If you could give your past self one piece of advice, what would it be?",
  "What emotion did you feel most strongly today, and what was it trying to tell you?",
  "What's a small win you had today that you want to celebrate?",
  "If today was a chapter in your life story, what would the title be?",
  "What's one thing you learned about yourself today?",
  "What would you tell someone you love if they were feeling exactly how you feel right now?",
  "What's one boundary you want to set for yourself this week?",
  "What's bringing you the most peace in this moment?",
  "If you could change one thing about how you approached today, what would it be?",
  "What's one thing you're proud of about yourself today?",
  "What's a fear you're ready to face this week?",
  "What does your body need you to hear right now?",
  "What's one way you want to show yourself more compassion?",
  "What's a dream you've been putting off that you want to take one step toward?",
  "What's one thing that made you feel truly alive today?",
  "What's a belief about yourself that you want to challenge?",
  "What's one way you want to grow in the next month?",
  "What's something you're curious about in your own life?",
  "What's one thing you want to forgive yourself for?",
  "What's a value that's most important to you right now?",
  "What's one way you want to be more authentic?",
  "What's something you're excited about in your future?",
  "What's one thing you want to let go of?",
  "What's a goal that feels both challenging and exciting?",
  "What's one way you want to be kinder to yourself?",
  "What's something you're learning about relationships?",
  "What's one thing you want to try that scares you a little?",
  "What's a habit you want to build that would serve you well?",
  "What's one thing you want to remember about this time in your life?"
];

const badges = {
  'first_steps': { name: 'First Steps', description: 'Started your reflection journey', icon: '🌱' },
  'streak_3': { name: 'Getting Started', description: '3-day reflection streak', icon: '🔥' },
  'streak_7': { name: 'Week Warrior', description: '7-day reflection streak', icon: '💪' },
  'streak_14': { name: 'Two Week Champion', description: '14-day reflection streak', icon: '🏆' },
  'streak_30': { name: 'Monthly Master', description: '30-day reflection streak', icon: '👑' },
  'streak_100': { name: 'Century Sage', description: '100-day reflection streak', icon: '🧘' },
  'deep_diver': { name: 'Deep Diver', description: 'Used deeper questions 10 times', icon: '🔍' },
  'emotion_explorer': { name: 'Emotion Explorer', description: 'Explored all emotion categories', icon: '😊' },
  'daily_warrior': { name: 'Daily Warrior', description: 'Answered 7 daily questions', icon: '📅' },
  'wise_owl': { name: 'Wise Owl', description: 'Reached level 5', icon: '🦉' },
  'reflection_master': { name: 'Reflection Master', description: 'Reached level 10', icon: '🎯' }
};

const journeyOptions = [
  { duration: 7, name: 'Week Journey', description: '7 days of reflection', xpMultiplier: 1.0, color: 'blue', icon: '📅' },
  { duration: 14, name: 'Two Week Challenge', description: '14 days of growth', xpMultiplier: 1.5, color: 'green', icon: '💪' },
  { duration: 30, name: 'Monthly Mastery', description: '30 days of transformation', xpMultiplier: 2.0, color: 'purple', icon: '👑' },
  { duration: 60, name: 'Two Month Quest', description: '60 days of deep reflection', xpMultiplier: 2.5, color: 'orange', icon: '🌟' },
  { duration: 90, name: 'Quarter Journey', description: '90 days of wisdom', xpMultiplier: 3.0, color: 'red', icon: '🧘' }
];

const materialsShop = {
  'meditation_guide': { name: 'Meditation Guide', description: 'Guided meditation techniques', cost: 50, icon: '🧘', category: 'guides' },
  'emotion_wheel': { name: 'Emotion Wheel', description: 'Visual tool for emotional exploration', cost: 75, icon: '🎭', category: 'tools' },
  'gratitude_journal': { name: 'Gratitude Journal', description: 'Structured gratitude practice', cost: 100, icon: '📝', category: 'journals' },
  'breathing_exercises': { name: 'Breathing Exercises', description: 'Calming breathwork techniques', cost: 60, icon: '🌬️', category: 'exercises' },
  'mindfulness_reminders': { name: 'Mindfulness Reminders', description: 'Daily mindfulness prompts', cost: 80, icon: '🔔', category: 'tools' },
  'reflection_templates': { name: 'Reflection Templates', description: 'Structured reflection prompts', cost: 90, icon: '📋', category: 'guides' },
  'progress_tracker': { name: 'Progress Tracker', description: 'Visual progress visualization', cost: 120, icon: '📊', category: 'tools' },
  'wisdom_quotes': { name: 'Wisdom Quotes', description: 'Inspirational reflection quotes', cost: 40, icon: '💭', category: 'inspiration' },
  'stress_relief_kit': { name: 'Stress Relief Kit', description: 'Comprehensive stress management', cost: 150, icon: '🛡️', category: 'kits' },
  'self_compassion_guide': { name: 'Self-Compassion Guide', description: 'Building self-compassion practices', cost: 110, icon: '💝', category: 'guides' }
};

const materialPrompts = {
  'meditation_guide': [
    "Let's begin with a 5-minute guided meditation. Find a comfortable position and close your eyes. I'll guide you through a body scan meditation.",
    "Take a moment to center yourself. Let's practice a loving-kindness meditation together. I'll guide you through sending compassion to yourself and others.",
    "Let's try a mindfulness meditation. Focus on your breath and observe your thoughts without judgment. I'll guide you through this practice."
  ],
  'emotion_wheel': [
    "Let's explore your emotions using the emotion wheel. What primary emotion are you feeling right now? Let's identify the specific shade of that emotion.",
    "I'll help you map your emotional landscape. What secondary emotions are connected to your main feeling? Let's trace the emotional connections.",
    "Let's use the emotion wheel to explore the intensity of your feelings. Where would you place your current emotion on a scale from 1-10?"
  ],
  'gratitude_journal': [
    "Let's practice gratitude together. What are three things you're grateful for today, no matter how small? Let's explore why each one matters to you.",
    "I'll guide you through a structured gratitude practice. What's one person you're grateful for and why? How have they impacted your life?",
    "Let's reflect on gratitude. What's one challenge you faced today that you're grateful for? How did it help you grow?"
  ],
  'breathing_exercises': [
    "Let's practice the 4-7-8 breathing technique together. Breathe in for 4 counts, hold for 7, exhale for 8. I'll guide you through this calming exercise.",
    "Let's try box breathing. Inhale for 4, hold for 4, exhale for 4, hold for 4. I'll count with you as we practice this grounding technique.",
    "Let's do a breathing exercise to center yourself. Breathe in peace, breathe out tension. I'll guide you through this mindful breathing practice."
  ],
  'mindfulness_reminders': [
    "Let's practice mindfulness together. What are you noticing in this moment? What sounds, sensations, or thoughts are present?",
    "I'll guide you through a mindful awareness exercise. What's one thing you can see, hear, feel, smell, or taste right now?",
    "Let's bring mindfulness to your current experience. What emotions are present in your body right now? Where do you feel them?"
  ],
  'reflection_templates': [
    "Let's use a structured reflection template. What happened today that you want to reflect on? What were your thoughts and feelings about it?",
    "I'll guide you through a reflection template. What's one situation from today that challenged you? How did you respond, and what would you do differently?",
    "Let's use a reflection framework. What's one thing you learned about yourself today? How can you apply this learning going forward?"
  ],
  'progress_tracker': [
    "Let's review your reflection journey. What progress have you made in your emotional awareness? What patterns are you noticing?",
    "I'll help you track your growth. What's one way you've changed or grown through your reflection practice? What evidence do you see of this growth?",
    "Let's assess your progress. What reflection skills have you developed? How have they helped you in your daily life?"
  ],
  'wisdom_quotes': [
    "Here's a wisdom quote to inspire your reflection: 'The unexamined life is not worth living.' - Socrates. What does this mean to you in your current situation?",
    "Let me share some wisdom: 'You have been assigned this mountain to show others it can be moved.' How does this resonate with your current challenges?",
    "Here's a quote to reflect on: 'The cave you fear to enter holds the treasure you seek.' What treasure might be waiting for you in your current situation?"
  ],
  'stress_relief_kit': [
    "Let's use your stress relief toolkit. What's causing you stress right now? Let's identify the specific stressors and create a plan to address them.",
    "I'll guide you through stress management techniques. What's one stressor you can control, and what's one you need to accept? Let's work through this together.",
    "Let's practice stress relief together. What's one small action you can take right now to reduce your stress? How can you be kind to yourself in this moment?"
  ],
  'self_compassion_guide': [
    "Let's practice self-compassion together. What would you say to a dear friend who was feeling exactly how you feel right now? Now say that to yourself.",
    "I'll guide you through self-compassion. What's one thing you're being hard on yourself about? How can you show yourself the same kindness you'd show a friend?",
    "Let's work on self-compassion. What's one mistake or challenge you're facing? How can you treat yourself with the same understanding you'd give to someone you love?"
  ]
};

export default function AIChatPage() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotionPrompts, setShowEmotionPrompts] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    totalSessions: 0,
    totalMessages: 0,
    longestStreak: 0,
    lastActiveDate: '',
    badges: [],
    level: 1,
    experience: 0,
    goal: {
      type: 'daily',
      target: 1,
      current: 0,
      description: 'Reflect daily'
    },
    journey: {
      duration: 0,
      startDate: '',
      endDate: '',
      completed: false,
      xpMultiplier: 1.0
    },
    streakFreeze: 0,
    streakRecovery: false,
    materials: [],
    totalXPEarned: 0,
    totalXPSpent: 0
  });
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showDailyQuestion, setShowDailyQuestion] = useState(false);
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [streakMessage, setStreakMessage] = useState('');
  const [showStreakRecovery, setShowStreakRecovery] = useState(false);
  const [showJourneySelection, setShowJourneySelection] = useState(false);
  const [showMaterialsShop, setShowMaterialsShop] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<number | null>(null);
  const [showMaterialTools, setShowMaterialTools] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem('reflection-stats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);

      // Migrate old data structure to include new properties if missing
      if (!parsedStats.goal) {
        parsedStats.goal = {
          type: 'daily',
          target: 1,
          current: 0,
          description: 'Reflect daily'
        };
      }
      if (!parsedStats.journey) {
        parsedStats.journey = {
          duration: 0,
          startDate: '',
          endDate: '',
          completed: false,
          xpMultiplier: 1.0
        };
      }
      if (!parsedStats.materials) {
        parsedStats.materials = [];
      }
      if (!parsedStats.totalXPEarned) {
        parsedStats.totalXPEarned = 0;
      }
      if (!parsedStats.totalXPSpent) {
        parsedStats.totalXPSpent = 0;
      }
      localStorage.setItem('reflection-stats', JSON.stringify(parsedStats));

      setUserStats(parsedStats);

      // Check for streak recovery on load
      if (parsedStats.streak > 0) {
        setTimeout(() => {
          const lastActive = parsedStats.lastActiveDate;

          if (lastActive) {
            const lastDate = new Date(lastActive);
            const todayDate = new Date();
            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1 && parsedStats.streak > 0) {
              setShowStreakRecovery(true);
            }
          }
        }, 1000);
      }
    }

    // Load or generate daily question
    loadDailyQuestion();
  }, []);

  const loadDailyQuestion = () => {
    const today = new Date().toDateString();
    const savedQuestion = localStorage.getItem(`daily-question-${today}`);

    if (savedQuestion) {
      setDailyQuestion(JSON.parse(savedQuestion));
    } else {
      // Generate new daily question
      const questionIndex = new Date().getDate() % dailyQuestions.length;
      const newQuestion: DailyQuestion = {
        id: Date.now().toString(),
        question: dailyQuestions[questionIndex],
        category: 'daily_reflection',
        date: today,
        answered: false
      };
      setDailyQuestion(newQuestion);
      localStorage.setItem(`daily-question-${today}`, JSON.stringify(newQuestion));
    }
  };

  const updateUserStats = (newStats: Partial<UserStats>) => {
    const updatedStats = { ...userStats, ...newStats };
    setUserStats(updatedStats);
    localStorage.setItem('reflection-stats', JSON.stringify(updatedStats));
    checkForNewBadges(updatedStats);
  };

  const checkForNewBadges = (stats: UserStats) => {
    const newBadges: string[] = [];

    if (stats.totalSessions === 1 && !stats.badges.includes('first_steps')) {
      newBadges.push('first_steps');
    }
    if (stats.streak >= 3 && !stats.badges.includes('streak_3')) {
      newBadges.push('streak_3');
    }
    if (stats.streak >= 7 && !stats.badges.includes('streak_7')) {
      newBadges.push('streak_7');
    }
    if (stats.streak >= 14 && !stats.badges.includes('streak_14')) {
      newBadges.push('streak_14');
    }
    if (stats.streak >= 30 && !stats.badges.includes('streak_30')) {
      newBadges.push('streak_30');
    }
    if (stats.streak >= 100 && !stats.badges.includes('streak_100')) {
      newBadges.push('streak_100');
    }
    if (stats.level >= 5 && !stats.badges.includes('wise_owl')) {
      newBadges.push('wise_owl');
    }
    if (stats.level >= 10 && !stats.badges.includes('reflection_master')) {
      newBadges.push('reflection_master');
    }

    if (newBadges.length > 0) {
      updateUserStats({
        badges: [...stats.badges, ...newBadges]
      });
    }
  };

  const calculateLevel = (experience: number) => {
    return Math.floor(experience / 100) + 1;
  };

  const addExperience = (amount: number) => {
    const journeyMultiplier = userStats.journey?.xpMultiplier || 1.0;
    const totalAmount = Math.floor(amount * journeyMultiplier);
    const newExperience = userStats.experience + totalAmount;
    const newLevel = calculateLevel(newExperience);

    updateUserStats({
      experience: newExperience,
      level: newLevel,
      totalXPEarned: userStats.totalXPEarned + totalAmount
    });
  };

  const showStreakCelebration = (newStreak: number) => {
    const messages = [
      `🔥 ${newStreak} day streak! You're on fire!`,
      `🎉 Amazing! ${newStreak} days of reflection!`,
      `💪 ${newStreak} days strong! Keep it up!`,
      `🌟 ${newStreak} days of growth! You're incredible!`,
      `🚀 ${newStreak} days! You're building something beautiful!`
    ];

    if (newStreak === 1) {
      setStreakMessage("🎯 First day! Every journey begins with a single step!");
    } else if (newStreak === 7) {
      setStreakMessage("🏆 One week strong! You're building a powerful habit!");
    } else if (newStreak === 30) {
      setStreakMessage("👑 30 days! You're a reflection master!");
    } else if (newStreak === 100) {
      setStreakMessage("🧘 100 days! You've achieved something extraordinary!");
    } else {
      setStreakMessage(messages[Math.floor(Math.random() * messages.length)]);
    }

    setShowStreakAnimation(true);
    setTimeout(() => setShowStreakAnimation(false), 3000);
  };


  const recoverStreak = () => {
    updateUserStats({
      streak: userStats.streak,
      streakRecovery: true
    });
    setShowStreakRecovery(false);
    showStreakCelebration(userStats.streak);
  };

  const setUserGoal = (goalType: 'daily' | 'weekly' | 'monthly', target: number) => {
    const descriptions = {
      daily: 'Reflect every day',
      weekly: `Reflect ${target} times per week`,
      monthly: `Reflect ${target} times per month`
    };

    updateUserStats({
      goal: {
        type: goalType,
        target: target,
        current: 0,
        description: descriptions[goalType]
      }
    });
    setShowGoalSetting(false);
  };

  const startJourney = (journeyDuration: number) => {
    const journeyOption = journeyOptions.find(j => j.duration === journeyDuration);
    if (!journeyOption) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + journeyDuration);

    updateUserStats({
      journey: {
        duration: journeyDuration,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        completed: false,
        xpMultiplier: journeyOption.xpMultiplier
      }
    });

    setShowJourneySelection(false);
    setSelectedJourney(journeyDuration);

    // Show journey start celebration
    setTimeout(() => {
      alert(`🎯 Journey Started!\n\n${journeyOption.name}\n${journeyOption.description}\n\nXP Multiplier: ${journeyOption.xpMultiplier}x\n\nGood luck on your ${journeyDuration}-day reflection journey!`);
    }, 100);
  };

  const buyMaterial = (materialId: string) => {
    const material = materialsShop[materialId as keyof typeof materialsShop];
    if (!material) return;

    if (userStats.experience >= material.cost) {
      updateUserStats({
        experience: userStats.experience - material.cost,
        materials: [...userStats.materials, materialId],
        totalXPSpent: userStats.totalXPSpent + material.cost
      });

      alert(`🎉 Material Purchased!\n\n${material.icon} ${material.name}\n\nYou can now use this material in your reflections!`);
    } else {
      alert(`❌ Not enough XP!\n\nYou need ${material.cost} XP to buy this material.\nYou currently have ${userStats.experience} XP.`);
    }
  };

  const calculateJourneyProgress = () => {
    if (!userStats.journey.startDate) return 0;

    const startDate = new Date(userStats.journey.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return Math.min(daysPassed, userStats.journey.duration);
  };

  const useMaterial = (materialId: string) => {
    if (!userStats.materials.includes(materialId)) return;

    const prompts = materialPrompts[materialId as keyof typeof materialPrompts];
    if (!prompts) return;

    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Add the material prompt as an AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: selectedPrompt,
      isUser: false,
      timestamp: new Date()
    };

    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        messages: [...currentSession.messages, aiMessage]
      });

      // Add experience for using materials
      addExperience(10);
    }

    setShowMaterialTools(false);
  };

  const startNewSession = () => {
    const today = new Date().toDateString();
    const lastActive = userStats.lastActiveDate;

    // Calculate streak
    let newStreak = userStats.streak;
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const todayDate = new Date();
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        newStreak = userStats.streak + 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First time
      newStreak = 1;
    }

    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [{
        id: '1',
        text: "Hello! I'm here to support your emotional well-being and personal growth. How are you feeling today?",
        isUser: false,
        timestamp: new Date()
      }],
      startTime: new Date(),
      archived: false
    };

    // Update stats
    updateUserStats({
      streak: newStreak,
      totalSessions: userStats.totalSessions + 1,
      lastActiveDate: today,
      longestStreak: Math.max(userStats.longestStreak, newStreak),
      goal: {
        ...userStats.goal,
        current: (userStats.goal?.current || 0) + 1
      }
    });

    // Add experience for starting session (hidden until completion)
    const sessionXP = 10;
    addExperience(sessionXP);

    // Show streak celebration
    showStreakCelebration(newStreak);

    setCurrentSession(newSession);
  };

  const sendMessage = async (text: string) => {
    if (!currentSession || !text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    setCurrentSession(updatedSession);
    setInputText('');
    setIsTyping(true);

    // Add experience for sending message (hidden until completion)
    const messageXP = 5;
    addExperience(messageXP);
    updateUserStats({
      totalMessages: userStats.totalMessages + 1
    });

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setCurrentSession({
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage]
      });
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userText: string): string => {
    // Analyze the user's message for emotional content and generate contextual responses
    const text = userText.toLowerCase();

    // Emotional context analysis
    const isSad = text.includes('sad') || text.includes('hurt') || text.includes('pain') || text.includes('cry') || text.includes('depressed');
    const isAnxious = text.includes('worried') || text.includes('anxious') || text.includes('nervous') || text.includes('stress') || text.includes('panic');
    const isAngry = text.includes('angry') || text.includes('mad') || text.includes('frustrated') || text.includes('upset') || text.includes('rage');
    const isHappy = text.includes('happy') || text.includes('joy') || text.includes('excited') || text.includes('great') || text.includes('wonderful');
    const isConfused = text.includes('confused') || text.includes('lost') || text.includes('unclear') || text.includes('don\'t know') || text.includes('unsure');

    // Generate contextual introspective questions
    if (isSad) {
      const responses = [
        "I can hear the pain in your words. What's the deepest part of this sadness that you haven't shared yet?",
        "When you feel this way, what does your inner voice tell you about yourself?",
        "What would it look like to be gentle with yourself right now?",
        "If a close friend was feeling this way, what would you want them to know about their worth?",
        "What small thing could bring you a moment of peace today?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (isAnxious) {
      const responses = [
        "I sense the worry in your words. What's the fear that's driving this anxiety?",
        "When you feel anxious, what does your body need you to hear?",
        "What would it feel like to let go of trying to control this situation?",
        "If you could step outside of this worry for a moment, what would you see?",
        "What's one thing you know to be true about yourself that anxiety can't touch?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (isAngry) {
      const responses = [
        "I hear the fire in your words. What's really underneath this anger?",
        "What boundary is being crossed that's making you feel this way?",
        "If this anger had a message for you, what would it be saying?",
        "What would it look like to honor this feeling while staying true to your values?",
        "What does this situation teach you about what you will and won't accept?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (isHappy) {
      const responses = [
        "I love feeling your joy! What's making this moment so special for you?",
        "How can you carry this positive energy forward into other parts of your life?",
        "What does this happiness tell you about what truly matters to you?",
        "How can you create more moments like this for yourself?",
        "What would you tell your past self about this feeling of joy?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (isConfused) {
      const responses = [
        "I can feel the uncertainty in your words. What questions are you most afraid to ask yourself?",
        "When you feel lost like this, what does your intuition whisper to you?",
        "What would clarity look like for you in this situation?",
        "If you didn't have to have all the answers right now, what would you explore?",
        "What's one small step you could take toward understanding this better?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // General introspective responses for neutral content
    const generalResponses = [
      "That's a meaningful reflection. What patterns do you notice in how you're thinking about this?",
      "I appreciate you sharing that with me. What does this tell you about what you value most?",
      "That sounds important to you. What would your wisest self want you to know about this?",
      "I'm listening. What's the deeper truth you're discovering about yourself?",
      "Thank you for trusting me with that. How do you want to grow from this experience?",
      "That's a powerful insight. What would it look like to honor this understanding?",
      "I hear you. What does this situation teach you about yourself?",
      "That's a beautiful way to express yourself. What's the next step in your journey of self-discovery?"
    ];
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleEmotionPrompt = (emotion: string) => {
    setShowEmotionPrompts(false);

    // Generate AI prompt to help user explore their emotional state
    const emotionExplorationPrompts = {
      happy: [
        "I sense you're feeling joyful! Let's explore this happiness together. What's the source of this joy, and how does it feel in your body right now?",
        "Your happiness is beautiful to witness. Can you tell me what specific moment or thought is bringing you this joy today?",
        "I love feeling your positive energy! What would you say to someone else who's feeling exactly this way?"
      ],
      sad: [
        "I can feel the weight of sadness in your words. Let's sit with this feeling together. What does this sadness need you to hear right now?",
        "Your sadness is valid and important. What's the deepest part of this feeling that you haven't shared yet?",
        "I'm here with you in this sadness. What would it feel like to be completely gentle with yourself in this moment?"
      ],
      anxious: [
        "I notice anxiety in your energy. Let's breathe through this together. What's the fear that's driving this anxiety, and where do you feel it in your body?",
        "Your anxiety is trying to protect you. What would it look like to thank it for caring, then gently ask what it really needs you to know?",
        "I can sense the worry. What's one thing you know to be true about yourself that this anxiety can't touch?"
      ],
      angry: [
        "I feel the fire of anger in your words. This emotion has important information for you. What boundary is being crossed that's making you feel this way?",
        "Your anger is valid and powerful. What would it look like to honor this feeling while staying true to your values?",
        "I hear the intensity of your anger. What does this situation teach you about what you will and won't accept?"
      ],
      confused: [
        "I can feel the uncertainty in your energy. Let's explore this confusion together. What questions are you most afraid to ask yourself right now?",
        "Your confusion is a sign of growth. What would clarity look like for you in this situation?",
        "I sense you're feeling lost. What would your intuition whisper to you if you could quiet all the noise for a moment?"
      ],
      excited: [
        "I love feeling your excitement! This energy is contagious. What's making this moment so special for you, and how can you carry this forward?",
        "Your enthusiasm is beautiful! What does this excitement tell you about what truly matters to you?",
        "I can feel your positive energy! How can you channel this excitement into something meaningful for your life?"
      ]
    };

    const prompts = emotionExplorationPrompts[emotion as keyof typeof emotionExplorationPrompts];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Add the AI's emotional exploration prompt as a message
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: selectedPrompt,
      isUser: false,
      timestamp: new Date()
    };

    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        messages: [...currentSession.messages, aiMessage]
      });

      // Add experience for emotional exploration
      addExperience(20);
    }
  };

  const handleIntrospectionPrompt = () => {
    // Generate a deeper AI question based on the conversation context
    const lastUserMessage = currentSession?.messages.filter(m => m.isUser).pop()?.text || "I'm reflecting on my thoughts";
    const aiResponse = generateAIResponse(lastUserMessage);

    // Add the AI's deeper question as a message
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        messages: [...currentSession.messages, aiMessage]
      });

      // Add experience for using deeper questions
      addExperience(15);
    }
  };

  const handleDailyQuestion = () => {
    setShowDailyQuestion(true);
  };

  const submitDailyAnswer = () => {
    if (dailyAnswer.trim() && dailyQuestion) {
      const updatedQuestion = {
        ...dailyQuestion,
        answered: true,
        answer: dailyAnswer.trim()
      };
      setDailyQuestion(updatedQuestion);
      localStorage.setItem(`daily-question-${dailyQuestion.date}`, JSON.stringify(updatedQuestion));

      // Add experience for answering daily question (with potential multiplier)
      const baseXP = 25;
      const streakMultiplier = Math.min(userStats.streak * 0.1, 2); // Max 2x multiplier
      const totalXP = Math.floor(baseXP * (1 + streakMultiplier));
      addExperience(totalXP);

      setDailyAnswer('');
      setShowDailyQuestion(false);

      // Show completion celebration
      setTimeout(() => {
        alert(`🎉 Daily reflection complete!\n\n+${totalXP} XP${streakMultiplier > 0 ? ` (${Math.round(streakMultiplier * 100)}% streak bonus!)` : ''}`);
      }, 100);
    }
  };

  const endChat = () => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
        archived: true
      };
      setCurrentSession(endedSession);
      // Here you would typically save to localStorage or send to a backend
      console.log('Chat archived:', endedSession);
    }
  };


  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
          {/* User Stats Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔥</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{userStats.streak}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">day streak</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Level {userStats.level} • {userStats.experience} XP
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Goal: {userStats.goal?.description || 'Reflect daily'}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowJourneySelection(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Start Journey"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button
                onClick={() => setShowMaterialsShop(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Materials Shop"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="View Progress"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Daily Question - Secret until clicked */}
          {dailyQuestion && !dailyQuestion.answered && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📅</span>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Daily Reflection</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  A special question awaits you today...
                </p>
                <button
                  onClick={handleDailyQuestion}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Reveal Today&apos;s Question
                </button>
              </div>
            </div>
          )}

          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-2xl">💭</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            AI Reflection Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            A safe space for emotional exploration and personal growth
          </p>

          <div className="space-y-3">
            <button
              onClick={startNewSession}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </button>

            {dailyQuestion && !dailyQuestion.answered && (
              <button
                onClick={handleDailyQuestion}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Reveal Daily Question
                <span className="ml-2">📅</span>
                <span className="ml-1">???</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Progress</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.streak}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.longestStreak}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.totalSessions}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.totalMessages}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
                  </div>
                </div>

                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Level {userStats.level}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{userStats.experience} XP</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userStats.experience % 100)}%` }}
                    ></div>
                  </div>
                </div>

                {userStats.badges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {userStats.badges.map((badgeId) => (
                        <div key={badgeId} className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                          <span>{badges[badgeId as keyof typeof badges]?.icon}</span>
                          <span className="text-xs text-yellow-700 dark:text-yellow-300">{badges[badgeId as keyof typeof badges]?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userStats.materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Materials</h3>
                    <div className="flex flex-wrap gap-2">
                      {userStats.materials.map((materialId) => {
                        const material = materialsShop[materialId as keyof typeof materialsShop];
                        if (!material) return null;
                        return (
                          <div key={materialId} className="flex items-center space-x-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-lg">
                            <span>{material.icon}</span>
                            <span className="text-xs text-purple-700 dark:text-purple-300">{material.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Question Modal */}
        {showDailyQuestion && dailyQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Reflection</h2>
                <button
                  onClick={() => setShowDailyQuestion(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{dailyQuestion.question}</p>

              <textarea
                value={dailyAnswer}
                onChange={(e) => setDailyAnswer(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowDailyQuestion(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDailyAnswer}
                  disabled={!dailyAnswer.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Submit Reflection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goal Setting Modal */}
        {showGoalSetting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Set Your Goal</h2>
                <button
                  onClick={() => setShowGoalSetting(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">Choose your reflection goal to stay motivated!</p>

              <div className="space-y-4">
                <button
                  onClick={() => setUserGoal('daily', 1)}
                  className="w-full p-4 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Daily</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reflect every day</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setUserGoal('weekly', 3)}
                  className="w-full p-4 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">3x Weekly</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reflect 3 times per week</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setUserGoal('weekly', 5)}
                  className="w-full p-4 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">5x Weekly</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reflect 5 times per week</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Streak Animation */}
        {showStreakAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center animate-bounce">
              <div className="text-6xl mb-4">🔥</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Streak!</h2>
              <p className="text-gray-600 dark:text-gray-400">{streakMessage}</p>
            </div>
          </div>
        )}

        {/* Streak Recovery Modal */}
        {showStreakRecovery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full text-center">
              <div className="text-4xl mb-4">💔</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Streak Broken</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You had a {userStats.streak} day streak! Don&apos;t worry, you can recover it and keep going.
                </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStreakRecovery(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Start Fresh
                </button>
                <button
                  onClick={recoverStreak}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  Recover Streak
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journey Selection Modal */}
        {showJourneySelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose Your Journey</h2>
                <button
                  onClick={() => setShowJourneySelection(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">Select your reflection journey duration. Longer journeys offer higher XP multipliers!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journeyOptions.map((journey) => (
                  <button
                    key={journey.duration}
                    onClick={() => startJourney(journey.duration)}
                    className={`p-4 border-2 rounded-xl hover:scale-105 transition-all duration-200 text-left ${
                      journey.color === 'blue' ? 'border-blue-200 hover:border-blue-400 dark:border-blue-700 dark:hover:border-blue-500' :
                      journey.color === 'green' ? 'border-green-200 hover:border-green-400 dark:border-green-700 dark:hover:border-green-500' :
                      journey.color === 'purple' ? 'border-purple-200 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-500' :
                      journey.color === 'orange' ? 'border-orange-200 hover:border-orange-400 dark:border-orange-700 dark:hover:border-orange-500' :
                      'border-red-200 hover:border-red-400 dark:border-red-700 dark:hover:border-red-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{journey.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{journey.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{journey.description}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      XP Multiplier: {journey.xpMultiplier}x
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Materials Shop Modal */}
        {showMaterialsShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Materials Shop</h2>
                <button
                  onClick={() => setShowMaterialsShop(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">Spend your XP to unlock new reflection materials!</p>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {userStats.experience} XP
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(materialsShop).map(([id, material]) => (
                  <div
                    key={id}
                    className={`p-4 border-2 rounded-xl ${
                      userStats.materials.includes(id)
                        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                        : userStats.experience >= material.cost
                        ? 'border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500'
                        : 'border-gray-200 opacity-50 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{material.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{material.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{material.description}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {material.cost} XP
                      </span>
                      {userStats.materials.includes(id) ? (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Owned</span>
                      ) : (
                        <button
                          onClick={() => buyMaterial(id)}
                          disabled={userStats.experience < material.cost}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">💭</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">AI Reflection</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Always here to listen</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">🔥</span>
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{userStats.streak}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">🎯</span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{userStats.goal?.current || 0}/{userStats.goal?.target || 1}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
            title="View Progress"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={endChat}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
            title="End & Archive Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setShowEmotionPrompts(!showEmotionPrompts)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            🎭 Explore Feelings
          </button>
          <button
            onClick={handleIntrospectionPrompt}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            🔍 Deeper
          </button>
          {userStats.materials.length > 0 && (
            <button
              onClick={() => setShowMaterialTools(!showMaterialTools)}
              className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 py-2 px-3 rounded-xl text-sm font-medium hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-colors"
            >
              🛠️ Materials
            </button>
          )}
        </div>

        {showEmotionPrompts && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.keys(emotionPrompts).map((emotion) => (
              <button
                key={emotion}
                onClick={() => handleEmotionPrompt(emotion)}
                className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors capitalize"
              >
                {emotion === 'anxious' ? '😰' : emotion === 'excited' ? '🎉' : emotion === 'confused' ? '🤔' : emotion === 'angry' ? '😠' : emotion === 'sad' ? '😢' : '😊'} {emotion}
              </button>
            ))}
          </div>
        )}

        {showMaterialTools && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {userStats.materials.map((materialId) => {
              const material = materialsShop[materialId as keyof typeof materialsShop];
              if (!material) return null;

              return (
                <button
                  key={materialId}
                  onClick={() => useMaterial(materialId)}
                  className="py-2 px-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-colors"
                >
                  {material.icon} {material.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-3 px-4 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Progress</h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.streak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.longestStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.totalMessages}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
                </div>
              </div>

              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Level {userStats.level}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{userStats.experience} XP</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userStats.experience % 100)}%` }}
                  ></div>
                </div>
              </div>

              {userStats.badges.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {userStats.badges.map((badgeId) => (
                      <div key={badgeId} className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        <span>{badges[badgeId as keyof typeof badges]?.icon}</span>
                        <span className="text-xs text-yellow-700 dark:text-yellow-300">{badges[badgeId as keyof typeof badges]?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

