import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Handloom');

  // Sample product categories with items
  const categories = [
    {
      name: 'Handloom',
      icon: '🧵',
      products: [
        'Cotton Sarees', 'Silk Dupatta', 'Handwoven Scarves', 'Traditional Shawls', 'Khadi Fabric'
      ]
    },
    {
      name: 'Handicrafts',
      icon: '🎨',
      products: [
        'Wooden Sculptures', 'Metal Crafts', 'Stone Carvings', 'Bamboo Items', 'Paper Crafts'
      ]
    },
    {
      name: 'Clothing',
      icon: '👕',
      products: [
        'T-Shirts', 'Jeans', 'Kurtas', 'Dresses', 'Jackets', 'Shirts', 'Pants'
      ]
    },
    {
      name: 'Pottery',
      icon: '🏺',
      products: [
        'Clay Pots', 'Ceramic Bowls', 'Decorative Vases', 'Terracotta Items', 'Glazed Pottery'
      ]
    },
    {
      name: 'Reed Products',
      icon: '🎋',
      products: [
        'Wicker Baskets', 'Reed Mats', 'Bamboo Furniture', 'Cane Chairs', 'Natural Screens'
      ]
    },
    {
      name: 'Bags',
      icon: '👜',
      products: [
        'Leather Bags', 'Canvas Totes', 'Backpacks', 'Handbags', 'Clutches', 'Travel Bags'
      ]
    }
  ];

  // Get all products for search
  const allProducts = categories.flatMap(category => 
    category.products.map(product => ({
      name: product,
      category: category.name,
      icon: category.icon
    }))
  );

  // Filter products based on search query
  const filteredProducts = searchQuery 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Get current category's products
  const currentCategoryProducts = categories.find(cat => cat.name === activeCategory)?.products || [];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setActiveCategory(item.name);
        setSearchQuery('');
      }}
      style={{
        width: 80,
        padding: 12,
        alignItems: 'center',
        backgroundColor: activeCategory === item.name ? '#ffffff' : '#f9fafb',
        borderRightWidth: activeCategory === item.name ? 3 : 0,
        borderRightColor: '#14b8a6',
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: activeCategory === item.name ? '#f0fdfa' : '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
      }}>
        <Text style={{ fontSize: 20 }}>{item.icon}</Text>
      </View>
      <Text style={{
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '500',
        color: activeCategory === item.name ? '#14b8a6' : '#6b7280'
      }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={{
      padding: 16,
      backgroundColor: '#ffffff',
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937', marginBottom: 4 }}>
            {typeof item === 'string' ? item : item.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {typeof item === 'string' ? 'Available in stock' : `in ${item.category}`}
          </Text>
        </View>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: '#f3f4f6',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: 18 }}>
            {typeof item === 'string' 
              ? categories.find(cat => cat.name === activeCategory)?.icon 
              : item.icon
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Status Bar */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f9fafb'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6b7280', marginRight: 8 }}>8:03 AM</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#9ca3af', marginRight: 2 }} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#9ca3af', marginRight: 2 }} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#9ca3af' }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>5G</Text>
        </View>
      </View>

      {/* Header */}
      <View style={{
       
      }}>
        
        
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12
        }}>
          <Text style={{ fontSize: 16, color: '#9ca3af', marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              fontSize: 16,
              color: '#1f2937'
            }}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar Categories */}
        <View style={{ width: 80, backgroundColor: '#f9fafb', borderRightWidth: 1, borderRightColor: '#e5e7eb' }}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}
            </Text>
          </View>
          
          {/* Search Results or Category Products */}
          {searchQuery ? (
            filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => `search-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
                <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 4 }}>
                  No products found for "{searchQuery}"
                </Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>
                  Try searching for different keywords
                </Text>
              </View>
            )
          ) : (
            <FlatList
              data={currentCategoryProducts}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => `category-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingVertical: 8
      }}>
        
      </View>
    </View>
  );
};

export default SearchScreen;