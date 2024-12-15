export interface User {
  id: string;
  display_name: string;
  bio: string | null;
  profile_picture_url: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  background_image: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  text: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostWithRelations extends Post {
  post_images: PostImage[];
  likes: Like[];
}
