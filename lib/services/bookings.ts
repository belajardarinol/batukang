import { supabase } from '../supabase';

export interface Booking {
  id: string;
  user_id: string;
  worker_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  duration: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  worker?: {
    name: string;
    category: string;
    avatar: string | null;
    phone: string;
  };
  user?: {
    name: string;
    phone: string;
    avatar: string | null;
    location: string | null;
  };
}

export async function createBooking(bookingData: {
  worker_id: string;
  date: string;
  time: string;
  total_price: number;
  duration: number;
  notes?: string;
}): Promise<Booking> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      worker_id: bookingData.worker_id,
      date: bookingData.date,
      time: bookingData.time,
      total_price: bookingData.total_price,
      duration: bookingData.duration,
      notes: bookingData.notes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      workers!bookings_worker_id_fkey (
        profiles!workers_user_id_fkey (
          name,
          phone,
          avatar
        ),
        category
      ),
      profiles!bookings_user_id_fkey (
        name,
        phone,
        avatar,
        location
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return {
    ...data,
    worker: {
      name: data.workers.profiles.name,
      category: data.workers.category,
      avatar: data.workers.profiles.avatar,
      phone: data.workers.profiles.phone,
    },
    user: {
      name: data.profiles.name,
      phone: data.profiles.phone,
      avatar: data.profiles.avatar,
      location: data.profiles.location,
    },
  };
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      workers!bookings_worker_id_fkey (
        profiles!workers_user_id_fkey (
          name,
          phone,
          avatar
        ),
        category
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }

  return (data || []).map((booking: any) => ({
    ...booking,
    worker: {
      name: booking.workers.profiles.name,
      category: booking.workers.category,
      avatar: booking.workers.profiles.avatar,
      phone: booking.workers.profiles.phone,
    },
  }));
}

export async function getWorkerBookings(workerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!bookings_user_id_fkey (
        name,
        phone,
        avatar,
        location
      )
    `)
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching worker bookings:', error);
    throw error;
  }

  return (data || []).map((booking: any) => ({
    ...booking,
    user: {
      name: booking.profiles.name,
      phone: booking.profiles.phone,
      avatar: booking.profiles.avatar,
      location: booking.profiles.location,
    },
  }));
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'cancelled');
}
