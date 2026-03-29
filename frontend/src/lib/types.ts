

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    store_id: string;
    store_name: string;
  };
}


export interface OverviewResponse {
  period: string;
  revenue: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  events: {
    page_views: number;
    add_to_cart: number;
    remove_from_cart: number;
    checkout_started: number;
    purchases: number;
    total: number;
  };
  conversion_rate: number;
}


export interface TopProduct {
  product_id: string;
  revenue: number;
  quantity_sold: number;
}


export interface RecentEvent {
  event_id: string;
  event_type: 'page_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_started' | 'purchase';
  timestamp: string;
  data: Record<string, any>;
}


export interface DailyRevenue {
  date: string;
  revenue: number;
  page_views: number;
  purchases: number;
}
