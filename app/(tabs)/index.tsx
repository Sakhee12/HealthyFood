import { CategoryTabs } from '@/components/CategoryTabs';
import { HomeScreenHeader } from '@/components/HomeScreenHeader';
import { OffersBanner } from '@/components/OffersBanner';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const CATEGORIES = ['All', 'Holi', 'Ramzan', 'Kids', 'Gifting', 'Imported', 'Kuch Bhi'];

const PRODUCTS = [
  { id: '1', name: 'Organic Honey', weight: '500g', price: '₹450', image: '🍯', rating: 4.8 },
  { id: '2', name: 'Fresh Avocado', weight: '2 pcs', price: '₹220', image: '🥑', rating: 4.5 },
  { id: '3', name: 'Almond Milk', weight: '1L', price: '₹180', image: '🥛', rating: 4.7 },
  { id: '4', name: 'Quinoa Seeds', weight: '1kg', price: '₹550', image: '🍚', rating: 4.9 },
  { id: '5', name: 'Greek Yogurt', weight: '200g', price: '₹80', image: '🍦', rating: 4.6 },
];

const DAILY_ESSENTIALS = [
  { id: '6', name: 'Fresh Spinach', weight: '250g', price: '₹40', image: '🥬', rating: 4.4 },
  { id: '7', name: 'Brown Eggs', weight: '6 pcs', price: '₹95', image: '🥚', rating: 4.8 },
  { id: '8', name: 'Oats Pack', weight: '500g', price: '₹120', image: '🥣', rating: 4.5 },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const getGradientColors = () => {
    switch (activeCategory.toLowerCase()) {
      case 'holi': return Colors.gradients.holi;
      case 'ramzan': return Colors.gradients.ramzan;
      case 'kids': return Colors.gradients.kids;
      case 'gifting': return Colors.gradients.gifting;
      case 'imported': return Colors.gradients.imported;
      case 'kuch bhi': return Colors.gradients.kuchBhi;
      default: return Colors.gradients.all;
    }
  };

  const currentGradient = getGradientColors();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HomeScreenHeader activeCategory={activeCategory} />

      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.healthy.primary} />
        }
      >
        {/* Sticky Tabs Section */}
        <View style={[styles.stickyHeader, { backgroundColor: currentGradient[0] }]}>
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </View>

        {/* Dynamic Background Area */}
        <View style={{ backgroundColor: currentGradient[currentGradient.length - 1] }}>
          {/* Offers Section */}
          <OffersBanner category={activeCategory} />

          {/* Healthy Picks Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Healthy Picks</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
              {PRODUCTS.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </ScrollView>
          </View>

          {/* Daily Essentials Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Essentials</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
              {DAILY_ESSENTIALS.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </ScrollView>
          </View>

          {/* Bottom Spacer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.healthy.white,
  },
  stickyHeader: {
    backgroundColor: Colors.healthy.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.healthy.primary,
  },
  productRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
