export type MerchantRole =
  | "owner"
  | "manager"
  | "cashier"
  | "kitchen"
  | "waiter";

export type MerchantRestaurant = {
  id: string;
  name: string;
  slug: string;
  businessEmail: string | null;
  whatsappNumber: string | null;
  status: string;
  isPublished: boolean;
  defaultCurrency: string;
};

export type MerchantBranch = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  area: string | null;
  city: string | null;
  postalCode: string | null;
  status: string;
};

export type MerchantContext = {
  userId: string;
  restaurantId: string;
  role: MerchantRole;
  restaurant: MerchantRestaurant;
  branch: MerchantBranch | null;
};