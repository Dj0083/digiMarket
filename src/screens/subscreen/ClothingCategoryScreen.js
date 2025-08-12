import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet,
  FlatList 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ClothingCategoryScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }

    setFavorites(newFavorites);
  };

  const clothingItems = [
    { id: 1, name: 'Traditional Saree', price: 2500, rating: 4.8, image: 'https://via.placeholder.com/150x150', category: 'Women' },
    { id: 2, name: 'Cotton Kurta', price: 800, rating: 4.5, image: 'https://via.placeholder.com/150x150', category: 'Men' },
    { id: 3, name: 'Silk Blouse', price: 1200, rating: 4.6, image: 'https://via.placeholder.com/150x150', category: 'Women' },
    { id: 4, name: 'Dhoti Set', price: 600, rating: 4.3, image: 'https://via.placeholder.com/150x150', category: 'Men' },
    { id: 5, name: 'Embroidered Dupatta', price: 400, rating: 4.7, image: 'https://via.placeholder.com/150x150', category: 'Accessories' },
    { id: 6, name: 'Handwoven Shawl', price: 1500, rating: 4.9, image: 'https://via.placeholder.com/150x150', category: 'Accessories' },
  ];

  const subCategories = ['All', 'Women', 'Men', 'Accessories'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity 
          onPress={() => toggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <MaterialIcons 
            name={favorites.has(item.id) ? "favorite" : "favorite-border"} 
            size={20} 
            color={favorites.has(item.id) ? "#EF4444" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FCD34D" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>Rs.{item.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clothing</Text>
        <View style={styles.headerRight}>
          <MaterialIcons name="shopping-cart" size={24} color="white" style={{ marginRight: 12 }} />
          <MaterialIcons name="more-vert" size={24} color="white" />
        </View>
      </View>

      {/* Sub Categories - Fixed height */}
      <View style={styles.subCategoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subCategoriesContent}
        >
          {subCategories.map((category) => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.subCategoryButton,
                selectedCategory === category && styles.subCategoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.subCategoryText,
                selectedCategory === category && styles.subCategoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        <Text style={styles.resultsText}>{filteredItems.length} items found</Text>
        
        <FlatList
          data={filteredItems}
          renderItem={renderProduct}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48, // Increased top padding for proper spacing
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Fixed subcategories container
  subCategoriesWrapper: {
    height: 50, // Fixed height
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: 'center',
  },
  subCategoriesContent: {
    alignItems: 'center',
    gap: 12,
  },
  subCategoryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, // Reduced padding
    paddingVertical: 6,    // Reduced padding
    borderRadius: 16,      // Smaller border radius
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    height: 32,           // Fixed height for buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCategoryButtonActive: {
    backgroundColor: 'white',
  },
  subCategoryText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,         // Slightly smaller font
  },
  subCategoryTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 14,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  productsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  productPrice: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ClothingCategoryScreen;