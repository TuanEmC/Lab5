import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Title, Text, useTheme } from 'react-native-paper';
import { getAvailableDates, getAvailableTimeSlots, formatDateToVietnamese } from '../utils/helpers';

const DateTimePicker = ({ onSelectDateTime, existingBookings = [], selectedService }) => {
  // State để lưu trữ dữ liệu
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Lấy theme từ react-native-paper
  const theme = useTheme();

  // Lấy danh sách ngày có thể đặt khi component được mount
  useEffect(() => {
    const dates = getAvailableDates();
    setAvailableDates(dates);
  }, []);

  // Cập nhật danh sách khung giờ khi ngày được chọn thay đổi
  useEffect(() => {
    if (selectedDate) {
      const timeSlots = getAvailableTimeSlots(selectedDate, existingBookings);
      setAvailableTimeSlots(timeSlots);
      setSelectedTimeSlot(null); // Reset khung giờ đã chọn
    }
  }, [selectedDate, existingBookings]);

  // Xử lý khi chọn ngày
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Xử lý khi chọn khung giờ
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if (onSelectDateTime) {
      onSelectDateTime({
        date: selectedDate,
        timeSlot: timeSlot,
        service: selectedService
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Phần chọn ngày */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={styles.title}>Chọn Ngày</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateButtonsContainer}>
              {availableDates.map((date, index) => (
                <Button
                  key={index}
                  mode={selectedDate && date.getTime() === selectedDate.getTime() ? "contained" : "outlined"}
                  onPress={() => handleDateSelect(date)}
                  style={styles.dateButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  color={theme.colors.primary}
                >
                  {formatDateToVietnamese(date)}
                </Button>
              ))}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Phần chọn giờ - chỉ hiển thị khi đã chọn ngày */}
      {selectedDate && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={styles.title}>Chọn Giờ</Title>
            {availableTimeSlots.length > 0 ? (
              <View style={styles.timeButtonsContainer}>
                {availableTimeSlots.map((timeSlot, index) => (
                  <Button
                    key={index}
                    mode={selectedTimeSlot === timeSlot ? "contained" : "outlined"}
                    onPress={() => handleTimeSlotSelect(timeSlot)}
                    style={styles.timeButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    color={theme.colors.primary}
                  >
                    {timeSlot.formatted}
                  </Button>
                ))}
              </View>
            ) : (
              <Text style={styles.noSlotsText}>
                Không có khung giờ trống cho ngày này
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Hiển thị thông tin đã chọn */}
      {selectedDate && selectedTimeSlot && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={styles.title}>Thời Gian Đã Chọn</Title>
            <Text style={styles.selectedInfo}>
              Ngày: {formatDateToVietnamese(selectedDate)}
            </Text>
            <Text style={styles.selectedInfo}>
              Giờ: {selectedTimeSlot.formatted}
            </Text>
            {selectedService && (
              <Text style={styles.selectedInfo}>
                Dịch vụ: {selectedService.name}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  dateButton: {
    marginHorizontal: 5,
    minWidth: 200,
  },
  timeButton: {
    margin: 5,
    minWidth: 150,
  },
  buttonContent: {
    padding: 8,
  },
  buttonLabel: {
    fontSize: 14,
  },
  noSlotsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  selectedInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default DateTimePicker; 