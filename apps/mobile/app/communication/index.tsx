/**
 * Communication Boards Screen
 * AAC (Augmented and Alternative Communication) boards
 */

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, Spinner, EmptyState, Badge } from '../../src/components';

interface CommunicationCard {
  id: string;
  symbol: string;
  label: string;
}

interface CommunicationBoard {
  id: string;
  patientName: string;
  name: string;
  category: string;
  cards: CommunicationCard[];
  gridSize: string;
}

const DEMO_BOARDS: CommunicationBoard[] = [
  {
    id: '1',
    patientName: 'Emma Johnson',
    name: 'Core Words',
    category: 'core-words',
    gridSize: '4x4',
    cards: [
      { id: '1', symbol: '👋', label: 'Hi' },
      { id: '2', symbol: '👋', label: 'Bye' },
      { id: '3', symbol: '👍', label: 'Yes' },
      { id: '4', symbol: '👎', label: 'No' },
      { id: '5', symbol: '😊', label: 'Happy' },
      { id: '6', symbol: '😢', label: 'Sad' },
      { id: '7', symbol: '😠', label: 'Mad' },
      { id: '8', symbol: '😴', label: 'Tired' },
      { id: '9', symbol: '🍎', label: 'Eat' },
      { id: '10', symbol: '🥤', label: 'Drink' },
      { id: '11', symbol: '🧸', label: 'Play' },
      { id: '12', symbol: '📚', label: 'Read' },
      { id: '13', symbol: '🎵', label: 'Music' },
      { id: '14', symbol: '🚗', label: 'Car' },
      { id: '15', symbol: '🐕', label: 'Dog' },
      { id: '16', symbol: '⏰', label: 'More' },
    ],
  },
  {
    id: '2',
    patientName: 'Emma Johnson',
    name: 'Feelings',
    category: 'feelings',
    gridSize: '3x3',
    cards: [
      { id: '1', symbol: '😊', label: 'Happy' },
      { id: '2', symbol: '😢', label: 'Sad' },
      { id: '3', symbol: '😠', label: 'Mad' },
      { id: '4', symbol: '😴', label: 'Tired' },
      { id: '5', symbol: '🤔', label: 'Think' },
      { id: '6', symbol: '😰', label: 'Worried' },
      { id: '7', symbol: '🤗', label: 'Excited' },
      { id: '8', symbol: '😌', label: 'Calm' },
      { id: '9', symbol: '🤒', label: 'Sick' },
    ],
  },
  {
    id: '3',
    patientName: 'Liam Williams',
    name: 'Actions',
    category: 'actions',
    gridSize: '3x3',
    cards: [
      { id: '1', symbol: '🏃', label: 'Run' },
      { id: '2', symbol: '🚶', label: 'Walk' },
      { id: '3', symbol: '🧘', label: 'Sit' },
      { id: '4', symbol: '✋', label: 'Stop' },
      { id: '5', symbol: '👍', label: 'Help' },
      { id: '6', symbol: '🎁', label: 'Give' },
      { id: '7', symbol: '👀', label: 'Look' },
      { id: '8', symbol: '👂', label: 'Listen' },
      { id: '9', symbol: '🗣️', label: 'Talk' },
    ],
  },
];

const QUICK_ACCESS = [
  { id: 'qa1', symbol: '👍', label: 'Yes' },
  { id: 'qa2', symbol: '👎', label: 'No' },
  { id: 'qa3', symbol: '⏰', label: 'More' },
  { id: 'qa4', symbol: '✅', label: 'Done' },
  { id: 'qa5', symbol: '❓', label: 'What' },
  { id: 'qa6', symbol: '➡️', label: 'Ready' },
];

const CATEGORIES = [
  { id: 'core-words', name: 'Core Words', icon: '💬' },
  { id: 'feelings', name: 'Feelings', icon: '😊' },
  { id: 'actions', name: 'Actions', icon: '🏃' },
  { id: 'objects', name: 'Objects', icon: '🍎' },
  { id: 'places', name: 'Places', icon: '🏠' },
  { id: 'social', name: 'Social', icon: '👋' },
];

export default function CommunicationScreen() {
  const router = useRouter();
  const [boards, setBoards] = useState<CommunicationBoard[]>(DEMO_BOARDS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeBoard, setActiveBoard] = useState<CommunicationBoard | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const filteredBoards = selectedCategory
    ? boards.filter((b) => b.category === selectedCategory)
    : boards;

  const handleCardPress = (card: CommunicationCard) => {
    setSelectedCards((prev) => {
      if (prev.includes(card.label)) {
        return prev.filter((c) => c !== card.label);
      }
      return [...prev, card.label];
    });
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  if (activeBoard) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveBoard(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{activeBoard.name}</Text>
          <Text style={styles.subtitle}>{activeBoard.patientName}</Text>
        </View>

        <View style={styles.quickAccessBar}>
          {QUICK_ACCESS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.quickAccessCard,
                selectedCards.includes(card.label) && styles.quickAccessCardActive,
              ]}
              onPress={() => handleCardPress(card)}
            >
              <Text style={styles.quickAccessSymbol}>{card.symbol}</Text>
              <Text style={styles.quickAccessLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.boardContainer}>
          <View
            style={[
              styles.boardGrid,
              { gridTemplateColumns: `repeat(${activeBoard.gridSize === '4x4' ? 4 : 3}, 1fr)` },
            ]}
          >
            {activeBoard.cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.boardCard,
                  selectedCards.includes(card.label) && styles.boardCardActive,
                ]}
                onPress={() => handleCardPress(card)}
              >
                <Text style={styles.boardSymbol}>{card.symbol}</Text>
                <Text style={styles.boardLabel}>{card.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedCards.length > 0 && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>
              Selected: {selectedCards.join(' ')}
            </Text>
            <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Communication</Text>
        <Text style={styles.subtitle}>AAC Communication Boards</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <TouchableOpacity
          style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.categoryIcon}>📋</Text>
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/communication/add')}
      >
        <Text style={styles.addButtonText}>+ Add Board</Text>
      </TouchableOpacity>

      <ScrollView style={styles.boardList}>
        {filteredBoards.length === 0 ? (
          <EmptyState
            title="No boards yet"
            description="Create communication boards to help children express themselves"
            icon="💬"
            actionLabel="Add Board"
            onAction={() => router.push('/communication/add')}
          />
        ) : (
          filteredBoards.map((board) => (
            <TouchableOpacity
              key={board.id}
              style={styles.boardCard}
              onPress={() => setActiveBoard(board)}
            >
              <View style={styles.boardInfo}>
                <Text style={styles.boardName}>{board.name}</Text>
                <Text style={styles.boardPatient}>{board.patientName}</Text>
              </View>
              <Badge variant="primary" size="sm">
                {board.gridSize}
              </Badge>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8B5CF6',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#EDE9FE',
    marginTop: 4,
  },
  categoryScroll: {
    maxHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  boardList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  boardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  boardInfo: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  boardPatient: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  quickAccessBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickAccessCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  quickAccessCardActive: {
    backgroundColor: '#8B5CF6',
  },
  quickAccessSymbol: {
    fontSize: 24,
  },
  quickAccessLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  boardContainer: {
    flex: 1,
    padding: 16,
  },
  boardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  boardCard: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 8,
  },
  boardCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#EDE9FE',
  },
  boardSymbol: {
    fontSize: 32,
  },
  boardLabel: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});
