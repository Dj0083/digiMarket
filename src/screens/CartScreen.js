import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Image,
  Alert 
} from 'react-native';
import { CartContext } from '../context/CartContext';
import Toast from 'react-native-toast-message';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateCartItem, removeFromCart } = useContext(CartContext);
  const [sendAsGift, setSendAsGift] = useState(false);

  // Mock cart items for demo (replace with actual cart data)
  const mockCartItems = [
    {
      id: 1,
      name: 'Handloom Saree',
      category: 'Sarees',
      price: 24.99,
      quantity: 2,
      image: '🥻',
      delivery: 'Eligible for FREE Delivery',
      inStock: true
    },
    {
      id: 2,
      name: 'Ceramic Pot',
      category: 'Pottery',
      price: 18.50,
      quantity: 1,
      image: '🏺',
      delivery: 'Standard Delivery',
      inStock: true
    },
    {
      id: 3,
      name: 'Hand-Woven Basket',
      category: 'Reed Products',
      price: 45.00,
      quantity: 1,
      image: '🧺',
      delivery: 'Natural Rattan',
      inStock: false
    }
  ];

  const [items, setItems] = useState(mockCartItems);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            Toast.show({
              type: 'success',
              text1: 'Item Removed',
              text2: 'Item has been removed from your cart',
            });
          }
        }
      ]
    );
  };

  const saveForLater = (itemId) => {
    Toast.show({
      type: 'info',
      text1: 'Saved for Later',
      text2: 'Item moved to saved items',
    });
  };

  const proceedToCheckout = () => {
    if (items.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Cart Empty',
        text2: 'Add items to cart before checkout',
      });
      return;
    }
    
    navigation.navigate('CheckoutScreen', {
      items: items,
      subtotal: calculateSubtotal(),
      sendAsGift: sendAsGift
    });
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      {/* Product Image */}
      <View style={styles.productImageContainer}>
        <Text style={styles.productEmoji}>{item.image}</Text>
      </View>

      {/* Product Details */}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Rs. {item.price.toFixed(2)}</Text>
        <Text style={[
          styles.deliveryInfo,
          item.inStock ? styles.inStock : styles.outOfStock
        ]}>
          {item.inStock ? item.delivery : 'Out of Stock'}
        </Text>

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => saveForLater(item.id)}
          >
            <Text style={styles.saveText}>💾 Save for later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subtotal Section */}
        <View style={styles.subtotalSection}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalAmount}>Rs. {calculateSubtotal().toFixed(2)}</Text>
        </View>

        {/* Free Delivery Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeIcon}>✓</Text>
          <View style={styles.noticeTextContainer}>
            <Text style={styles.noticeText}>
              Part of your order qualifies for FREE delivery.
            </Text>
            <Text style={styles.noticeSubtext}>
              Choose this option at checkout.
            </Text>
          </View>
        </View>

        {/* Gift Option */}
        <TouchableOpacity 
          style={styles.giftOption}
          onPress={() => setSendAsGift(!sendAsGift)}
        >
          <View style={styles.giftCheckbox}>
            {sendAsGift && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.giftText}>Send as a gift. Include personalized message</Text>
        </TouchableOpacity>

        {/* Checkout Button */}
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={proceedToCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout ({items.length} items)
          </Text>
        </TouchableOpacity>

        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {items.map(renderCartItem)}
        </View>

        {/* Empty Cart Message */}
        {items.length === 0 && (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('CategoryScreen')}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3E8FF',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  subtotalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  subtotalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  noticeIcon: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    marginTop: 2,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  noticeSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  giftOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  giftCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
  },
  giftText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  checkoutButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cartItemsContainer: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 32,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },
  deliveryInfo: {
    fontSize: 12,
    marginBottom: 12,
  },
  inStock: {
    color: '#059669',
  },
  outOfStock: {
    color: '#DC2626',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 12,
    color: '#DC2626',
  },
  saveText: {
    fontSize: 12,
    color: '#2563EB',
  },
  emptyCartContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CartScreen;