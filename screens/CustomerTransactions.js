import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useMyContextController } from '../store';

const CustomerTransactions = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!userLogin) return;

    const q = query(
      collection(db, "TRANSACTIONS"),
      where("customerId", "==", userLogin.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        });
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [userLogin]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'processing':
        return '#2196F3';
      default:
        return '#FFC107';
    }
  };

  const renderTransaction = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.serviceName}</Title>
        <Paragraph>Giá: {item.price?.toLocaleString()} VND</Paragraph>
        <Paragraph>Ngày đặt: {item.createdAt.toLocaleDateString()}</Paragraph>
        {item.note && (
          <Paragraph>Ghi chú: {item.note}</Paragraph>
        )}
        <View style={styles.statusContainer}>
          <Text>Trạng thái: </Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status || 'pending'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử giao dịch của bạn</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Bạn chưa có giao dịch nào
          </Text>
        </View>
      )}
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  status: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default CustomerTransactions; 