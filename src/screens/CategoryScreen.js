import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext'; // ADD THIS IMPORT

const allProducts = {
  Clothing: [
    { id: 1, name: 'T-Shirt', price: 500, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jeans', price: 1200, image: 'https://via.placeholder.com/150' },
  ],
  Handicraft: [
    { id: 3, name: 'Handmade Basket', price: 600, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Clay Pot', price: 800, image: 'https://via.placeholder.com/150' },
  ],
  Spices: [
    { id: 5, name: 'Cinnamon', price: 300, image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Chili Powder', price: 250, image: 'https://via.placeholder.com/150' },
  ],
  Handloom: [
    { id: 7, name: 'Handloom Scarf', price: 1000, image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Handloom Tablecloth', price: 1500, image: 'https://via.placeholder.com/150' },
  ],
};

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params || {}; // Add safety check
  const products = allProducts[category] || [];
  
  // Add context safety check
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const { addToCart } = cartContext;

  // Add category safety check
  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No category selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rs.{item.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  card: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  image: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
  name: { fontWeight: '600', marginBottom: 4 },
  price: { color: '#8B5CF6', fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CategoryScreen;