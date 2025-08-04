import React from 'react';
import { FieldVisibility } from '../types';
import { X, Eye, EyeOff } from 'lucide-react';

interface FieldSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  fieldVisibility: FieldVisibility;
  onUpdateVisibility: (field: keyof FieldVisibility, visible: boolean) => void;
}

export function FieldSettings({ isOpen, onClose, fieldVisibility, onUpdateVisibility }: FieldSettingsProps) {
  if (!isOpen) return null;

  const fieldLabels: Record<keyof FieldVisibility, string> = {
    partDescription: 'Part Description',
    supplier: 'Supplier',
    deliveryDate: 'Delivery Date to Moffat',
    batchNumberBox: 'Batch Number (Box)',
    batchDateCode: 'Batch/Date Code (Part)',
    count: 'Count',
    expectedCount: 'Expected Count',
    sapPlaced: 'SAP Placed',
    sapReleased: 'SAP Released',
    comments: 'Comments',
    notes: 'Notes',
    inspectorName: 'Inspector Name',
    inspectionDate: 'Inspection Date',
    qualityStatus: 'Quality Status',
    purchaseOrder: 'Purchase Order',
    storageLocation: 'Storage Location',
    expiryDate: 'Expiry Date',
    certificateCompliance: 'Certificate of Compliance',
    nonConformance: 'Non-Conformance',
  };

  const coreFields = ['partDescription', 'supplier', 'deliveryDate', 'batchNumberBox', 'batchDateCode', 'count', 'expectedCount', 'sapPlaced', 'sapReleased', 'comments', 'notes', 'inspectorName', 'inspectionDate', 'qualityStatus'];
  const additionalFields = ['purchaseOrder', 'storageLocation', 'expiryDate', 'certificateCompliance', 'nonConformance'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Field Visibility Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Toggle fields to show or hide them in forms and tables.</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Core Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreFields.map((field) => (
                <label key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    {fieldLabels[field as keyof FieldVisibility]}
                  </span>
                  <div className="flex items-center space-x-2">
                    {fieldVisibility[field as keyof FieldVisibility] ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <input
                      type="checkbox"
                      checked={fieldVisibility[field as keyof FieldVisibility]}
                      onChange={(e) => onUpdateVisibility(field as keyof FieldVisibility, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalFields.map((field) => (
                <label key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    {fieldLabels[field as keyof FieldVisibility]}
                  </span>
                  <div className="flex items-center space-x-2">
                    {fieldVisibility[field as keyof FieldVisibility] ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <input
                      type="checkbox"
                      checked={fieldVisibility[field as keyof FieldVisibility]}
                      onChange={(e) => onUpdateVisibility(field as keyof FieldVisibility, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}