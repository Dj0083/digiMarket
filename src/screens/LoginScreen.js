import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/api'; // adjust the path if needed

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const res = await authAPI.login(email, password);
      // Assuming your API response is { success: true, token: "..." }
      if (res.token) {
        await AsyncStorage.setItem('token', res.token);
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('Home'); // or wherever your app goes after login
      } else {
        Alert.alert('Error', 'Login failed. No token returned.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Login Failed', err.response?.data?.message || err.message);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DigiMarket</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
          <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#2196F3' },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  loginButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  registerButton: { alignItems: 'center' },
  registerButtonText: { color: '#2196F3', fontSize: 16 },
});

export default LoginScreen;
