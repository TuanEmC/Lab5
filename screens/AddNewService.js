import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AddNewService = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const hasErrorName = () => name.trim() === '';
  const hasErrorPrice = () => isNaN(price) || parseFloat(price) <= 0;

  const handleAddService = async () => {
    if (hasErrorName() || hasErrorPrice()) {
      return;
    }

    try {
      await addDoc(collection(db, "SERVICES"), {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        createdAt: new Date(),
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thêm dịch vụ mới</Text>

      <TextInput
        label="Tên dịch vụ"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <HelperText type="error" visible={hasErrorName()}>
        Tên dịch vụ không được để trống
      </HelperText>

      <TextInput
        label="Giá dịch vụ (VND)"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />
      <HelperText type="error" visible={hasErrorPrice()}>
        Giá dịch vụ phải là số dương
      </HelperText>

      <TextInput
        label="Mô tả"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleAddService}
        style={styles.button}
        disabled={hasErrorName() || hasErrorPrice()}
      >
        Thêm dịch vụ
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AddNewService;
