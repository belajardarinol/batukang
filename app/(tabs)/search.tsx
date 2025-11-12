import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Star, SlidersHorizontal, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { getWorkers, Worker } from '@/lib/services/workers';

const filters = ['Semua', 'Terdekat', 'Rating Tinggi', 'Harga Murah'];

const categories = [
  'Semua Kategori', 'Listrik', 'Plumbing', 'Cat', 'Kayu', 'AC Service', 'Renovasi'
];

const locations = [
  'Semua Lokasi', 'Palu Barat', 'Palu Timur', 'Palu Selatan', 'Palu Utara'
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
  const [minRating, setMinRating] = useState(0);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (workersList: Worker[]) => {
    return workersList.filter(worker => {
      // Search query filter
      if (searchQuery && !worker.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !worker.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'Semua Kategori' && worker.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'Semua Lokasi' && worker.location !== selectedLocation) {
        return false;
      }

      // Rating filter
      if (worker.rating < minRating) {
        return false;
      }

      return true;
    });
  };

  const sortWorkers = (workersList: Worker[]) => {
    if (activeFilter === 'Terdekat') {
      return [...workersList].sort((a, b) => {
        const distA = parseFloat(a.distance || '999');
        const distB = parseFloat(b.distance || '999');
        return distA - distB;
      });
    } else if (activeFilter === 'Rating Tinggi') {
      return [...workersList].sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === 'Harga Murah') {
      return [...workersList].sort((a, b) => a.price - b.price);
    }
    return workersList;
  };

  const filteredWorkers = sortWorkers(applyFilters(workers));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari Tukang</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowAdvancedFilter(true)}
        >
          <SlidersHorizontal size={20} color="#EA580C" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan layanan atau nama..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EA580C" />
          </View>
        ) : (
          <>
            <Text style={styles.resultsHeader}>
              {filteredWorkers.length} tukang ditemukan di Palu
            </Text>

            {filteredWorkers.map((worker) => (
              <TouchableOpacity 
                key={worker.id} 
                style={styles.workerCard}
                onPress={() => router.push(`/worker/${worker.id}`)}
              >
                <Image 
                  source={{ uri: worker.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }} 
                  style={styles.workerImage} 
                />
                <View style={styles.workerInfo}>
                  <View style={styles.workerHeader}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: worker.available ? '#10B981' : '#6B7280' }
                    ]}>
                      <Text style={styles.statusText}>
                        {worker.available ? 'Tersedia' : 'Sibuk'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.workerCategory}>{worker.category}</Text>
                  
                  <View style={styles.workerMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.rating}>{worker.rating.toFixed(1)}</Text>
                      <Text style={styles.reviews}>({worker.reviews_count})</Text>
                    </View>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.distance}>{worker.distance || '1.0 km'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.workerFooter}>
                    <Text style={styles.price}>Rp {worker.price.toLocaleString('id-ID')}/jam</Text>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>Pesan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {filteredWorkers.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Tidak ada tukang ditemukan</Text>
                <Text style={styles.emptySubtext}>Coba ubah filter pencarian Anda</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Advanced Filter Modal */}
      <Modal visible={showAdvancedFilter} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Pencarian</Text>
              <TouchableOpacity onPress={() => setShowAdvancedFilter(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Category Filter */}
              <Text style={styles.filterLabel}>Kategori</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.selectedCategoryChip,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category && styles.selectedCategoryText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Location Filter */}
              <Text style={styles.filterLabel}>Lokasi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.categoryChip,
                      selectedLocation === location && styles.selectedCategoryChip,
                    ]}
                    onPress={() => setSelectedLocation(location)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedLocation === location && styles.selectedCategoryText,
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Rating Filter */}
              <Text style={styles.filterLabel}>Rating Minimum</Text>
              <View style={styles.ratingFilter}>
                {[0, 3, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingChip,
                      minRating === rating && styles.selectedRatingChip,
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text
                      style={[
                        styles.ratingText,
                        minRating === rating && styles.selectedRatingText,
                      ]}
                    >
                      {rating === 0 ? 'Semua' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowAdvancedFilter(false)}
              >
                <Text style={styles.applyButtonText}>Terapkan Filter</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  searchInput: {
    flex: 1,
    fontSize: 16,
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
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  workerCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
  },
  workerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  bookButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
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
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryScrollView: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#EA580C',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  ratingFilter: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  selectedRatingChip: {
    backgroundColor: '#EA580C',
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedRatingText: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});