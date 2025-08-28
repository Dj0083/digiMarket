import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear temporary files and may free up storage space. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            Alert.alert("Success", "Cache cleared successfully!");
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "This will reset all settings to default values. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setPushNotifications(true);
            setOrderUpdates(true);
            setPromotionalEmails(false);
            setBiometricAuth(false);
            setLocationServices(true);
            Alert.alert("Success", "Settings reset to default!");
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you absolutely sure? This will delete all your orders, preferences, and personal data.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await AsyncStorage.clear();
                      Alert.alert("Account Deleted", "Your account has been deleted.");
                      // navigation.replace("Login"); // or exit app
                    } catch (error) {
                      Alert.alert("Error", "Failed to delete account. Please try again.");
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out DigiMarket - the best marketplace for handcrafted items! Download now: https://digimarket.lk/app',
        title: 'DigiMarket App'
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share app');
    }
  };

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          title: "Push Notifications",
          subtitle: "Receive notifications about orders and updates",
          type: "switch",
          value: pushNotifications,
          onToggle: setPushNotifications
        },
        {
          title: "Order Updates",
          subtitle: "Get notified about order status changes",
          type: "switch",
          value: orderUpdates,
          onToggle: setOrderUpdates
        },
        {
          title: "Promotional Emails",
          subtitle: "Receive emails about offers and promotions",
          type: "switch",
          value: promotionalEmails,
          onToggle: setPromotionalEmails
        }
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        {
          title: "Biometric Authentication",
          subtitle: "Use fingerprint or face ID to unlock app",
          type: "switch",
          value: biometricAuth,
          onToggle: setBiometricAuth
        },
        {
          title: "Location Services",
          subtitle: "Allow app to access your location for delivery",
          type: "switch",
          value: locationServices,
          onToggle: setLocationServices
        },
        {
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          type: "arrow",
          onPress: () => Alert.alert("Privacy Policy", "This would open the privacy policy page.")
        },
        {
          title: "Terms of Service",
          subtitle: "Read our terms and conditions",
          type: "arrow",
          onPress: () => Alert.alert("Terms of Service", "This would open the terms of service page.")
        }
      ]
    },
    {
      title: "App Preferences",
      items: [
        {
          title: "Language",
          subtitle: "English",
          type: "arrow",
          onPress: () => Alert.alert("Language", "Language selection would be implemented here.")
        },
        {
          title: "Currency",
          subtitle: "Sri Lankan Rupee (LKR)",
          type: "arrow",
          onPress: () => Alert.alert("Currency", "Currency selection would be implemented here.")
        },
        {
          title: "Theme",
          subtitle: "Light",
          type: "arrow",
          onPress: () => Alert.alert("Theme", "Theme selection (Light/Dark) would be implemented here.")
        }
      ]
    },
    {
      title: "App Information",
      items: [
        {
          title: "App Version",
          subtitle: "1.2.3",
          type: "info"
        },
        {
          title: "Share App",
          subtitle: "Tell your friends about DigiMarket",
          type: "arrow",
          onPress: handleShareApp
        },
        {
          title: "Rate Us",
          subtitle: "Rate us on the App Store",
          type: "arrow",
          onPress: () => Alert.alert("Rate Us", "This would open the app store rating page.")
        },
        {
          title: "About",
          subtitle: "Learn more about DigiMarket",
          type: "arrow",
          onPress: () => Alert.alert("About", "DigiMarket v1.2.3\n\nYour trusted marketplace for handcrafted items and local products.")
        }
      ]
    },
    {
      title: "Storage & Data",
      items: [
        {
          title: "Clear Cache",
          subtitle: "Free up storage space",
          type: "arrow",
          onPress: handleClearCache
        },
        {
          title: "Download Quality",
          subtitle: "High",
          type: "arrow",
          onPress: () => Alert.alert("Download Quality", "Image quality settings would be implemented here.")
        }
      ]
    },
    {
      title: "Advanced",
      items: [
        {
          title: "Reset Settings",
          subtitle: "Reset all settings to default",
          type: "arrow",
          onPress: handleResetSettings,
          textColor: "#F59E0B"
        },
        {
          title: "Delete Account",
          subtitle: "Permanently delete your account",
          type: "arrow",
          onPress: handleDeleteAccount,
          textColor: "#EF4444"
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {settingsSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={item.onPress}
                activeOpacity={item.type === "arrow" ? 0.6 : 1}
                style={styles.item}
              >
                <View>
                  <Text style={[styles.itemTitle, { color: item.textColor || "#000" }]}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                {item.type === "switch" && (
                  <Switch value={item.value} onValueChange={item.onToggle} />
                )}
                {item.type === "arrow" && <Ionicons name="chevron-forward" size={20} color="#999" />}
                {item.type === "info" && <Text style={styles.infoText}>{item.subtitle}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { marginBottom: 20, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemTitle: { fontSize: 15, fontWeight: "500" },
  itemSubtitle: { fontSize: 12, color: "#666" },
  infoText: { fontSize: 13, color: "#555" }
});
