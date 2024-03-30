type Material = {
    id: string;
    text: string;
    article: string;
    price: string;
    quantity: number;
    date: Date; // Assuming date is stored as an ISO string
    unit: string;
    comment: string;
    deliveryDate: Date;
    orderedBy: string;
    status: string;
    payment: string;
  };
  
type User = {
  username: string;
  password: string;
  email: string;
  department?: string;
  role?: UserRole;
  isApproved?: boolean;
}