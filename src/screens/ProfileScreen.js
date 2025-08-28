import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // clear token
      Alert.alert(
        "Logout",
        "You have been logged out.",
        [
          {
            text: "OK",
            onPress: () => BackHandler.exitApp(), // exit the app
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong while logging out.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header / User Info */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/profile.png")}
          style={{ width: 75, height: 75, borderRadius: 37.5 }}
        />
        <View>
          <Text style={styles.username}>Hi, DJ</Text>
          <Text style={styles.subtext}>Member since 2025</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={{ color: "#007bff", fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Section: Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="person-outline" size={22} color="#333" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Full Name</Text>
            <Text style={styles.menuSubtext}>Dhanuka Jayasanka</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="mail-outline" size={22} color="#333" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Email Address</Text>
            <Text style={styles.menuSubtext}>dj@example.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="call-outline" size={22} color="#333" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Phone Number</Text>
            <Text style={styles.menuSubtext}>+94 77 123 4567</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="location-outline" size={22} color="#333" />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Address</Text>
            <Text style={styles.menuSubtext}>Pelawatta, Battaramulla, Sri Lanka</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Section: Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity 
  style={styles.menuItem} 
  onPress={() => navigation.navigate("HelpCenterScreen")}
>
  <Ionicons name="help-circle-outline" size={22} color="#333" />
  <Text style={styles.menuText}>Help Center</Text>
  <Ionicons name="chevron-forward" size={20} color="#ccc" />
</TouchableOpacity>

<TouchableOpacity 
  style={styles.menuItem} 
  onPress={() => navigation.navigate("ChatWithUsScreen")}
>
  <Ionicons name="chatbubble-outline" size={22} color="#333" />
  <Text style={styles.menuText}>Chat with Us</Text>
  <Ionicons name="chevron-forward" size={20} color="#ccc" />
</TouchableOpacity>

<TouchableOpacity 
  style={styles.menuItem} 
  onPress={() => navigation.navigate("SettingsScreen")}
>
  <Ionicons name="settings-outline" size={22} color="#333" />
  <Text style={styles.menuText}>Settings</Text>
  <Ionicons name="chevron-forward" size={20} color="#ccc" />
</TouchableOpacity>

      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  username: {
    marginTop: 30,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  subtext: {
    marginTop: -1,
    marginLeft: 20,
    color: "#888",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginBottom: 10,
  },
  action: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuContent: {
    flex: 1,
    marginLeft: 10,
  },
  menuText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "500",
  },
  menuSubtext: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});