import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Toast from 'react-native-toast-message';

const CartScreen = ({ navigation }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const {
    cartItems,
    cartSummary,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyPromotion,
    loadCart,
  } = useContext(CartContext);

  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [isApplyingPromotion, setIsApplyingPromotion] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartId, newQuantity);
  };

  const handleRemoveItem = (cartId, productName) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(cartId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearCart,
        },
      ]
    );
  };

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a promotion code',
      });
      return;
    }

    setIsApplyingPromotion(true);
    const result = await applyPromotion(promotionCode);
    setIsApplyingPromotion(false);

    if (result.success) {
      setAppliedPromotion(result.data);
      setPromotionCode('');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Cart Empty',
        text2: 'Please add items to cart before checkout',
      });
      return;
    }

    navigation.navigate('Checkout', { appliedPromotion });
  };

  const calculateItemPrice = (item) => {
    return (item.discount_price || item.price) * item.quantity;
  };

  const calculateTotal = () => {
    let total = parseFloat(cartSummary.subtotal);
    if (appliedPromotion) {
      total -= appliedPromotion.discount_amount;
    }
    return Math.max(0, total).toFixed(2);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.primary_image || 'https://via.placeholder.com/80' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      
      <View style={styles.itemDetails}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { productId: item.product_id })}
        >
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.vendorName}>{item.vendor_name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>
            ${item.discount_price || item.price}
          </Text>
          {item.discount_price && item.discount_price < item.price && (
            <Text style={styles.originalPrice}>${item.price}</Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Icon 
              name="remove" 
              size={20} 
              color={item.quantity <= 1 ? '#ccc' : '#333'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
            disabled={item.quantity >= item.stock_quantity}
          >
            <Icon 
              name="add" 
              size={20} 
              color={item.quantity >= item.stock_quantity ? '#ccc' : '#333'} 
            />
          </TouchableOpacity>
        </View>

        {item.stock_quantity === 0 && (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>

      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${calculateItemPrice(item).toFixed(2)}
        </Text>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.cart_id, item.name)}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Please Login</Text>
        <Text style={styles.emptyMessage}>Login to view your cart items</Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          buttonStyle={styles.loginButton}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyMessage}>Start shopping to add items to your cart</Text>
        <Button
          title="Start Shopping"
          onPress={() => navigation.navigate('Home')}
          buttonStyle={styles.shopButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.cart_id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.cartList}
      />

      {/* Promotion Code */}
      <View style={styles.promotionContainer}>
        <Text style={styles.promotionTitle}>Promotion Code</Text>
        <View style={styles.promotionInput}>
          <Input
            placeholder="Enter promotion code"
            value={promotionCode}
            onChangeText={setPromotionCode}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          <Button
            title="Apply"
            onPress={handleApplyPromotion}
            loading={isApplyingPromotion}
            disabled={!promotionCode.trim()}
            buttonStyle={styles.applyButton}
          />
        </View>
        
        {appliedPromotion && (
          <View style={styles.appliedPromotion}>
            <Icon name="check-circle" size={16} color="#4caf50" />
            <Text style={styles.promotionSuccess}>
              Promotion applied! You saved ${appliedPromotion.discount_amount}
            </Text>
          </View>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal ({cartSummary.item_count} items)
          </Text>
          <Text style={styles.summaryValue}>${cartSummary.subtotal}</Text>
        </View>

        {appliedPromotion && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Promotion Discount</Text>
            <Text style={styles.discountValue}>
              -${appliedPromotion.discount_amount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {parseFloat(cartSummary.subtotal) >= 100 ? 'FREE' : '$10.00'}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(parseFloat(calculateTotal()) + 
               (parseFloat(cartSummary.subtotal) >= 100 ? 0 : 10)).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={`Checkout (${cartSummary.item_count} items)`}
          onPress={handleCheckout}
          buttonStyle={styles.checkoutButton}
          titleStyle={styles.checkoutButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  shopButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    paddingLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
  },
  outOfStock: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
    marginTop: 5,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  removeButton: {
    padding: 8,
  },
  promotionContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  promotionInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
  },
  appliedPromotion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 4,
  },
  promotionSuccess: {
    fontSize: 14,
    color: '#4caf50',
    marginLeft: 5,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkoutContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;