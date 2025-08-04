export interface Part {
  id: string;
  partNumber: string;
  partDescription: string;
  supplier: string;
  deliveryDate: string;
  batchNumberBox?: string;
  batchDateCode: string;
  count: number;
  expectedCount?: number;
  sapPlaced: boolean;
  sapReleased: boolean;
  comments: string;
  notes: string;
  inspectorName: string;
  inspectionDate: string;
  qualityStatus: 'pending' | 'pass' | 'fail' | 'hold';
  purchaseOrder?: string;
  storageLocation?: string;
  expiryDate?: string;
  certificateCompliance?: string;
  nonConformance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldVisibility {
  partDescription: boolean;
  supplier: boolean;
  deliveryDate: boolean;
  batchNumberBox: boolean;
  batchDateCode: boolean;
  count: boolean;
  expectedCount: boolean;
  sapPlaced: boolean;
  sapReleased: boolean;
  comments: boolean;
  notes: boolean;
  inspectorName: boolean;
  inspectionDate: boolean;
  qualityStatus: boolean;
  purchaseOrder: boolean;
  storageLocation: boolean;
  expiryDate: boolean;
  certificateCompliance: boolean;
  nonConformance: boolean;
}

export const defaultFieldVisibility: FieldVisibility = {
  partDescription: true,
  supplier: true,
  deliveryDate: true,
  batchNumberBox: true,
  batchDateCode: true,
  count: true,
  expectedCount: true,
  sapPlaced: true,
  sapReleased: true,
  comments: true,
  notes: true,
  inspectorName: true,
  inspectionDate: true,
  qualityStatus: true,
  purchaseOrder: false,
  storageLocation: false,
  expiryDate: false,
  certificateCompliance: false,
  nonConformance: false,
};