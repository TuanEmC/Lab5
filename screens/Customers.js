import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "USERS"),
      where("role", "==", "customer")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = [];
      querySnapshot.forEach((doc) => {
        customersData.push(doc.data());
      });
      setCustomers(customersData);
    });

    return () => unsubscribe();
  }, []);

  const renderCustomer = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.fullName}</Title>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Phone: {item.phone}</Paragraph>
        <Paragraph>Address: {item.address}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách khách hàng</Text>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.email}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  list: {
    paddingBottom: 20,
  },
});

export default Customers; 