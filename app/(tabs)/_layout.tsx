import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Calendar, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  // Show different tabs based on user role
  const getTabsForRole = () => {
    if (!user) {
      // Guest user - show limited tabs
      return (
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Beranda',
              tabBarIcon: ({ size, color }) => (
                <Home size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Cari',
              tabBarIcon: ({ size, color }) => (
                <Search size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="bookings"
            options={{
              title: 'Pesanan',
              tabBarIcon: ({ size, color }) => (
                <Calendar size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      );
    }

    // Authenticated users get full access
    return (
      <>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: user.role === 'tukang' ? 'Pesanan' : 'Cari',
            tabBarIcon: ({ size, color }) => (
              <Search size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: user.role === 'admin' ? 'Manajemen' : 'Pesanan',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </>
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EA580C',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}>
      {getTabsForRole()}
    </Tabs>
  );
}