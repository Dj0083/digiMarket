import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TextInput,
  Alert 
} from 'react-native';
import Toast from 'react-native-toast-message';

const PaymentMethodScreen = ({ route, navigation }) => {
  const { items = [], total = 0, orderDetails = {} } = route.params || {};
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: '💵',
      available: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: '💳',
      available: true
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      description: 'Pay with mobile wallet',
      icon: '📱',
      available: false // Disabled for demo
    }
  ];

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Card Number',
        text2: 'Please enter a valid 16-digit card number',
      });
      return false;
    }
    
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Expiry Date',
        text2: 'Please enter a valid expiry date (MM/YY)',
      });
      return false;
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Invalid CVV',
        text2: 'Please enter a valid 3-digit CVV',
      });
      return false;
    }
    
    if (!cardDetails.cardholderName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Cardholder Name',
        text2: 'Please enter the cardholder name',
      });
      return false;
    }
    
    return true;
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Toast.show({
        type: 'error',
        text1: 'Select Payment Method',
        text2: 'Please choose a payment method to continue',
      });
      return;
    }

    if (selectedPaymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    const paymentData = {
      method: selectedPaymentMethod,
      items: items,
      total: total,
      orderDetails: orderDetails,
      ...(selectedPaymentMethod === 'card' && { cardDetails })
    };

    if (selectedPaymentMethod === 'cod') {
      // COD - Direct order confirmation
      Alert.alert(
        'Confirm Order',
        `Your order of Rs. ${total.toFixed(2)} will be placed.\n\nYou will pay cash on delivery.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Place Order',
            onPress: () => {
              Toast.show({
                type: 'success',
                text1: 'Order Placed!',
                text2: 'Your COD order has been confirmed',
              });
              
              setTimeout(() => {
                navigation.navigate('OrderConfirmation', {
                  orderId: `COD${Date.now()}`,
                  paymentMethod: 'Cash on Delivery',
                  ...paymentData
                });
              }, 1500);
            }
          }
        ]
      );
    } else if (selectedPaymentMethod === 'card') {
      // Card payment - Simulate processing
      Alert.alert(
        'Process Payment',
        `Charge Rs. ${total.toFixed(2)} to your card ending in ${cardDetails.cardNumber.slice(-4)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay Now',
            onPress: () => {
              // Simulate payment processing
              Toast.show({
                type: 'info',
                text1: 'Processing Payment...',
                text2: 'Please wait while we process your payment',
              });
              
              setTimeout(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Payment Successful!',
                  text2: 'Your order has been confirmed',
                });
                
                setTimeout(() => {
                  navigation.navigate('OrderConfirmation', {
                    orderId: `PAY${Date.now()}`,
                    paymentMethod: 'Card Payment',
                    ...paymentData
                  });
                }, 1500);
              }, 2000);
            }
          }
        ]
      );
    }
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
        !method.available && styles.disabledPaymentMethod
      ]}
      onPress={() => method.available && setSelectedPaymentMethod(method.id)}
      disabled={!method.available}
    >
      <View style={styles.paymentMethodHeader}>
        <View style={styles.paymentMethodIcon}>
          <Text style={styles.paymentIcon}>{method.icon}</Text>
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={[
            styles.paymentMethodName,
            !method.available && styles.disabledText
          ]}>
            {method.name}
          </Text>
          <Text style={[
            styles.paymentMethodDescription,
            !method.available && styles.disabledText
          ]}>
            {method.description}
          </Text>
        </View>
        <View style={styles.radioButton}>
          {selectedPaymentMethod === method.id && (
            <View style={styles.radioButtonSelected} />
          )}
        </View>
      </View>
      
      {!method.available && (
        <Text style={styles.unavailableText}>Coming Soon</Text>
      )}
    </TouchableOpacity>
  );

  const renderCardForm = () => (
    <View style={styles.cardForm}>
      <Text style={styles.cardFormTitle}>Card Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.textInput}
          placeholder="1234 5678 9012 3456"
          value={cardDetails.cardNumber}
          onChangeText={(text) => setCardDetails({
            ...cardDetails,
            cardNumber: formatCardNumber(text)
          })}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM/YY"
            value={cardDetails.expiryDate}
            onChangeText={(text) => setCardDetails({
              ...cardDetails,
              expiryDate: formatExpiryDate(text)
            })}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123"
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({
              ...cardDetails,
              cvv: text.replace(/\D/g, '').substring(0, 3)
            })}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="John Doe"
          value={cardDetails.cardholderName}
          onChangeText={(text) => setCardDetails({
            ...cardDetails,
            cardholderName: text
          })}
          autoCapitalize="words"
        />
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
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Order Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>Rs. {total.toFixed(2)}</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Card Form */}
        {selectedPaymentMethod === 'card' && renderCardForm()}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>

      </ScrollView>

      {/* Pay Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            !selectedPaymentMethod && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethod}
        >
          <Text style={[
            styles.payButtonText,
            !selectedPaymentMethod && styles.payButtonTextDisabled
          ]}>
            {selectedPaymentMethod === 'cod' ? 'Place Order' : 
             selectedPaymentMethod === 'card' ? `Pay Rs. ${total.toFixed(2)}` : 
             'Select Payment Method'}
          </Text>
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
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  totalLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
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
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedPaymentMethod: {
    borderColor: '#8B5CF6',
    backgroundColor: '#FAF5FF',
  },
  disabledPaymentMethod: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  unavailableText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  cardForm: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardFormTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#059669',
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  payButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default PaymentMethodScreen;