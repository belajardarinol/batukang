import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { CircleCheck as CheckCircle, Calendar, Clock, MapPin, Phone } from 'lucide-react-native';

// Dummy booking data
const bookingData = {
  '1': {
    id: '1',
    workerName: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    date: '16 Jan 2025',
    time: '09:00',
    price: 75000,
    paymentCode: 'TK-240115-001',
    workerPhone: '+62 812-3456-7890',
    address: 'Jl. Tadulako No. 123, Palu Barat',
    estimatedDuration: '2-3 jam',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  },
  // Dynamic booking data for new bookings
  [Date.now().toString()]: {
    id: Date.now().toString(),
    workerName: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    date: '16 Jan 2025',
    time: '09:00',
    price: 75000,
    paymentCode: `TK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    workerPhone: '+62 812-3456-7890',
    address: 'Jl. Tadulako No. 123, Palu Barat',
    estimatedDuration: '2-3 jam',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  }
};

export default function BookingSuccessScreen() {
  const { bookingId } = useLocalSearchParams();
  
  // Handle dynamic booking data
  let booking = bookingData[bookingId as keyof typeof bookingData];
  
  // If booking not found in static data, create dynamic booking data
  if (!booking && bookingId) {
    booking = {
      id: bookingId as string,
      workerName: 'Pak Budi Santoso',
      category: 'Tukang Listrik',
      date: '16 Jan 2025',
      time: '09:00',
      price: 75000,
      paymentCode: `TK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      workerPhone: '+62 812-3456-7890',
      address: 'Jl. Tadulako No. 123, Palu Barat',
      estimatedDuration: '2-3 jam',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    };
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pesanan tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <CheckCircle size={80} color="#10B981" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Pesanan Berhasil!</Text>
        <Text style={styles.successMessage}>
          Pembayaran Anda telah dikonfirmasi. Tukang akan segera menghubungi Anda untuk konfirmasi jadwal.
        </Text>

        {/* Booking Details */}
        <View style={styles.bookingCard}>
          <View style={styles.workerInfo}>
            <Image source={{ uri: booking.image }} style={styles.workerImage} />
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>{booking.workerName}</Text>
              <Text style={styles.workerCategory}>{booking.category}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.detailText}>{booking.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>{booking.time} ({booking.estimatedDuration})</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{booking.address}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.paymentSection}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Kode Pesanan</Text>
              <Text style={styles.paymentValue}>{booking.paymentCode}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total Dibayar</Text>
              <Text style={styles.totalValue}>Rp {booking.price.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>Langkah Selanjutnya</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.stepDescription}>
                Tukang akan menghubungi Anda dalam 30 menit
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.stepDescription}>
                Konfirmasi jadwal dan detail pekerjaan
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.stepDescription}>
                Tukang akan datang sesuai jadwal yang disepakati
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => {
            // In real app, this would open phone dialer
            Alert.alert('Menghubungi Tukang', `Memanggil ${booking?.workerPhone}`);
          }}
        >
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Hubungi Tukang</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)/bookings')}
        >
          <Text style={styles.homeButtonText}>Lihat Pesanan Saya</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  workerCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  detailsSection: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  paymentSection: {
    gap: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  nextStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepDescription: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});