export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface OrderInterface {
  createdAt: string;
  id: string;
  remarks: string;
  status: string;
  updatedAt: string;
}

export interface OrderDetailsInterface {
  id: string;
  remarks: string;
  status: string;
  session: {
    id: string;
    phone: string;
    table: {
      id: string;
      name: string;
    };
  };
  orderItem: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      photo: string;
    };
    orderAddOn: {
      id: string;
      productAddOn: {
        id: string;
        name: string;
        price: number;
      };
    }[];
  }[];
}
