import { supabase } from '../supabase';

export interface Review {
  id: string;
  worker_id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    name: string;
    avatar: string | null;
  };
}

export async function createReview(reviewData: {
  worker_id: string;
  booking_id: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      worker_id: reviewData.worker_id,
      user_id: user.id,
      booking_id: reviewData.booking_id,
      rating: reviewData.rating,
      comment: reviewData.comment,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
}

export async function getWorkerReviews(workerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles!reviews_user_id_fkey (
        name,
        avatar
      )
    `)
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return (data || []).map((review: any) => ({
    ...review,
    user: {
      name: review.profiles.name,
      avatar: review.profiles.avatar,
    },
  }));
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }

  return data || [];
}

export async function hasUserReviewedBooking(
  userId: string,
  bookingId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('booking_id', bookingId)
    .single();

  return !error && !!data;
}
