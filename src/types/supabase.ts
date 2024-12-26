export interface Database {
  public: {
    Tables: {
      product_reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          rating: number;
          review_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          rating: number;
          review_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          rating?: number;
          review_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_product_rating: {
        Args: { product_id: string };
        Returns: {
          average_rating: number;
          total_reviews: number;
        }[];
      };
    };
  };
}
