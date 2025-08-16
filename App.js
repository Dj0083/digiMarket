import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-toast-message';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

// Navigation
import AppNavigator from './navigation/AppNavigator';

const queryClient = new QueryClient();

// Create a wrapper component to ensure proper context nesting
const ContextWrapper = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <ContextWrapper />
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default App;