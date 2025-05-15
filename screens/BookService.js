import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Surface, Title, Paragraph, HelperText, Portal, Dialog } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useMyContextController } from '../store';
import DateTimePicker from '../components/DateTimePicker';
import { generateBookingCode } from '../utils/helpers';

const BookService = ({ route, navigation }) => {
  const { service } = route.params;
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [note, setNote] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleBooking = async () => {
    if (!userLogin) {
      navigation.navigate('Login');
      return;
    }

    if (!selectedDateTime) {
      // Hiển thị thông báo lỗi
      return;
    }

    try {
      const bookingCode = generateBookingCode();
      const bookingRef = await addDoc(collection(db, "BOOKINGS"), {
        bookingCode,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        customerId: userLogin.email,
        customerName: userLogin.fullName,
        bookingDateTime: selectedDateTime.date,
        timeSlot: selectedDateTime.timeSlot,
        note: note.trim(),
        status: 'pending',
        createdAt: new Date(),
      });

      setBookingId(bookingRef.id);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Error booking service:", error);
    }
  };

  const handlePayment = async () => {
    try {
      await addDoc(collection(db, "TRANSACTIONS"), {
        bookingId: bookingId,
        serviceId: service.id,
        serviceName: service.name,
        amount: service.price,
        customerId: userLogin.email,
        customerName: userLogin.fullName,
        status: 'completed',
        createdAt: new Date(),
        type: 'payment',
      });

      setShowPaymentDialog(false);
      navigation.navigate('Bookings');
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Đặt lịch dịch vụ</Title>
        
        <View style={styles.serviceInfo}>
          <Title style={styles.serviceName}>{service.name}</Title>
          <Paragraph style={styles.servicePrice}>
            Giá: {service.price?.toLocaleString()} đ
          </Paragraph>
          <Paragraph style={styles.serviceDescription}>
            {service.description}
          </Paragraph>
        </View>

        <DateTimePicker
          selectedService={service}
          onSelectDateTime={handleDateTimeSelect}
        />

        <TextInput
          label="Ghi chú"
          value={note}
          onChangeText={setNote}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleBooking}
          style={styles.button}
          disabled={!selectedDateTime}
        >
          Đặt lịch
        </Button>

        <Portal>
          <Dialog visible={showPaymentDialog} onDismiss={() => setShowPaymentDialog(false)}>
            <Dialog.Title>Xác nhận thanh toán</Dialog.Title>
            <Dialog.Content>
              <Text>Bạn có muốn thanh toán ngay không?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowPaymentDialog(false)}>Để sau</Button>
              <Button onPress={handlePayment}>Thanh toán ngay</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  serviceInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  serviceName: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 18,
    color: '#ff6b81',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 8,
    backgroundColor: '#ff6b81',
  },
});

export default BookService; 