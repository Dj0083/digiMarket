import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import Toast from 'react-native-toast-message';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, getProductQuantityInCart } = useContext(CartContext);

  // Get current quantity in cart, fallback to 1
  const initialQuantity = getProductQuantityInCart(product.id) || 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isFavorited, setIsFavorited] = useState(false);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.name} x${quantity} added successfully!`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.message || 'Failed to add item',
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <MaterialIcons
        key={i}
        name="star"
        size={16}
        color={i < rating ? '#FBBF24' : '#D1D5DB'}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
          <MaterialIcons
            name={isFavorited ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorited ? '#FF6B9D' : 'white'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.stockStatus}>
            {product.stock ? 'In Stock' : 'Out of Stock'}
          </Text>
          <Text style={styles.price}>Rs.{product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.starsContainer}>{renderStars(product.rating || 0)}</View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#C084FC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '500' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  productImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: { width: 200, height: 200, resizeMode: 'contain' },
  productInfo: { marginBottom: 24 },
  productTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stockStatus: { color: '#059669', fontSize: 14, fontWeight: '500', marginBottom: 12 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#2563EB', marginBottom: 8 },
  description: { color: '#374151', fontSize: 14, lineHeight: 20 },
  starsContainer: { flexDirection: 'row', marginTop: 8 },
  quantityContainer: { marginBottom: 24 },
  quantityLabel: { color: '#374151', fontWeight: '500', marginBottom: 12, fontSize: 16 },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: { color: '#4B5563', fontSize: 16, fontWeight: 'bold' },
  quantityText: { marginHorizontal: 16, fontSize: 18, fontWeight: '500', color: '#111827' },
  addToCartButton: { backgroundColor: '#C084FC', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  addToCartText: { color: '#FFFFFF', fontSize: 18, fontWeight: '500' },
});
