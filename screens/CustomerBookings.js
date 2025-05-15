import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, Title, Paragraph, Chip } from 'react-native-paper';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useMyContextController } from '../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    if (!userLogin?.email) return;

    const q = query(
      collection(db, "BOOKINGS"),
      where("customerId", "==", userLogin.email),
      orderBy("bookingDateTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data(),
          bookingDateTime: doc.data().bookingDateTime.toDate(),
          createdAt: doc.data().createdAt.toDate(),
        });
      });
      setBookings(bookingsData);
    });

    return () => unsubscribe();
  }, [userLogin]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const renderBooking = ({ item }) => (
    <Surface style={styles.bookingCard}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="spa" size={24} color="#ff6b81" />
        <Title style={styles.serviceName}>{item.serviceName}</Title>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>
            {item.bookingDateTime.toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="clock" size={20} color="#666" />
          <Text style={styles.infoText}>
            {item.bookingDateTime.toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="cash" size={20} color="#666" />
          <Text style={styles.infoText}>
            {item.servicePrice?.toLocaleString()} đ
          </Text>
        </View>
      </View>

      {item.note && (
        <Paragraph style={styles.note}>
          Ghi chú: {item.note}
        </Paragraph>
      )}

      <Chip 
        style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
        textStyle={{ color: 'white' }}
      >
        {getStatusText(item.status)}
      </Chip>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Lịch hẹn của bạn</Title>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    marginLeft: 8,
    fontSize: 18,
    color: '#333',
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  list: {
    paddingBottom: 20,
  },
});

export default CustomerBookings; 