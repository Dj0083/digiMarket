import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TokenDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);

  const checkToken = async () => {
    try {
      // Get stored data
      const token = await AsyncStorage.getItem('auth_token');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const user = await AsyncStorage.getItem('user');
      
      console.log('=== STORAGE DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length || 0);
      console.log('Token starts with:', token?.substring(0, 20));
      console.log('Refresh token exists:', !!refreshToken);
      console.log('User exists:', !!user);
      console.log('====================');

      setDebugInfo({
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token?.substring(0, 50) + '...',
        hasRefreshToken: !!refreshToken,
        hasUser: !!user,
        fullToken: token // Remove this in production
      });

    } catch (error) {
      console.log('Debug error:', error);
    }
  };

  const testAPI = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        Alert.alert('No Token', 'Please login first');
        return;
      }

      console.log('Testing API with token...');
      
      // Test the /auth/me endpoint first
      const response = await axios.get('http://192.168.43.219:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Test Success:', response.data);
      Alert.alert('Success', 'Token is valid!');

    } catch (error) {
      console.log('API Test Error:', error.response?.data || error.message);
      Alert.alert('API Error', JSON.stringify(error.response?.data || error.message));
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
    console.log('Storage cleared');
    Alert.alert('Cleared', 'All storage cleared. Please login again.');
    setDebugInfo(null);
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Token Debugger</Text>
      
      <TouchableOpacity 
        onPress={checkToken}
        style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Check Token</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={testAPI}
        style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Test API</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={clearStorage}
        style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear Storage</Text>
      </TouchableOpacity>

      {debugInfo && (
        <View style={{ marginTop: 10, padding: 10, backgroundColor: '#e9ecef', borderRadius: 5 }}>
          <Text>Has Token: {debugInfo.hasToken ? '✅' : '❌'}</Text>
          <Text>Token Length: {debugInfo.tokenLength}</Text>
          <Text>Has Refresh Token: {debugInfo.hasRefreshToken ? '✅' : '❌'}</Text>
          <Text>Has User: {debugInfo.hasUser ? '✅' : '❌'}</Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>Token Preview: {debugInfo.tokenPreview}</Text>
        </View>
      )}
    </View>
  );
};

export default TokenDebugger;