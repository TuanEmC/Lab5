import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Avatar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyContextController } from '../store';
import { auth } from '../firebase';

const CustomerProfile = ({ navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Avatar.Icon 
            size={80} 
            icon="account"
            style={styles.avatar}
          />
          <Title style={styles.name}>{userLogin?.fullName}</Title>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={24} color="#666" />
            <Text style={styles.infoText}>{userLogin?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={24} color="#666" />
            <Text style={styles.infoText}>{userLogin?.phone || 'Chưa cập nhật'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#666" />
            <Text style={styles.infoText}>{userLogin?.address || 'Chưa cập nhật'}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Đăng xuất
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#ff6b81',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    color: '#333',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff6b81',
  },
});

export default CustomerProfile; 