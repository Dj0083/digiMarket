import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function ProductDetailScreen() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const reviews = [
    {
      name: "Amina Khan",
      rating: 5,
      comment: "I absolutely love this product! The quality is amazing and it arrived exactly as described. Great service, great price. It meets all our requirements perfectly and I couldn't be happier. Excellent quality and fast delivery! Highly recommend!",
      timeAgo: "5 hours ago"
    },
    {
      name: "Rajashweda Gill",
      rating: 5,
      comment: "Excellent product with great build quality. Highly recommended!",
      timeAgo: "2 days ago"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={{ color: i < rating ? '#FBBF24' : '#D1D5DB', fontSize: 16 }}>
        ★
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traditional Saree</Text>
        <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
          <Text style={[styles.headerIcon, { color: isFavorited ? '#FF6B9D' : '#FFFFFF' }]}>
            ♡
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          <View style={styles.productImagePlaceholder}>
            <View style={styles.imageIcon}>
              <View style={styles.imageIconInner} />
            </View>
          </View>
          <Text style={styles.productImageText}>Product Image</Text>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>Traditional Saree</Text>
          <Text style={styles.stockStatus}>In Stock</Text>
          <Text style={styles.price}>$2424.7</Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={decreaseQuantity}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              onPress={increaseQuantity}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Customer Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Customer Reviews</Text>
          
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>👤</Text>
                </View>
                <View style={styles.reviewContent}>
                  <View style={styles.reviewNameRating}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.starsContainer}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>
                    {review.comment}
                  </Text>
                  <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity>
            <Text style={styles.moreReviews}>+ More review</Text>
          </TouchableOpacity>
        </View>

        {/* You Might Also Like */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>You Might Also Like</Text>
          <View style={styles.suggestionsGrid}>
            <View style={styles.suggestionItem} />
            <View style={styles.suggestionItem} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#C084FC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
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
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconInner: {
    width: 16,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  productImageText: {
    color: '#6B7280',
    fontSize: 14,
  },
  productInfo: {
    marginBottom: 24,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stockStatus: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 12,
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  addToCartButton: {
    backgroundColor: '#C084FC',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  reviewsContainer: {
    marginBottom: 32,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#D1D5DB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewNameRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  moreReviews: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionItem: {
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    height: 120,
    width: '48%',
  },
});