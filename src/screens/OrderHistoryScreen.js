import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl 
} from 'react-native';
import Toast from 'react-native-toast-message';

const OrderHistoryScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock order history data
  const mockOrders = [
    {
      id: 'ORD1729845632',
      date: '2024-10-25',
      status: 'delivered',
      total: 94.98,
      paymentMethod: 'Card Payment',
      itemCount: 3,
      items: [
        { name: 'Handloom Saree', quantity: 1, image: '🥻' },
        { name: 'Ceramic Pot', quantity: 2, image: '🏺' },
        { name: 'Woven Basket', quantity: 1, image: '🧺' }
      ],
      deliveryAddress: 'Pelawatta, Battaramulla',
      estimatedDelivery: 'Oct 27, 2024',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'COD1729741234',
      date: '2024-10-22',
      status: 'shipped',
      total: 156.75,
      paymentMethod: 'Cash on Delivery',
      itemCount: 2,
      items: [
        { name: 'Artisan Candles', quantity: 3, image: '🕯️' },
        { name: 'Cotton Fabric', quantity: 2, image: '🧶' }
      ],
      deliveryAddress: 'Kelaniya Path, Colombo',
      estimatedDelivery: 'Oct 28, 2024',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD1729632145',
      date: '2024-10-18',
      status: 'processing',
      total: 67.50,
      paymentMethod: 'Card Payment',
      itemCount: 4,
      items: [
        { name: 'Reed Mat', quantity: 1, image: '🪴' },
        { name: 'Wooden Craft', quantity: 1, image: '🪵' },
        { name: 'Stone Sculpture', quantity: 1, image: '🗿' },
        { name: 'Paper Craft', quantity: 1, image: '📄' }
      ],
      deliveryAddress: 'Gampaha Road, Kiribathgoda',
      estimatedDelivery: 'Oct 30, 2024',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'COD1729512345',
      date: '2024-10-15',
      status: 'cancelled',
      total: 89.25,
      paymentMethod: 'Cash on Delivery',
      itemCount: 2,
      items: [
        { name: 'Traditional Kurta', quantity: 1, image: '👘' },
        { name: 'Leather Bag', quantity: 1, image: '👜' }
      ],
      deliveryAddress: 'Maharagama, Colombo',
      estimatedDelivery: 'Cancelled',
      trackingNumber: null
    },
    {
      id: 'ORD1729398765',
      date: '2024-10-12',
      status: 'delivered',
      total: 124.99,
      paymentMethod: 'Card Payment',
      itemCount: 1,
      items: [
        { name: 'Handwoven Shawl', quantity: 1, image: '🧣' }
      ],
      deliveryAddress: 'Nugegoda, Sri Lanka',
      estimatedDelivery: 'Delivered Oct 14',
      trackingNumber: 'TRK789123456'
    }
  ];

  const [orders] = useState(mockOrders);

  const filterOptions = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'processing', name: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', name: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

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
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Orders Updated',
        text2: 'Your order history has been refreshed',
      });
    }, 1500);
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetailScreen', { order });
  };

  const handleTrackOrder = (order) => {
    if (order.trackingNumber) {
      Toast.show({
        type: 'info',
        text1: 'Tracking Order',
        text2: `Tracking: ${order.trackingNumber}`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'No Tracking Available',
        text2: 'Tracking not available for this order',
      });
    }
  };

  const handleReorder = (order) => {
    Toast.show({
      type: 'success',
      text1: 'Items Added to Cart',
      text2: 'Previous order items added to your cart',
    });
    // Navigate back to cart or categories
    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const renderFilterTab = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterTab,
        selectedFilter === filter.id && styles.activeFilterTab
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text style={[
        styles.filterTabText,
        selectedFilter === filter.id && styles.activeFilterTabText
      ]}>
        {filter.name}
      </Text>
      {filter.count > 0 && (
        <View style={[
          styles.filterBadge,
          selectedFilter === filter.id && styles.activeFilterBadge
        ]}>
          <Text style={[
            styles.filterBadgeText,
            selectedFilter === filter.id && styles.activeFilterBadgeText
          ]}>
            {filter.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOrderItem = (order) => (
    <TouchableOpacity 
      key={order.id} 
      style={styles.orderCard}
      onPress={() => handleOrderPress(order)}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
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

      {/* Order Items Preview */}
      <View style={styles.itemsPreview}>
        <View style={styles.itemImages}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.itemImageContainer}>
              <Text style={styles.itemEmoji}>{item.image}</Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <View style={styles.moreItemsContainer}>
              <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>{order.itemCount} items</Text>
          <Text style={styles.orderTotal}>Rs. {order.total.toFixed(2)}</Text>
          <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>
        </View>
      </View>

      {/* Delivery Info */}
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryAddress}>📍 {order.deliveryAddress}</Text>
        <Text style={styles.deliveryDate}>
          {order.status === 'delivered' ? '✅ ' : '🚚 '}
          {order.estimatedDelivery}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {order.status === 'shipped' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleTrackOrder(order)}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}
        
        {order.status === 'delivered' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReorder(order)}
          >
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => handleOrderPress(order)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {filterOptions.map(renderFilterTab)}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrderItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? 'You haven\'t placed any orders yet' 
                : `No ${selectedFilter} orders found`}
            </Text>
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('CategoryScreen')}
            >
              <Text style={styles.shopNowText}>Start Shopping</Text>
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
  placeholder: {
    width: 36,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  activeFilterTab: {
    backgroundColor: '#8B5CF6',
  },
  filterTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: '#FFFFFF',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterBadgeText: {
    color: '#8B5CF6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImages: {
    flexDirection: 'row',
    marginRight: 12,
  },
  itemImageContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  itemEmoji: {
    fontSize: 14,
  },
  moreItemsContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#E5E7EB',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreItemsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  orderSummary: {
    flex: 1,
  },
  itemCount: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  deliveryInfo: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  trackButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  reorderButtonText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen;