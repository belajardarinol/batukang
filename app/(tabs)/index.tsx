import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, Wrench, Zap, Chrome as HomeIcon, Car, Paintbrush, Hammer } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  { id: 1, name: 'Listrik', icon: Zap, color: '#EA580C' },
  { id: 2, name: 'Plumbing', icon: Wrench, color: '#DC2626' },
  { id: 3, name: 'Renovasi', icon: HomeIcon, color: '#059669' },
  { id: 4, name: 'AC Service', icon: Car, color: '#7C3AED' },
  { id: 5, name: 'Cat', icon: Paintbrush, color: '#DB2777' },
  { id: 6, name: 'Kayu', icon: Hammer, color: '#0891B2' },
];

const featuredWorkers = [
  {
    id: 1,
    name: 'Pak Budi Santoso',
    category: 'Tukang Listrik',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    price: 'Rp 75.000/jam',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  },
  {
    id: 2,
    name: 'Pak Ahmad Hidayat',
    category: 'Tukang Plumbing',
    rating: 4.9,
    reviews: 89,
    distance: '0.8 km',
    price: 'Rp 80.000/jam',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  },
  {
    id: 5,
    name: 'Pak Andi Firmansyah',
    category: 'AC Service',
    rating: 4.9,
    reviews: 98,
    distance: '1.8 km',
    price: 'Rp 85.000/jam',
    image: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  },
];

const quickStats = [
  { label: 'Tukang Aktif', value: '500+', color: '#EA580C' },
  { label: 'Pekerjaan Selesai', value: '2.5K+', color: '#10B981' },
  { label: 'Rating Rata-rata', value: '4.8', color: '#F59E0B' },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const getGreeting = () => {
    if (!user) return 'Selamat datang di';
    
    const hour = new Date().getHours();
    if (hour < 12) return `Selamat pagi, ${user.name.split(' ')[0]}`;
    if (hour < 17) return `Selamat siang, ${user.name.split(' ')[0]}`;
    return `Selamat malam, ${user.name.split(' ')[0]}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.appName}>{user ? 'Tukangku' : 'BaTukang'}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.location}>Palu, Sulawesi Tengah</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{user?.name.charAt(0) || 'U'}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color="#6B7280" />
          <Text style={styles.searchPlaceholder}>Cari tukang yang Anda butuhkan...</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Tukangku di Palu</Text>
          <View style={styles.statsContainer}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Layanan</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => router.push(`/search?category=${category.name}`)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Workers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tukang Terpopuler</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {featuredWorkers.map((worker) => (
            <TouchableOpacity 
              key={worker.id} 
              style={styles.workerCard}
              onPress={() => router.push(`/worker/${worker.id}`)}
            >
              <Image source={{ uri: worker.image }} style={styles.workerImage} />
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerCategory}>{worker.category}</Text>
                <View style={styles.workerMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.rating}>{worker.rating}</Text>
                    <Text style={styles.reviews}>({worker.reviews})</Text>
                  </View>
                  <Text style={styles.distance}>{worker.distance}</Text>
                </View>
                <Text style={styles.price}>{worker.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Service Banner */}
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Layanan Darurat 24/7</Text>
            <Text style={styles.emergencyText}>
              Butuh bantuan segera? Hubungi tukang terdekat untuk layanan darurat
            </Text>
          </View>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Panggil Sekarang</Text>
          </TouchableOpacity>
        </View>

        {/* Testimonial Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apa Kata Pelanggan</Text>
          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
                style={styles.testimonialAvatar}
              />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>Ibu Sarah</Text>
                <View style={styles.testimonialRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Aplikasi Tukangku sangat membantu! Cepat menemukan tukang listrik yang profesional dan terpercaya. Highly recommended!"
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#6B7280',
    fontSize: 16,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#EA580C',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  workerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  emergencyBanner: {
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 12,
    color: '#FEE2E2',
    lineHeight: 16,
  },
  emergencyButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 12,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});