import { supabase } from '../supabase';

export interface Worker {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  location: string | null;
  category: string;
  rating: number;
  reviews_count: number;
  price: number;
  experience: string;
  description: string;
  services: string[];
  working_hours: string;
  completed_jobs: number;
  response_time: string;
  available: boolean;
  distance?: string;
}

export interface WorkerWithGallery extends Worker {
  gallery: { id: string; image_url: string }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user: {
      name: string;
      avatar: string | null;
    };
  }[];
}

export async function getWorkers(filters?: {
  category?: string;
  location?: string;
  minRating?: number;
  available?: boolean;
}): Promise<Worker[]> {
  let query = supabase
    .from('workers')
    .select(`
      *,
      profiles!workers_user_id_fkey (
        name,
        email,
        phone,
        avatar,
        location
      )
    `);

  if (filters?.category && filters.category !== 'Semua Kategori') {
    query = query.eq('category', filters.category);
  }

  if (filters?.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters?.available !== undefined) {
    query = query.eq('available', filters.available);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }

  return (data || []).map((worker: any) => ({
    id: worker.id,
    user_id: worker.user_id,
    name: worker.profiles.name,
    email: worker.profiles.email,
    phone: worker.profiles.phone,
    avatar: worker.profiles.avatar,
    location: worker.profiles.location,
    category: worker.category,
    rating: worker.rating,
    reviews_count: worker.reviews_count,
    price: worker.price,
    experience: worker.experience,
    description: worker.description,
    services: worker.services,
    working_hours: worker.working_hours,
    completed_jobs: worker.completed_jobs,
    response_time: worker.response_time,
    available: worker.available,
  }));
}

export async function getWorkerById(id: string): Promise<WorkerWithGallery | null> {
  const { data: worker, error: workerError } = await supabase
    .from('workers')
    .select(`
      *,
      profiles!workers_user_id_fkey (
        name,
        email,
        phone,
        avatar,
        location
      )
    `)
    .eq('id', id)
    .single();

  if (workerError) {
    console.error('Error fetching worker:', workerError);
    return null;
  }

  // Fetch gallery
  const { data: gallery } = await supabase
    .from('gallery')
    .select('id, image_url')
    .eq('worker_id', id);

  // Fetch reviews with user info
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles!reviews_user_id_fkey (
        name,
        avatar
      )
    `)
    .eq('worker_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    id: worker.id,
    user_id: worker.user_id,
    name: worker.profiles.name,
    email: worker.profiles.email,
    phone: worker.profiles.phone,
    avatar: worker.profiles.avatar,
    location: worker.profiles.location,
    category: worker.category,
    rating: worker.rating,
    reviews_count: worker.reviews_count,
    price: worker.price,
    experience: worker.experience,
    description: worker.description,
    services: worker.services,
    working_hours: worker.working_hours,
    completed_jobs: worker.completed_jobs,
    response_time: worker.response_time,
    available: worker.available,
    gallery: gallery || [],
    reviews: (reviews || []).map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      user: {
        name: review.profiles.name,
        avatar: review.profiles.avatar,
      },
    })),
  };
}

export async function searchWorkers(query: string): Promise<Worker[]> {
  const { data, error } = await supabase
    .from('workers')
    .select(`
      *,
      profiles!workers_user_id_fkey (
        name,
        email,
        phone,
        avatar,
        location
      )
    `)
    .or(`category.ilike.%${query}%,profiles.name.ilike.%${query}%`);

  if (error) {
    console.error('Error searching workers:', error);
    throw error;
  }

  return (data || []).map((worker: any) => ({
    id: worker.id,
    user_id: worker.user_id,
    name: worker.profiles.name,
    email: worker.profiles.email,
    phone: worker.profiles.phone,
    avatar: worker.profiles.avatar,
    location: worker.profiles.location,
    category: worker.category,
    rating: worker.rating,
    reviews_count: worker.reviews_count,
    price: worker.price,
    experience: worker.experience,
    description: worker.description,
    services: worker.services,
    working_hours: worker.working_hours,
    completed_jobs: worker.completed_jobs,
    response_time: worker.response_time,
    available: worker.available,
  }));
}

export async function updateWorkerAvailability(
  workerId: string,
  available: boolean
): Promise<void> {
  const { error } = await supabase
    .from('workers')
    .update({ available })
    .eq('id', workerId);

  if (error) {
    console.error('Error updating worker availability:', error);
    throw error;
  }
}
