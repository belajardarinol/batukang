import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Phone, Mail, CreditCard, Settings, CircleHelp as HelpCircle, Star, ChevronRight, LogOut, Shield, ChartBar as BarChart3 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();

  // If not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
        
        <View style={styles.loginPrompt}>
          <User size={64} color="#D1D5DB" />
          <Text style={styles.loginPromptTitle}>Belum Masuk Akun</Text>
          <Text style={styles.loginPromptText}>
            Masuk atau daftar untuk mengakses profil dan fitur lengkap aplikasi
          </Text>
          
          <View style={styles.loginButtons}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.registerButtonText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Role-specific stats and menu items
  const getProfileStats = () => {
    switch (user.role) {
      case 'user':
        return [
          { label: 'Total Pesanan', value: '12', color: '#EA580C' },
          { label: 'Selesai', value: '8', color: '#10B981' },
          { label: 'Rating Rata-rata', value: '4.8', color: '#F59E0B' },
        ];
      case 'tukang':
        return [
          { label: 'Pekerjaan Selesai', value: user.reviews?.toString() || '127', color: '#10B981' },
          { label: 'Rating', value: user.rating?.toString() || '4.8', color: '#F59E0B' },
          { label: 'Pendapatan Bulan Ini', value: 'Rp 2.5M', color: '#EA580C' },
        ];
      case 'admin':
        return [
          { label: 'Total Users', value: '1.2K', color: '#3B82F6' },
          { label: 'Active Tukang', value: '500', color: '#10B981' },
          { label: 'Transaksi Hari Ini', value: '45', color: '#EA580C' },
        ];
      default:
        return [];
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: Settings, label: 'Pengaturan', hasNotification: false },
      { icon: HelpCircle, label: 'Bantuan & Dukungan', hasNotification: true },
    ];

    switch (user.role) {
      case 'user':
        return [
          { icon: CreditCard, label: 'Metode Pembayaran', hasNotification: false },
          { icon: MapPin, label: 'Alamat Tersimpan', hasNotification: false },
          { icon: Star, label: 'Rating & Ulasan', hasNotification: false },
          ...baseItems,
        ];
      case 'tukang':
        return [
          { icon: BarChart3, label: 'Dashboard Tukang', hasNotification: false },
          { icon: Star, label: 'Ulasan Pelanggan', hasNotification: false },
          { icon: CreditCard, label: 'Rekening Bank', hasNotification: false },
          ...baseItems,
        ];
      case 'admin':
        return [
          { icon: Shield, label: 'Panel Admin', hasNotification: false },
          { icon: BarChart3, label: 'Analytics', hasNotification: false },
          { icon: User, label: 'Manajemen User', hasNotification: true },
          ...baseItems,
        ];
      default:
        return baseItems;
    }
  };

  const profileStats = getProfileStats();
  const menuItems = getMenuItems();

  const getRoleColor = () => {
    switch (user.role) {
      case 'user': return '#3B82F6';
      case 'tukang': return '#10B981';
      case 'admin': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'user': return 'Pengguna Premium';
      case 'tukang': return 'Tukang Profesional';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const handleLogout = () => {
    logout();
    // Stay on profile page to show login prompt
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={[styles.profileTitle, { color: getRoleColor() }]}>{getRoleLabel()}</Text>
              <View style={styles.profileContact}>
                <Phone size={14} color="#6B7280" />
                <Text style={styles.contactText}>{user.phone}</Text>
              </View>
              <View style={styles.profileContact}>
                <Mail size={14} color="#6B7280" />
                <Text style={styles.contactText}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          {user.location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          )}

          {/* Tukang specific info */}
          {user.role === 'tukang' && user.category && (
            <View style={styles.tukangInfo}>
              <Text style={styles.tukangCategory}>{user.category}</Text>
              <Text style={styles.tukangPrice}>Rp {user.price?.toLocaleString('id-ID')}/jam</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.hasNotification && (
                  <View style={styles.notificationDot} />
                )}
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Section */}
        {user.role === 'user' && (
          <View style={styles.premiumSection}>
            <View style={styles.premiumCard}>
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>Upgrade ke Premium</Text>
                <Text style={styles.premiumDescription}>
                  Dapatkan akses prioritas, diskon khusus, dan layanan 24/7
                </Text>
              </View>
              <TouchableOpacity style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Tukangku v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 Tukangku. All rights reserved.</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tukangInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 16,
  },
  tukangCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  tukangPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  premiumSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  premiumCard: {
    backgroundColor: '#EA580C',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumContent: {
    flex: 1,
    marginRight: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#DBEAFE',
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  premiumButtonText: {
    color: '#EA580C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loginButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  registerButtonText: {
    color: '#EA580C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});