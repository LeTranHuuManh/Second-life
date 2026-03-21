export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rentPrice?: number
  stock: number
  seller: {
    id: string
    name: string
    avatar: string
  }
  rating: number
  reviews: number
}

export interface Order {
  id: string
  userId: string
  items: { productId: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
  estimatedDelivery: string
}

export interface Rental {
  id: string
  userId: string
  productId: string
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'cancelled'
  totalPrice: number
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Camera',
    description: 'Classic film camera in excellent condition',
    price: 150,
    rentPrice: 25,
    image: 'https://images.unsplash.com/photo-1611532736000-de82d5071e8c?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 5,
    seller: {
      id: 'seller1',
      name: 'John Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
    rating: 4.5,
    reviews: 24,
  },
  {
    id: '2',
    name: 'Leather Backpack',
    description: 'Premium leather travel backpack',
    price: 200,
    rentPrice: 30,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Fashion',
    stock: 8,
    seller: {
      id: 'seller2',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    rating: 4.8,
    reviews: 45,
  },
  {
    id: '3',
    name: 'Mountain Bike',
    description: 'High-performance 27-speed mountain bike',
    price: 450,
    rentPrice: 50,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'Sports',
    stock: 3,
    seller: {
      id: 'seller3',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    },
    rating: 4.7,
    reviews: 32,
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    price: 180,
    rentPrice: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 12,
    seller: {
      id: 'seller1',
      name: 'John Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
    rating: 4.6,
    reviews: 156,
  },
  {
    id: '5',
    name: 'Designer Watch',
    description: 'Swiss-made automatic watch',
    price: 890,
    rentPrice: 80,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    category: 'Fashion',
    stock: 2,
    seller: {
      id: 'seller4',
      name: 'Emma Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    },
    rating: 4.9,
    reviews: 78,
  },
  {
    id: '6',
    name: 'Coffee Maker',
    description: 'Automatic espresso machine with grinder',
    price: 320,
    rentPrice: 35,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop',
    category: 'Home',
    stock: 6,
    seller: {
      id: 'seller2',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    rating: 4.4,
    reviews: 89,
  },
]

export const MOCK_USERS = [
  {
    id: 'user1',
    email: 'john@example.com',
    name: 'John Smith',
    role: 'user' as const,
    totalSpent: 2450,
    joinDate: '2023-01-15',
    status: 'active' as const,
  },
  {
    id: 'user2',
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    role: 'user' as const,
    totalSpent: 1890,
    joinDate: '2023-03-22',
    status: 'active' as const,
  },
  {
    id: 'user3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    role: 'user' as const,
    totalSpent: 5230,
    joinDate: '2022-11-08',
    status: 'banned' as const,
  },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord1',
    userId: 'user1',
    items: [
      { productId: '1', quantity: 1, price: 150 },
      { productId: '4', quantity: 1, price: 180 },
    ],
    total: 330,
    status: 'delivered',
    createdAt: '2024-01-10',
    estimatedDelivery: '2024-01-15',
  },
  {
    id: 'ord2',
    userId: 'user1',
    items: [{ productId: '5', quantity: 1, price: 890 }],
    total: 890,
    status: 'shipped',
    createdAt: '2024-02-20',
    estimatedDelivery: '2024-02-28',
  },
  {
    id: 'ord3',
    userId: 'user2',
    items: [{ productId: '2', quantity: 2, price: 200 }],
    total: 400,
    status: 'pending',
    createdAt: '2024-03-18',
    estimatedDelivery: '2024-03-25',
  },
]

export const MOCK_RENTALS: Rental[] = [
  {
    id: 'rent1',
    userId: 'user1',
    productId: '3',
    startDate: '2024-03-20',
    endDate: '2024-03-27',
    status: 'active',
    totalPrice: 350,
  },
  {
    id: 'rent2',
    userId: 'user1',
    productId: '1',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    status: 'completed',
    totalPrice: 375,
  },
]
