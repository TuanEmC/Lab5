import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Portal, Dialog, TextInput } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useMyContextController } from '../store';

const ServiceDetail = ({ route, navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const { service } = route.params;

  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState('');

  const handleBookService = async () => {
    if (!userLogin) {
      navigation.navigate('Login');
      return;
    }

    try {
      await addDoc(collection(db, "TRANSACTIONS"), {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        customerId: userLogin.email,
        customerName: userLogin.fullName,
        note: note.trim(),
        status: 'pending',
        createdAt: new Date(),
      });

      setVisible(false);
      setNote('');
      navigation.goBack();
    } catch (error) {
      console.error("Error booking service:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{service.name}</Title>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Giá:</Text>
            <Text style={styles.price}>{service.price?.toLocaleString()} VND</Text>
          </View>
          <Title style={styles.sectionTitle}>Mô tả dịch vụ</Title>
          <Paragraph style={styles.description}>{service.description}</Paragraph>
          
          {service.createdAt && (
            <Paragraph style={styles.date}>
              Ngày tạo: {service.createdAt.toDate().toLocaleDateString()}
            </Paragraph>
          )}
        </Card.Content>
        
        {userLogin?.role !== 'admin' && (
          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              style={styles.bookButton}
              onPress={() => setVisible(true)}
            >
              Đặt dịch vụ
            </Button>
          </Card.Actions>
        )}
      </Card>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Đặt dịch vụ</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogText}>Dịch vụ: {service.name}</Text>
              <Text style={styles.dialogText}>Giá: {service.price?.toLocaleString()} VND</Text>
              <TextInput
                label="Ghi chú"
                value={note}
                onChangeText={setNote}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.noteInput}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Hủy</Button>
            <Button onPress={handleBookService}>Xác nhận</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  date: {
    fontStyle: 'italic',
    color: '#666',
  },
  actions: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  bookButton: {
    width: '50%',
  },
  dialogContent: {
    marginVertical: 10,
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 10,
  },
  noteInput: {
    marginTop: 10,
  },
});

export default ServiceDetail;
