import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { IconButton, Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const Services = () => {
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

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "SERVICES", serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const renderService = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Giá: {item.price?.toLocaleString()} VND</Paragraph>
        <Paragraph>Mô tả: {item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate("ServiceDetail", { service: item })}>
          Chi tiết
        </Button>
        <Button onPress={() => handleDeleteService(item.id)}>Xóa</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <IconButton
          icon="plus-circle"
          iconColor="red"
          size={40}
          onPress={() => navigation.navigate('AddNewService')}
        />
      </View>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    alignSelf: 'center',
    marginVertical: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  list: {
    paddingBottom: 20,
  },
});

export default Services;
