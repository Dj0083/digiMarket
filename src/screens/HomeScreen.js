import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

// Add navigation prop here
const HomeScreen = ({ navigation }) => {
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

  // Add navigation handler function
  const handleCategoryPress = (categoryName) => {
    if (categoryName === 'Clothing') {
      navigation.navigate('Clothing');
    }
    // Add other category navigations here as needed
    // else if (categoryName === 'Handicraft') {
    //   navigation.navigate('Handicraft');
    // }
  };

  const categories = [
    { id: 1, name: 'Clothing', image: 'https://th.bing.com/th/id/R.5a4bb1331b786abb32a2176cb7e57220?rik=4rZradadhJbe2g&riu=http%3a%2f%2f4.bp.blogspot.com%2f-JY4qY_30Zk4%2fVFovf__IuKI%2fAAAAAAAACDE%2fjBnHbItS_w8%2fs1600%2fclothing%252Bbusiness.JPG&ehk=hcs2h4sMzF305x1gRK7a%2bHeUZ4IJZeHl3a2HyLIdRig%3d&risl=&pid=ImgRaw&r=0' },
    { id: 2, name: 'Handicraft', image: 'https://th.bing.com/th/id/OIP.RVQkSR5wJFKYZo1D8iDQ8QHaFb?w=268&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' },
    { id: 3, name: 'Spices', image: 'https://th.bing.com/th/id/OIP.6GfnkCCw6_6z849y06NNcAHaE7?w=231&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' },
    { id: 4, name: 'Handloom', image: 'https://th.bing.com/th/id/R.08d360747469691e6ab9c9ccb0c070f1?rik=B7jb1bRGKWN20A&pid=ImgRaw&r=0' }
  ];

  const featuredProducts = [
    { id: 1, name: 'Craft Items', price: 600, rating: 4.5, image: 'https://via.placeholder.com/150x150' },
    { id: 2, name: 'Reed Products', price: 500, rating: 4.5, image: 'https://via.placeholder.com/150x150' },
    { id: 3, name: 'Handmade Crafts', price: 750, rating: 4.5, image: 'https://via.placeholder.com/150x150' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="chevron-left" size={24} color="white" />
          <Text style={styles.headerTitle}>Market Place</Text>
          <View style={styles.headerRight}>
            <MaterialIcons name="shopping-cart" size={24} color="white" style={{ marginRight: 12 }} />
            <View style={styles.profileImage}>
              <Image source={{ uri: 'https://via.placeholder.com/40x40' }} style={styles.profileImg} />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput 
              placeholder="Search for product" 
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Categories - Updated with onPress handler */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.name)}
            >
              <View style={styles.categoryCircle}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bags Featured Section */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Bags</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy now</Text>
            </TouchableOpacity>
          </View>
          <Image source={{ uri: 'https://via.placeholder.com/120x80' }} style={styles.featuredImage} />
        </View>

        {/* Gallery Section */}
        <View style={styles.gallerySection}>
          <View style={styles.galleryItem}>
            <Image source={{ uri: 'https://via.placeholder.com/180x120' }} style={styles.galleryImage} />
          </View>
          <View style={styles.galleryItem}>
            <Image source={{ uri: 'https://via.placeholder.com/180x120' }} style={styles.galleryImage} />
          </View>
        </View>

        {/* Recommended Section */}
        <View style={styles.recommendedContainer}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>Recommended for you</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <TouchableOpacity 
                    onPress={() => toggleFavorite(product.id)}
                    style={styles.favoriteButton}
                  >
                    <MaterialIcons 
                      name={favorites.has(product.id) ? "favorite" : "favorite-border"} 
                      size={20} 
                      color={favorites.has(product.id) ? "#EF4444" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#FCD34D" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                  <Text style={styles.productPrice}>Rs.{product.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 48,
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
  profileImage: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryCircle: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  featuredSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  featuredImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  gallerySection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  galleryItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 120,
  },
  recommendedContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAllText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
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
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
  },
  favoritesContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;