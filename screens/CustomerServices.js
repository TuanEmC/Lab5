import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Surface } from 'react-native-paper';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomerServices = () => {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "SERVICES"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const servicesData = [];
      querySnapshot.forEach((doc) => {
        servicesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setServices(servicesData);
    });

    return () => unsubscribe();
  }, []);

  const renderService = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("BookService", { service: item })}
      style={styles.cardContainer}
    >
      <Surface style={styles.surface} elevation={2}>
        <View style={styles.serviceCard}>
          <MaterialCommunityIcons name="spa" size={40} color="#ff6b81" style={styles.icon} />
          <View style={styles.serviceInfo}>
            <Title style={styles.serviceName}>{item.name}</Title>
            <Paragraph style={styles.servicePrice}>{item.price?.toLocaleString()} đ</Paragraph>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {item.description || 'Không có mô tả'}
            </Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color="#666"
            style={styles.chevron}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Danh sách dịch vụ</Text>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff6b81',
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    textAlign: 'center',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  surface: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  serviceCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    color: '#ff6b81',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
  list: {
    paddingBottom: 20,
  },
});

export default CustomerServices; 