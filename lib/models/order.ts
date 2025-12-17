import mongoose, { Schema, model } from 'mongoose';

export type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

export interface IOrder extends mongoose.Document {
  userEmail: string | null;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  subtotal: number;
  items: OrderItem[];
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>({
  userEmail: { type: String, default: null, index: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  subtotal: { type: Number, required: true },
  items: { type: [OrderItemSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export const Order = model<IOrder>('Order', OrderSchema);
