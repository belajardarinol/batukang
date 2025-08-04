import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Phone, Star } from 'lucide-react-native';
import { router } from 'expo-router';

const statusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#D1FAE5', text: '#065F46' },
  inProgress: { bg: '#DBEAFE', text: '#1E40AF' },
  completed: { bg: '#F3E8FF', text: '#6B21A8' },
};

const bookings = [
  {
    id: 1,
    workerName: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    date: '2025-01-15',
    time: '09:00',
    address: 'Jl. Tadulako No. 123, Palu Barat',
    status: 'pending',
    price: 'Rp 150.000',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    description: 'Perbaikan instalasi listrik rumah',
    paymentCode: 'TK-240115-001',
  },
  {
    id: 2,
    workerName: 'Pak Ahmad Hidayat',
    category: 'Tukang Plumbing',
    date: '2025-01-12',
    time: '14:00',
    address: 'Jl. Soekarno Hatta No. 45, Palu Timur',
    status: 'completed',
    price: 'Rp 120.000',
    rating: 5,
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    description: 'Perbaikan pipa bocor di kamar mandi',
    paymentCode: 'TK-240112-002',
  },
  {
    id: 3,
    workerName: 'Pak Joko Widodo',
    category: 'Tukang Cat',
    date: '2025-01-18',
    time: '08:00',
    address: 'Jl. Diponegoro No. 78, Palu Selatan',
    status: 'pending',
    price: 'Rp 200.000',
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    description: 'Pengecatan ulang ruang tamu',
    paymentCode: 'TK-240118-003',
  },
];

const tabs = ['Semua', 'Menunggu', 'Dikonfirmasi', 'Selesai'];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Semua');

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      inProgress: 'Sedang Berlangsung',
      completed: 'Selesai',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Menunggu') return booking.status === 'pending';
    if (activeTab === 'Dikonfirmasi') return booking.status === 'confirmed' || booking.status === 'inProgress';
    if (activeTab === 'Selesai') return booking.status === 'completed';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Saya</Text>
      </View>

      {/* Tabs */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterChip,
                activeTab === tab && styles.activeFilterChip,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeTab === tab && styles.activeFilterText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.bookingsContainer} showsVerticalScrollIndicator={false}>
        {filteredBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Image source={{ uri: booking.image }} style={styles.workerImage} />
              <View style={styles.bookingInfo}>
                <Text style={styles.workerName}>{booking.workerName}</Text>
                <Text style={styles.category}>{booking.category}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors[booking.status as keyof typeof statusColors].bg }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: statusColors[booking.status as keyof typeof statusColors].text }
                  ]}>
                    {getStatusText(booking.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.price}>{booking.price}</Text>
            </View>

            <Text style={styles.description}>{booking.description}</Text>

            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.time}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{booking.address}</Text>
            </View>

            {booking.status === 'completed' && booking.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating Anda:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color="#F59E0B"
                      fill={star <= booking.rating! ? "#F59E0B" : "transparent"}
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.bookingActions}>
              {booking.status === 'confirmed' && (
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Hubungi Tukang</Text>
                </TouchableOpacity>
              )}
              
              {booking.status === 'pending' && (
                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => router.push(`/payment/${booking.id}`)}
                >
                  <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                </TouchableOpacity>
              )}
              
              {booking.status === 'completed' && !booking.rating && (
                <TouchableOpacity style={styles.rateButton}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.rateButtonText}>Beri Rating</Text>
                </TouchableOpacity>
              )}
              
              {booking.status === 'pending' && (
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Batalkan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {filteredBookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada pesanan</Text>
            <Text style={styles.emptySubtext}>
              Mulai cari tukang untuk kebutuhan Anda
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bookingsContainer: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#374151',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#EA580C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  rateButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rateButtonText: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});