import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, Copy, Share, X } from 'lucide-react-native';

// Dummy booking data
const bookingData = {
  '1': {
    id: '1',
    workerName: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    date: '16 Jan 2025',
    time: '09:00',
    price: 75000,
    paymentMethod: 'qris',
    status: 'pending_payment',
    qrisCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226580014ID.CO.QRIS.WWW0215ID20232024567890303UMI51440014ID.CO.QRIS.WWW0215ID20232024567890303UMI5204481253033605802ID5914TUKANGKU PAYMENT6004PALU61054321062070703A0163041234',
    paymentCode: 'TK-240115-001',
    expiryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  },
  // Dynamic booking data for new bookings
  [Date.now().toString()]: {
    id: Date.now().toString(),
    workerName: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    date: '16 Jan 2025',
    time: '09:00',
    price: 75000,
    paymentMethod: 'qris',
    status: 'pending_payment',
    qrisCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226580014ID.CO.QRIS.WWW0215ID20232024567890303UMI51440014ID.CO.QRIS.WWW0215ID20232024567890303UMI5204481253033605802ID5914TUKANGKU PAYMENT6004PALU61054321062070703A0163041234',
    paymentCode: `TK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    expiryTime: new Date(Date.now() + 15 * 60 * 1000),
  }
};

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      paymentMethod: 'qris',
      status: 'pending_payment',
      qrisCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226580014ID.CO.QRIS.WWW0215ID20232024567890303UMI51440014ID.CO.QRIS.WWW0215ID20232024567890303UMI5204481253033605802ID5914TUKANGKU PAYMENT6004PALU61054321062070703A0163041234',
      paymentCode: `TK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      expiryTime: new Date(Date.now() + 15 * 60 * 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Handle payment timeout
          Alert.alert(
            'Waktu Habis',
            'Waktu pembayaran telah habis. Silakan buat pesanan baru.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate payment checking
  useEffect(() => {
    if (paymentStatus === 'pending') {
      // Simulate payment success after 10 seconds for demo
      const paymentTimer = setTimeout(() => {
        setPaymentStatus('success');
        setShowSuccessModal(true);
      }, 10000);

      return () => clearTimeout(paymentTimer);
    }
  }, [paymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPaymentCode = () => {
    // In a real app, this would copy to clipboard
    Alert.alert('Berhasil', 'Kode pembayaran telah disalin');
  };

  const shareQRCode = () => {
    // In a real app, this would share the QR code
    Alert.alert('Share', 'QR Code akan dibagikan');
  };

  const checkPaymentStatus = () => {
    setPaymentStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus('success');
      setShowSuccessModal(true);
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(false);
    router.replace(`/booking-success/${bookingId}`);
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran QRIS</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Clock size={20} color="#DC2626" />
          <Text style={styles.timerText}>Selesaikan pembayaran dalam</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Payment Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Cara Pembayaran QRIS</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Buka aplikasi mobile banking atau e-wallet Anda
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Pilih menu "Scan QR" atau "QRIS"
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Scan QR Code di bawah ini
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Konfirmasi pembayaran sebesar Rp {booking.price.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <Image 
            source={{ uri: booking.qrisCode }}
            style={styles.qrCode}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.shareButton} onPress={shareQRCode}>
            <Share size={16} color="#EA580C" />
            <Text style={styles.shareText}>Bagikan QR</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.detailsTitle}>Detail Pembayaran</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Layanan</Text>
            <Text style={styles.detailValue}>{booking.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tukang</Text>
            <Text style={styles.detailValue}>{booking.workerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jadwal</Text>
            <Text style={styles.detailValue}>{booking.date}, {booking.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kode Pembayaran</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.detailValue}>{booking.paymentCode}</Text>
              <TouchableOpacity onPress={copyPaymentCode} style={styles.copyButton}>
                <Copy size={16} color="#EA580C" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>Rp {booking.price.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.statusContainer}>
          {paymentStatus === 'pending' && (
            <>
              <Text style={styles.statusText}>Menunggu pembayaran...</Text>
              <TouchableOpacity 
                style={styles.checkButton}
                onPress={checkPaymentStatus}
              >
                <Text style={styles.checkButtonText}>Cek Status Pembayaran</Text>
              </TouchableOpacity>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Text style={styles.processingText}>Memproses pembayaran...</Text>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Butuh Bantuan?</Text>
          <Text style={styles.helpText}>
            Jika mengalami kesulitan dalam pembayaran, hubungi customer service kami di:
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>0811-2345-6789</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <CheckCircle size={64} color="#10B981" />
            <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
            <Text style={styles.successMessage}>
              Pesanan Anda telah dikonfirmasi. Tukang akan segera menghubungi Anda.
            </Text>
            
            <View style={styles.successDetails}>
              <Text style={styles.successDetailLabel}>Kode Pesanan</Text>
              <Text style={styles.successDetailValue}>{booking?.paymentCode}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.successButton}
              onPress={handlePaymentSuccess}
            >
              <Text style={styles.successButtonText}>Lihat Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 32,
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#DC2626',
  },
  timerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
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
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  shareText: {
    fontSize: 14,
    color: '#EA580C',
    fontWeight: '600',
  },
  paymentDetails: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    padding: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
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
  statusContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#EA580C',
    fontWeight: '600',
  },
  checkButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  helpContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  successDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  successDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  successDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  successButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});