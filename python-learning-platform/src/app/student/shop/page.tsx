'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { shopItems, ShopItem, getRarityColor, getRarityBg, getShopItemById } from '@/data/shop';
import {
  ShoppingBag,
  Star,
  Check,
  Sparkles,
  Crown,
  Gem,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Category = 'all' | 'avatar' | 'frame';

export default function ShopPage() {
  const { user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const student = user as Student;

  if (!student) return null;

  const filteredItems = selectedCategory === 'all'
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Sort by rarity then price
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    return a.price - b.price;
  });

  const handlePurchase = async (item: ShopItem) => {
    if (student.points < item.price) {
      toast.error('Недостаточно баллов!');
      return;
    }

    if (student.purchasedItems?.includes(item.id)) {
      toast.error('Уже куплено!');
      return;
    }

    setPurchasing(item.id);

    try {
      const response = await fetch(`/api/students/${student.id}/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, action: 'purchase' }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      const updatedStudent = await response.json();

      // Update local state
      useStore.setState({ user: updatedStudent });
      sessionStorage.setItem('user', JSON.stringify(updatedStudent));

      toast.success(`${item.nameRu} куплен!`);
    } catch (error) {
      toast.error('Ошибка покупки');
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      const response = await fetch(`/api/students/${student.id}/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, action: 'equip' }),
      });

      if (!response.ok) {
        throw new Error('Equip failed');
      }

      const updatedStudent = await response.json();

      useStore.setState({ user: updatedStudent });
      sessionStorage.setItem('user', JSON.stringify(updatedStudent));

      toast.success(`${item.nameRu} экипирован!`);
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const isOwned = (itemId: string) => student.purchasedItems?.includes(itemId) || false;
  const isEquipped = (item: ShopItem) => {
    if (item.category === 'avatar') return student.equippedAvatar === item.id;
    if (item.category === 'frame') return student.equippedFrame === item.id;
    return false;
  };

  const getRarityIcon = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'common': return <Zap className="w-4 h-4" />;
      case 'rare': return <Gem className="w-4 h-4" />;
      case 'epic': return <Sparkles className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getRarityName = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'Обычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'legendary': return 'Легендарный';
    }
  };

  // Get equipped avatar for preview
  const equippedAvatarItem = student.equippedAvatar ? getShopItemById(student.equippedAvatar) : null;
  const equippedFrameItem = student.equippedFrame ? getShopItemById(student.equippedFrame) : null;

  return (
    <div className="min-h-screen">
      <Header title="Магазин" subtitle="Обменяй баллы на крутые аватары" />

      <div className="p-8">
        {/* Balance & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Avatar Preview */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Твой аватар</h3>
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl
                ${equippedAvatarItem ? `bg-gradient-to-br ${equippedAvatarItem.gradient}` : 'bg-gradient-to-br from-green-500 to-emerald-600'}
                ${equippedFrameItem?.borderColor || ''}
              `}>
                {equippedAvatarItem?.emoji || student.name.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold text-white">{student.name}</p>
                <p className="text-gray-400">{student.grade} класс</p>
                {equippedAvatarItem && (
                  <p className={`text-sm mt-2 ${getRarityColor(equippedAvatarItem.rarity)}`}>
                    {equippedAvatarItem.nameRu}
                  </p>
                )}
                {equippedFrameItem && (
                  <p className={`text-sm ${getRarityColor(equippedFrameItem.rarity)}`}>
                    + {equippedFrameItem.nameRu}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Balance */}
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400">Баланс</span>
            </div>
            <p className="text-4xl font-bold text-yellow-400">{student.points}</p>
            <p className="text-gray-500 text-sm mt-1">баллов</p>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 mr-2">Категория:</span>
          {[
            { key: 'all', label: 'Все' },
            { key: 'avatar', label: 'Аватары' },
            { key: 'frame', label: 'Рамки' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as Category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map((item) => {
            const owned = isOwned(item.id);
            const equipped = isEquipped(item);
            const canAfford = student.points >= item.price;

            return (
              <Card
                key={item.id}
                className={`p-4 border transition-all hover:scale-105 ${getRarityBg(item.rarity)} ${
                  equipped ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Item Preview */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl
                      ${item.gradient ? `bg-gradient-to-br ${item.gradient}` : 'bg-gray-700'}
                      ${item.borderColor || ''}
                    `}
                  >
                    {item.emoji || '?'}
                  </div>
                </div>

                {/* Item Info */}
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center gap-1 text-xs font-medium mb-1 ${getRarityColor(item.rarity)}`}>
                    {getRarityIcon(item.rarity)}
                    {getRarityName(item.rarity)}
                  </div>
                  <h3 className="font-bold text-white">{item.nameRu}</h3>
                  <p className="text-gray-500 text-sm">{item.descriptionRu}</p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className={`font-bold ${canAfford || owned ? 'text-yellow-400' : 'text-red-400'}`}>
                      {item.price}
                    </span>
                  </div>

                  {owned ? (
                    equipped ? (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        Надето
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEquip(item)}
                      >
                        Надеть
                      </Button>
                    )
                  ) : (
                    <Button
                      size="sm"
                      disabled={!canAfford || purchasing === item.id}
                      onClick={() => handlePurchase(item)}
                    >
                      {purchasing === item.id ? '...' : 'Купить'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl">
          <p className="text-gray-400 text-sm text-center">
            Решай задачи и получай баллы, чтобы покупать крутые аватары!
            Легендарные аватары имеют анимацию свечения.
          </p>
        </div>
      </div>
    </div>
  );
}
