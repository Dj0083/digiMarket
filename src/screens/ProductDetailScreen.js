import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Rating, Button, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { productsAPI, reviewsAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, isProductInCart, getProductQuantityInCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadProductDetails();
    loadProductReviews();
    loadRelatedProducts();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      const response = await productsAPI.getProductById(productId);
      if (response.success) {
        setProduct(response.data.product);
        navigation.setOptions({ title: response.data.product.name });
      }
    } catch (error) {
      console.error('Load product details error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load product details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProductReviews = async () => {
    try {
      const response = await reviewsAPI.getProductReviews(productId, { limit: 5 });
      if (response.success) {
        setReviews(response.data.reviews);
        setReviewStats(response.data.stats);
      }
    } catch (error) {
      console.error('Load reviews error:', error);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const response = await productsAPI.getRelatedProducts(productId, 5);
      if (response.success) {
        setRelatedProducts(response.data.products);
      }
    } catch (error) {
      console.error('Load related products error:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    setIsAddingToCart(true);
    const result = await addToCart(productId, quantity);
    setIsAddingToCart(false);

    if (result.success) {
      setQuantity(1); // Reset quantity
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/60' }}
        style={[
          styles.thumbnailImage,
          selectedImageIndex === index && styles.selectedThumbnail
        ]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>
          {item.first_name} {item.last_name?.charAt(0)}.
        </Text>
        {item.is_verified_purchase && (
          <Badge value="Verified" status="success" badgeStyle={styles.verifiedBadge} />
        )}
        <View style={styles.reviewRating}>
          <Rating
            readonly
            startingValue={item.rating}
            imageSize={12}
          />
        </View>
      </View>
      {item.title && <Text style={styles.reviewTitle}>{item.title}</Text>}
      {item.comment && <Text style={styles.reviewComment}>{item.comment}</Text>}
      <Text style={styles.reviewDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderRelatedProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedProductCard}
      onPress={() => navigation.push('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.primary_image || 'https://via.placeholder.com/150' }}
        style={styles.relatedProductImage}
        resizeMode="cover"
      />
      <Text style={styles.relatedProductName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.relatedProductPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.goBackButton}
        />
      </View>
    );
  }

  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Images */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.images?.[selectedImageIndex]?.image_url || 
                 'https://via.placeholder.com/400' 
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        )}
        
        {product.images && product.images.length > 1 && (
          <FlatList
            data={product.images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          />
        )}
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.vendorName}>by {product.vendor_name}</Text>
        
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Rating
            readonly
            startingValue={product.rating}
            imageSize={16}
          />
          <Text style={styles.ratingText}>
            {product.rating} ({product.total_reviews} reviews)
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${currentPrice}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>${product.price}</Text>
          )}
        </View>

        {/* Stock Status */}
        <View style={styles.stockContainer}>
          {product.stock_quantity > 0 ? (
            <Text style={styles.inStock}>
              ✓ In Stock ({product.stock_quantity} available)
            </Text>
          ) : (
            <Text style={styles.outOfStock}>✗ Out of Stock</Text>
          )}
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Quantity Selector */}
        {product.stock_quantity > 0 && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Icon name="remove" size={20} color={quantity <= 1 ? '#ccc' : '#333'} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
                disabled={quantity >= product.stock_quantity}
              >
                <Icon 
                  name="add" 
                  size={20} 
                  color={quantity >= product.stock_quantity ? '#ccc' : '#333'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Add to Cart Button */}
        <View style={styles.actionButtons}>
          <Button
            title={isAddingToCart ? 'Adding...' : 'Add to Cart'}
            onPress={handleAddToCart}
            buttonStyle={[
              styles.addToCartButton,
              product.stock_quantity === 0 && styles.disabledButton
            ]}
            disabled={product.stock_quantity === 0 || isAddingToCart}
            loading={isAddingToCart}
          />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => {
              // TODO: Implement wishlist functionality
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Wishlist feature will be available soon',
              });
            }}
          >
            <Icon name="favorite-border" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews Section */}
      {reviewStats && reviewStats.total_reviews > 0 && (
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Review', { 
                productId, 
                productName: product.name,
                type: 'view'
              })}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewStats}>
            <Text style={styles.averageRating}>{reviewStats.average_rating}</Text>
            <Rating
              readonly
              startingValue={parseFloat(reviewStats.average_rating)}
              imageSize={20}
            />
            <Text style={styles.totalReviews}>
              Based on {reviewStats.total_reviews} reviews
            </Text>
          </View>

          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={styles.writeReviewButton}
            onPress={() => navigation.navigate('Review', { 
              productId, 
              productName: product.name,
              type: 'write'
            })}
          >
            <Text style={styles.writeReviewText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Related Products</Text>
          <FlatList
            data={relatedProducts}
            renderItem={renderRelatedProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedProductsList}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#e53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  thumbnailContent: {
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#2196F3',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  vendorName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e53935',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    marginBottom: 20,
  },
  inStock: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
  outOfStock: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  quantityButton: {
    padding: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  favoriteButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 4,
  },
  reviewsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#2196F3',
    fontSize: 14,
  },
  reviewStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reviewItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  verifiedBadge: {
    backgroundColor: '#4caf50',
    marginRight: 10,
  },
  reviewRating: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  writeReviewButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  writeReviewText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  relatedSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  relatedProductsList: {
    paddingRight: 20,
  },
  relatedProductCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 150,
  },
  relatedProductImage: {
    width: 150,
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  relatedProductName: {
    fontSize: 14,
    color: '#333',
    padding: 10,
    paddingBottom: 5,
    minHeight: 35,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default ProductDetailScreen;