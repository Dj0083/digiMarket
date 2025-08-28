import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Alert 
} from 'react-native';
import Toast from 'react-native-toast-message';

const CheckoutScreen = ({ route, navigation }) => {
  const { items = [], subtotal = 0, sendAsGift = false } = route.params || {};
  
  // Delivery information
  const deliveryInfo = {
    shippingAddress: {
      line1: "123 Kelaniya Path",
      line2: "Pelawatta",
      city: "Battaramulla 10120"
    },
    estimatedDelivery: {
      date: "Tuesday, October 3",
      time: "8:00 AM - 1:00 PM"
    }
  };

  // Convert cart items or use mock data
  const orderItems = items.length > 0 ? items : [
    {
      id: 1,
      name: "Artisan Scented Candles",
      description: "Lavender & Eucalyptus",
      category: "Handicrafts",
      price: 24.00,
      quantity: 1,
      image: "🕯️"
    },
    {
      id: 2,
      name: "Handwoven Cotton Bag",
      category: "Bags", 
      description: "Eco Bags",
      price: 36.98,
      quantity: 1,
      image: "👜"
    },
    {
      id: 3,
      name: "Organic Honey Jar",
      category: "Pottery",
      description: "Wildflower",
      price: 12.50,
      quantity: 2,
      image: "🍯"
    }
  ];
  
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + tax;
  };

  const handleConfirmAndPay = () => {
    // Navigate to payment method selection
    navigation.navigate('PaymentMethodScreen', {
      items: orderItems,
      total: calculateTotal(),
      orderDetails: {
        subtotal: calculateSubtotal(),
        deliveryInfo: deliveryInfo,
        sendAsGift: sendAsGift
      }
    });
  };

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      
      <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
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
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Order Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          {orderItems.map(renderOrderItem)}
        </View>

        {/* Delivery Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          {/* Shipping Address */}
          <View style={styles.deliveryItem}>
            <View style={styles.deliveryIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryLabel}>Shipping Address</Text>
              <Text style={styles.deliveryText}>{deliveryInfo.shippingAddress.line1}</Text>
              <Text style={styles.deliveryText}>{deliveryInfo.shippingAddress.line2}</Text>
              <Text style={styles.deliveryText}>{deliveryInfo.shippingAddress.city}</Text>
            </View>
          </View>

          {/* Estimated Delivery */}
          <View style={styles.deliveryItem}>
            <View style={styles.deliveryIcon}>
              <Text style={styles.iconText}>🚚</Text>
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
              <Text style={styles.deliveryText}>{deliveryInfo.estimatedDelivery.date}</Text>
              <Text style={styles.deliveryText}>{deliveryInfo.estimatedDelivery.time}</Text>
            </View>
          </View>
        </View>

        {/* Gift Message */}
        {sendAsGift && (
          <View style={styles.section}>
            <View style={styles.giftNotice}>
              <Text style={styles.giftIcon}>🎁</Text>
              <Text style={styles.giftText}>This order will be sent as a gift</Text>
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>Rs. {calculateSubtotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm & Pay Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmAndPay}
        >
          <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  deliveryItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deliveryIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  giftNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  giftIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  giftText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#374151',
  },
  priceValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;