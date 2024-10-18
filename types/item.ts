export interface ItemForSaleType {
    brandName: string;
    type: string;
    price: string | number;
    quantity: string | number;
    colors: string[];
    sizes: string[];
    materialDetail?: string;
    promoCodes: Array<{ code: string; discount: string | number }>;
    careDetails: string[];
    additionalCareDetails?: string;
    maxTemp?: string | number;
    maxTempF?: string | number;
    deliveryStartDate: string;
    deliveryEndDate: string;
    images: (string | File)[];
  }