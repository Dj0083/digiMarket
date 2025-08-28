import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import Toast from 'react-native-toast-message';

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  
  const [expandedSection, setExpandedSection] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#F59E0B';
      case 'shipped': return '#3B82F6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTrackOrder = () => {
    if (order.trackingNumber) {
      Alert.alert(
        'Track Your Order',
        `Tracking Number: ${order.trackingNumber}\n\nWould you like to track this order?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Track Now',
            onPress: () => {
              // Simulate opening tracking page
              Toast.show({
                type: 'info',
                text1: 'Opening Tracking',
                text2: `Tracking order ${order.trackingNumber}`,
              });
            }
          }
        ]
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'No Tracking Available',
        text2: 'Tracking information is not available for this order',
      });
    }
  };

  const handleReorder = () => {
    Alert.alert(
      'Reorder Items',
      'Add all items from this order to your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Items Added',
              text2: 'All items have been added to your cart',
            });
            navigation.navigate('Tabs', { screen: 'Cart' });
          }
        }
      ]
    );
  };

  const handleCancelOrder = () => {
    if (order.status === 'processing') {
      Alert.alert(
        'Cancel Order',
        'Are you sure you want to cancel this order? This action cannot be undone.',
        [
          { text: 'Keep Order', style: 'cancel' },
          {
            text: 'Cancel Order',
            style: 'destructive',
            onPress: () => {
              Toast.show({
                type: 'success',
                text1: 'Order Cancelled',
                text2: 'Your order has been cancelled successfully',
              });
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Support',
          onPress: () => Linking.openURL('tel:+94112345678')
        },
        {
          text: 'Send Email',
          onPress: () => Linking.openURL('mailto:support@digimarket.lk')
        }
      ]
    );
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Mock tracking timeline
  const trackingTimeline = [
    { 
      date: '2024-10-25 09:30 AM', 
      status: 'Order Confirmed', 
      description: 'Your order has been confirmed and is being processed.',
      completed: true 
    },
    { 
      date: '2024-10-25 02:15 PM', 
      status: 'Payment Verified', 
      description: 'Payment has been successfully processed.',
      completed: true 
    },
    { 
      date: '2024-10-26 10:45 AM', 
      status: 'Order Packed', 
      description: 'Your items have been carefully packed.',
      completed: true 
    },
    { 
      date: '2024-10-26 04:20 PM', 
      status: 'Shipped', 
      description: 'Order has been dispatched from our warehouse.',
      completed: order.status !== 'processing' 
    },
    { 
      date: '2024-10-27 11:00 AM', 
      status: 'Out for Delivery', 
      description: 'Order is out for delivery to your address.',
      completed: order.status === 'delivered' 
    },
    { 
      date: '2024-10-27 03:30 PM', 
      status: 'Delivered', 
      description: 'Order has been successfully delivered.',
      completed: order.status === 'delivered' 
    }
  ];

  const renderOrderItem = (item, index) => (
    <View key={index} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>Rs. {(Math.random() * 2000 + 300).toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity style={styles.buyAgainButton}>
        <Text style={styles.buyAgainText}>Buy Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrackingStep = (step, index) => (
    <View key={index} style={styles.trackingStep}>
      <View style={styles.trackingIndicator}>
        <View style={[
          styles.trackingDot,
          step.completed ? styles.completedDot : styles.pendingDot
        ]}>
          {step.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        {index < trackingTimeline.length - 1 && (
          <View style={[
            styles.trackingLine,
            step.completed ? styles.completedLine : styles.pendingLine
          ]} />
        )}
      </View>
      
      <View style={styles.trackingContent}>
        <Text style={[
          styles.trackingStatus,
          step.completed ? styles.completedStatus : styles.pendingStatus
        ]}>
          {step.status}
        </Text>
        <Text style={styles.trackingDate}>{step.date}</Text>
        <Text style={styles.trackingDescription}>{step.description}</Text>
      </View>
    </View>
  );

  const renderExpandableSection = (title, content, sectionKey) => (
    <View style={styles.expandableSection}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.expandIcon}>
          {expandedSection === sectionKey ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {expandedSection === sectionKey && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={handleContactSupport}
        >
          <Text style={styles.supportIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
            </View>
            
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(order.status)}20` }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(order.status) }
              ]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{order.itemCount} items</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>Rs. {order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment:</Text>
              <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>Order Items</Text>
          {order.items.map(renderOrderItem)}
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>Delivery Information</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>📍</Text>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryLabel}>Delivery Address</Text>
                <Text style={styles.deliveryValue}>{order.deliveryAddress}</Text>
              </View>
            </View>
            
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🚚</Text>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                <Text style={styles.deliveryValue}>{order.estimatedDelivery}</Text>
              </View>
            </View>
            
            {order.trackingNumber && (
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryIcon}>📦</Text>
                <View style={styles.deliveryDetails}>
                  <Text style={styles.deliveryLabel}>Tracking Number</Text>
                  <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Order Tracking */}
        {order.status !== 'cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionMainTitle}>Order Tracking</Text>
            <View style={styles.trackingContainer}>
              {trackingTimeline.map(renderTrackingStep)}
            </View>
          </View>
        )}

        {/* Expandable Sections */}
        {renderExpandableSection(
          'Payment Details',
          (
            <View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Subtotal:</Text>
                <Text style={styles.paymentValue}>Rs. {(order.total * 0.9).toFixed(2)}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Delivery Fee:</Text>
                <Text style={styles.paymentValue}>Rs. {(order.total * 0.05).toFixed(2)}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Tax:</Text>
                <Text style={styles.paymentValue}>Rs. {(order.total * 0.05).toFixed(2)}</Text>
              </View>
              <View style={[styles.paymentRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>Rs. {order.total.toFixed(2)}</Text>
              </View>
            </View>
          ),
          'payment'
        )}

        {renderExpandableSection(
          'Return & Exchange Policy',
          (
            <View>
              <Text style={styles.policyText}>
                • Items can be returned within 7 days of delivery
              </Text>
              <Text style={styles.policyText}>
                • Products must be in original condition with tags
              </Text>
              <Text style={styles.policyText}>
                • Return shipping fees may apply
              </Text>
              <Text style={styles.policyText}>
                • Refund will be processed within 5-7 business days
              </Text>
            </View>
          ),
          'policy'
        )}

      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {order.status === 'shipped' && (
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}
        
        {order.status === 'delivered' && (
          <TouchableOpacity 
            style={styles.reorderButton}
            onPress={handleReorder}
          >
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
        
        {order.status === 'processing' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    color: '#111827',
  },
  supportButton: {
    padding: 8,
  },
  supportIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  section: {
    marginBottom: 20,
  },
  sectionMainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F3F4F6',
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
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563EB',
  },
  buyAgainButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  buyAgainText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  trackingNumber: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  trackingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trackingIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  trackingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  pendingDot: {
    backgroundColor: '#E5E7EB',
  },
  checkmark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  trackingLine: {
    width: 2,
    height: 30,
    marginTop: 4,
  },
  completedLine: {
    backgroundColor: '#10B981',
  },
  pendingLine: {
    backgroundColor: '#E5E7EB',
  },
  trackingContent: {
    flex: 1,
  },
  trackingStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  completedStatus: {
    color: '#111827',
  },
  pendingStatus: {
    color: '#9CA3AF',
  },
  trackingDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  trackingDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  expandableSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  expandIcon: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  policyText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderDetailScreen;