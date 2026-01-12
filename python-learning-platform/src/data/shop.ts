export interface ShopItem {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  price: number;
  category: 'avatar' | 'frame' | 'background' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  // Avatar styling
  gradient?: string;
  emoji?: string;
  borderColor?: string;
  animation?: string;
}

export const shopItems: ShopItem[] = [
  // Common Avatars (1000-1500 points)
  {
    id: 'avatar-fire',
    name: 'Fire Spirit',
    nameRu: 'Дух Огня',
    description: 'A blazing fire avatar',
    descriptionRu: 'Пылающий огненный аватар',
    price: 1000,
    category: 'avatar',
    rarity: 'common',
    gradient: 'from-orange-500 to-red-600',
    emoji: '🔥',
  },
  {
    id: 'avatar-ice',
    name: 'Ice Crystal',
    nameRu: 'Ледяной Кристалл',
    description: 'A cool ice avatar',
    descriptionRu: 'Крутой ледяной аватар',
    price: 1000,
    category: 'avatar',
    rarity: 'common',
    gradient: 'from-cyan-400 to-blue-600',
    emoji: '❄️',
  },
  {
    id: 'avatar-leaf',
    name: 'Forest Guardian',
    nameRu: 'Страж Леса',
    description: 'Nature-themed avatar',
    descriptionRu: 'Аватар в стиле природы',
    price: 1000,
    category: 'avatar',
    rarity: 'common',
    gradient: 'from-green-400 to-emerald-600',
    emoji: '🌿',
  },
  {
    id: 'avatar-thunder',
    name: 'Thunder Strike',
    nameRu: 'Удар Грома',
    description: 'Electric energy avatar',
    descriptionRu: 'Аватар электрической энергии',
    price: 1200,
    category: 'avatar',
    rarity: 'common',
    gradient: 'from-yellow-400 to-amber-600',
    emoji: '⚡',
  },
  {
    id: 'avatar-water',
    name: 'Ocean Wave',
    nameRu: 'Океанская Волна',
    description: 'Deep sea avatar',
    descriptionRu: 'Аватар глубокого моря',
    price: 1200,
    category: 'avatar',
    rarity: 'common',
    gradient: 'from-blue-400 to-indigo-600',
    emoji: '🌊',
  },

  // Rare Avatars (1500-2500 points)
  {
    id: 'avatar-galaxy',
    name: 'Galaxy Explorer',
    nameRu: 'Исследователь Галактики',
    description: 'Cosmic space avatar',
    descriptionRu: 'Космический аватар',
    price: 1500,
    category: 'avatar',
    rarity: 'rare',
    gradient: 'from-purple-500 via-pink-500 to-indigo-600',
    emoji: '🌌',
  },
  {
    id: 'avatar-ninja',
    name: 'Shadow Ninja',
    nameRu: 'Теневой Ниндзя',
    description: 'Mysterious ninja avatar',
    descriptionRu: 'Загадочный аватар ниндзя',
    price: 1800,
    category: 'avatar',
    rarity: 'rare',
    gradient: 'from-gray-700 to-gray-900',
    emoji: '🥷',
  },
  {
    id: 'avatar-robot',
    name: 'Cyber Bot',
    nameRu: 'Кибер Бот',
    description: 'Futuristic robot avatar',
    descriptionRu: 'Футуристический аватар робота',
    price: 2000,
    category: 'avatar',
    rarity: 'rare',
    gradient: 'from-slate-400 to-zinc-600',
    emoji: '🤖',
  },
  {
    id: 'avatar-wizard',
    name: 'Code Wizard',
    nameRu: 'Волшебник Кода',
    description: 'Magical coding wizard',
    descriptionRu: 'Магический волшебник кода',
    price: 2200,
    category: 'avatar',
    rarity: 'rare',
    gradient: 'from-violet-500 to-purple-700',
    emoji: '🧙',
  },
  {
    id: 'avatar-phoenix',
    name: 'Phoenix Rising',
    nameRu: 'Восставший Феникс',
    description: 'Legendary bird of fire',
    descriptionRu: 'Легендарная огненная птица',
    price: 2500,
    category: 'avatar',
    rarity: 'rare',
    gradient: 'from-orange-400 via-red-500 to-yellow-500',
    emoji: '🔥',
  },

  // Epic Avatars (2500-4000 points)
  {
    id: 'avatar-dragon',
    name: 'Dragon Master',
    nameRu: 'Повелитель Драконов',
    description: 'Powerful dragon avatar',
    descriptionRu: 'Могущественный аватар дракона',
    price: 3000,
    category: 'avatar',
    rarity: 'epic',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
    emoji: '🐉',
    borderColor: 'ring-2 ring-orange-500',
  },
  {
    id: 'avatar-unicorn',
    name: 'Mystic Unicorn',
    nameRu: 'Мистический Единорог',
    description: 'Magical unicorn avatar',
    descriptionRu: 'Волшебный аватар единорога',
    price: 3000,
    category: 'avatar',
    rarity: 'epic',
    gradient: 'from-pink-400 via-purple-400 to-indigo-400',
    emoji: '🦄',
    borderColor: 'ring-2 ring-pink-500',
  },
  {
    id: 'avatar-alien',
    name: 'Alien Hacker',
    nameRu: 'Инопланетный Хакер',
    description: 'Extraterrestrial coder',
    descriptionRu: 'Внеземной программист',
    price: 3500,
    category: 'avatar',
    rarity: 'epic',
    gradient: 'from-green-400 to-lime-500',
    emoji: '👽',
    borderColor: 'ring-2 ring-green-500',
  },
  {
    id: 'avatar-samurai',
    name: 'Code Samurai',
    nameRu: 'Самурай Кода',
    description: 'Honorable warrior coder',
    descriptionRu: 'Почётный воин-программист',
    price: 3500,
    category: 'avatar',
    rarity: 'epic',
    gradient: 'from-red-700 to-rose-900',
    emoji: '⚔️',
    borderColor: 'ring-2 ring-red-500',
  },
  {
    id: 'avatar-astronaut',
    name: 'Space Coder',
    nameRu: 'Космический Кодер',
    description: 'Coding among the stars',
    descriptionRu: 'Программирование среди звёзд',
    price: 4000,
    category: 'avatar',
    rarity: 'epic',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    emoji: '👨‍🚀',
    borderColor: 'ring-2 ring-purple-500',
  },

  // Legendary Avatars (4500-5000 points)
  {
    id: 'avatar-diamond',
    name: 'Diamond Elite',
    nameRu: 'Бриллиантовый Элита',
    description: 'The rarest diamond avatar',
    descriptionRu: 'Самый редкий бриллиантовый аватар',
    price: 4500,
    category: 'avatar',
    rarity: 'legendary',
    gradient: 'from-cyan-300 via-blue-400 to-purple-500',
    emoji: '💎',
    borderColor: 'ring-2 ring-cyan-400 animate-pulse',
  },
  {
    id: 'avatar-crown',
    name: 'Royal Coder',
    nameRu: 'Королевский Кодер',
    description: 'The king of coders',
    descriptionRu: 'Король программистов',
    price: 4500,
    category: 'avatar',
    rarity: 'legendary',
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    emoji: '👑',
    borderColor: 'ring-2 ring-yellow-400 animate-pulse',
  },
  {
    id: 'avatar-infinity',
    name: 'Infinity Master',
    nameRu: 'Мастер Бесконечности',
    description: 'Unlimited power avatar',
    descriptionRu: 'Аватар безграничной силы',
    price: 5000,
    category: 'avatar',
    rarity: 'legendary',
    gradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
    emoji: '♾️',
    borderColor: 'ring-2 ring-fuchsia-500 animate-pulse',
  },
  {
    id: 'avatar-matrix',
    name: 'Matrix Architect',
    nameRu: 'Архитектор Матрицы',
    description: 'Master of the digital realm',
    descriptionRu: 'Повелитель цифрового мира',
    price: 5000,
    category: 'avatar',
    rarity: 'legendary',
    gradient: 'from-green-500 to-emerald-700',
    emoji: '🖥️',
    borderColor: 'ring-2 ring-green-400 animate-pulse',
  },

  // Frames (decorative borders)
  {
    id: 'frame-gold',
    name: 'Golden Frame',
    nameRu: 'Золотая Рамка',
    description: 'Luxurious gold border',
    descriptionRu: 'Роскошная золотая рамка',
    price: 2000,
    category: 'frame',
    rarity: 'rare',
    borderColor: 'ring-4 ring-yellow-500',
  },
  {
    id: 'frame-rainbow',
    name: 'Rainbow Frame',
    nameRu: 'Радужная Рамка',
    description: 'Colorful rainbow border',
    descriptionRu: 'Разноцветная радужная рамка',
    price: 3000,
    category: 'frame',
    rarity: 'epic',
    borderColor: 'ring-4 ring-gradient',
  },
  {
    id: 'frame-neon',
    name: 'Neon Glow',
    nameRu: 'Неоновое Свечение',
    description: 'Glowing neon effect',
    descriptionRu: 'Светящийся неоновый эффект',
    price: 4000,
    category: 'frame',
    rarity: 'legendary',
    borderColor: 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-500/50',
  },
];

export const getShopItemById = (id: string): ShopItem | undefined => {
  return shopItems.find(item => item.id === id);
};

export const getShopItemsByCategory = (category: ShopItem['category']): ShopItem[] => {
  return shopItems.filter(item => item.category === category);
};

export const getRarityColor = (rarity: ShopItem['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
  }
};

export const getRarityBg = (rarity: ShopItem['rarity']): string => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/10 border-gray-500/30';
    case 'rare': return 'bg-blue-500/10 border-blue-500/30';
    case 'epic': return 'bg-purple-500/10 border-purple-500/30';
    case 'legendary': return 'bg-yellow-500/10 border-yellow-500/30 animate-pulse';
  }
};
