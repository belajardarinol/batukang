import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar,
  Check,
  X
} from 'lucide-react-native';

// Mock data for worker details
const workerData = {
  '1': {
    id: 1,
    name: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    price: 75000,
    available: true,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    description: 'Pengalaman 15 tahun dalam bidang instalasi listrik rumah dan komersial. Spesialisasi dalam perbaikan korsleting, pemasangan lampu, dan instalasi panel listrik.',
    services: ['Instalasi Listrik', 'Perbaikan Korsleting', 'Pemasangan Lampu', 'Panel Listrik'],
    workingHours: '08:00 - 17:00',
    experience: '15 tahun',
    completedJobs: 1247,
    responseTime: '< 30 menit',
    location: 'Palu Barat, Sulawesi Tengah',
    gallery: [
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      'https://images.pexels.com/photos/159358/electrical-installation-electric-electricity-159358.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      'https://images.pexels.com/photos/257761/pexels-photo-257761.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    ],
    reviews: [
      {
        id: 1,
        name: 'Ibu Sarah',
        rating: 5,
        comment: 'Sangat profesional dan cepat dalam menangani masalah listrik di rumah. Recommended!',
        date: '2025-01-10',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      {
        id: 2,
        name: 'Pak Agus',
        rating: 5,
        comment: 'Harga terjangkau, hasil memuaskan. Pak Budi sangat berpengalaman.',
        date: '2025-01-08',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
    ]
  }
};

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
];

export default function WorkerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const worker = workerData[id as keyof typeof workerData];

  if (!worker) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tukang tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    // Create booking with selected date and time, then navigate to payment
    const bookingId = Date.now().toString(); // Generate unique booking ID
    router.push(`/payment/${bookingId}`);
  };

  // Remove handlePayment function as we're navigating to dedicated payment screen

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Tukang</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Worker Info */}
        <View style={styles.workerSection}>
          <Image source={{ uri: worker.image }} style={styles.workerImage} />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerCategory}>{worker.category}</Text>
            
            <View style={styles.workerMeta}>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{worker.rating}</Text>
                <Text style={styles.reviews}>({worker.reviews} ulasan)</Text>
              </View>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.distance}>{worker.distance}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: worker.available ? '#D1FAE5' : '#FEE2E2' }]}>
                <Text style={[styles.statusText, { color: worker.available ? '#065F46' : '#DC2626' }]}>
                  {worker.available ? 'Tersedia' : 'Sedang Sibuk'}
                </Text>
              </View>
              <Text style={styles.price}>Rp {worker.price.toLocaleString('id-ID')}/jam</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{worker.experience}</Text>
            <Text style={styles.statLabel}>Pengalaman</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{worker.completedJobs}+</Text>
            <Text style={styles.statLabel}>Pekerjaan Selesai</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{worker.responseTime}</Text>
            <Text style={styles.statLabel}>Respon</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang</Text>
          <Text style={styles.description}>{worker.description}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layanan</Text>
          <View style={styles.servicesContainer}>
            {worker.services.map((service, index) => (
              <View key={index} style={styles.serviceChip}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galeri Pekerjaan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {worker.gallery.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
            ))}
          </ScrollView>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ulasan Pelanggan</Text>
          {worker.reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        color="#F59E0B"
                        fill={star <= review.rating ? "#F59E0B" : "transparent"}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.callButton}>
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Hubungi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Jadwal</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Tanggal</Text>
              <View style={styles.dateContainer}>
                {['15 Jan', '16 Jan', '17 Jan', '18 Jan'].map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[styles.dateChip, selectedDate === date && styles.selectedDateChip]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Waktu</Text>
              <View style={styles.timeContainer}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeChip, selectedTime === time && styles.selectedTimeChip]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.confirmButton, (!selectedDate || !selectedTime) && styles.disabledButton]}
                onPress={handleConfirmBooking}
                disabled={!selectedDate || !selectedTime}
              >
                <Text style={styles.confirmButtonText}>Konfirmasi Pesanan</Text>
              </TouchableOpacity>
            </ScrollView>
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
  workerSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  workerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  workerInfo: {
    alignItems: 'center',
  },
  workerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  workerCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reviews: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 12,
    color: '#C2410C',
    fontWeight: '500',
  },
  gallery: {
    marginTop: 4,
  },
  galleryImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  bottomAction: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#EA580C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dateChip: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDateChip: {
    backgroundColor: '#EA580C',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  timeChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedTimeChip: {
    backgroundColor: '#EA580C',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});