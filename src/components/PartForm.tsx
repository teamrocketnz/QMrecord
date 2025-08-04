import React, { useState } from 'react';
import { Part, FieldVisibility } from '../types';
import { Plus, Save } from 'lucide-react';

interface PartFormProps {
  onAddPart: (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => void;
  fieldVisibility: FieldVisibility;
}

export function PartForm({ onAddPart, fieldVisibility }: PartFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    partNumber: '',
    partDescription: '',
    supplier: '',
    deliveryDate: '',
    batchNumberBox: '',
    batchDateCode: '',
    count: '',
    expectedCount: '',
    sapPlaced: false,
    sapReleased: false,
    comments: '',
    notes: '',
    inspectorName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    qualityStatus: 'pending' as const,
    purchaseOrder: '',
    storageLocation: '',
    expiryDate: '',
    certificateCompliance: '',
    nonConformance: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partNumber.trim()) {
      alert('Part Number is required');
      return;
    }

    onAddPart({
      ...formData,
      count: parseInt(formData.count) || 0,
      expectedCount: formData.expectedCount ? parseInt(formData.expectedCount) : undefined,
    });

    // Reset form
    setFormData({
      partNumber: '',
      partDescription: '',
      supplier: '',
      deliveryDate: '',
      batchNumberBox: '',
      batchDateCode: '',
      count: '',
      expectedCount: '',
      sapPlaced: false,
      sapReleased: false,
      comments: '',
      notes: '',
      inspectorName: '',
      inspectionDate: new Date().toISOString().split('T')[0],
      qualityStatus: 'pending',
      purchaseOrder: '',
      storageLocation: '',
      expiryDate: '',
      certificateCompliance: '',
      nonConformance: '',
    });
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Part</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Part</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {fieldVisibility.partDescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Description</label>
                <input
                  type="text"
                  name="partDescription"
                  value={formData.partDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.supplier && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.deliveryDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date to Moffat</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.batchNumberBox && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number (Box)</label>
                <input
                  type="text"
                  name="batchNumberBox"
                  value={formData.batchNumberBox}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.batchDateCode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch/Date Code (Part)</label>
                <input
                  type="text"
                  name="batchDateCode"
                  value={formData.batchDateCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.count && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.expectedCount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Count</label>
                <input
                  type="number"
                  name="expectedCount"
                  value={formData.expectedCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.inspectorName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspector Name</label>
                <input
                  type="text"
                  name="inspectorName"
                  value={formData.inspectorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.inspectionDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.qualityStatus && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Status</label>
                <select
                  name="qualityStatus"
                  value={formData.qualityStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="hold">Hold</option>
                </select>
              </div>
            )}

            {fieldVisibility.purchaseOrder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order</label>
                <input
                  type="text"
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.storageLocation && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.expiryDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.certificateCompliance && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate of Compliance</label>
                <input
                  type="text"
                  name="certificateCompliance"
                  value={formData.certificateCompliance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.nonConformance && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Non-Conformance</label>
                <input
                  type="text"
                  name="nonConformance"
                  value={formData.nonConformance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* SAP Status Checkboxes */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SAP Status</h3>
            <div className="flex space-x-6">
              {fieldVisibility.sapPlaced && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sapPlaced"
                    checked={formData.sapPlaced}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SAP Placed</span>
                </label>
              )}

              {fieldVisibility.sapReleased && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sapReleased"
                    checked={formData.sapReleased}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SAP Released</span>
                </label>
              )}
            </div>
          </div>

          {/* Comments and Notes */}
          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldVisibility.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {fieldVisibility.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Part</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}