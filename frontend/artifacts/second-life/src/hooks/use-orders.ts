import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface OrderItem {
  product: (typeof MOCK_PRODUCTS)[0];
  quantity: number;
  type: "buy" | "rent";
  rentStart?: string;
  rentEnd?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipping" | "delivered" | "completed";
  createdAt: string;
  reviewed?: boolean;
}

let MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    items: [{ product: MOCK_PRODUCTS[0], quantity: 1, type: "rent", rentStart: "2024-05-01", rentEnd: "2024-05-05" }],
    total: 1000000,
    status: "completed",
    createdAt: "2024-05-01T08:00:00Z",
    reviewed: false,
  },
  {
    id: "ORD-2024-002",
    items: [{ product: MOCK_PRODUCTS[1], quantity: 1, type: "buy" }],
    total: 1200000,
    status: "completed",
    createdAt: "2024-04-20T10:00:00Z",
    reviewed: true,
  },
  {
    id: "ORD-2024-003",
    items: [{ product: MOCK_PRODUCTS[2], quantity: 1, type: "rent", rentStart: "2024-06-01", rentEnd: "2024-06-03" }],
    total: 160000,
    status: "delivered",
    createdAt: "2024-06-01T09:00:00Z",
  },
  {
    id: "ORD-2024-004",
    items: [{ product: MOCK_PRODUCTS[3], quantity: 2, type: "buy" }],
    total: 900000,
    status: "shipping",
    createdAt: "2024-06-10T14:00:00Z",
  },
  {
    id: "ORD-2024-005",
    items: [
      { product: MOCK_PRODUCTS[4], quantity: 1, type: "buy" },
      { product: MOCK_PRODUCTS[5], quantity: 1, type: "buy" },
    ],
    total: 2500000,
    status: "processing",
    createdAt: "2024-06-12T11:00:00Z",
  },
  {
    id: "ORD-2024-006",
    items: [{ product: MOCK_PRODUCTS[6], quantity: 1, type: "buy" }],
    total: 350000,
    status: "pending",
    createdAt: "2024-06-13T16:30:00Z",
  },
];

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      await delay(400);
      return [...MOCK_ORDERS];
    },
  });
}

export function useConfirmReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      await delay(800);
      MOCK_ORDERS = MOCK_ORDERS.map((o) =>
        o.id === orderId ? { ...o, status: "completed" as const, reviewed: false } : o
      );
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { orderId: string; rating: number; comment: string }) => {
      await delay(1000);
      MOCK_ORDERS = MOCK_ORDERS.map((o) =>
        o.id === data.orderId ? { ...o, reviewed: true } : o
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Order>) => {
      await delay(1500);
      const order: Order = {
        id: `ORD-${Date.now()}`,
        items: [],
        total: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
        ...data,
      };
      MOCK_ORDERS = [order, ...MOCK_ORDERS];
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
