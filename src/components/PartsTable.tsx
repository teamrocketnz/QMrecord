import React, { useState } from 'react';
import { Part, FieldVisibility } from '../types';
import { Search, Download, Edit, Trash2, Save, X } from 'lucide-react';

interface PartsTableProps {
  parts: Part[];
  fieldVisibility: FieldVisibility;
  onUpdatePart: (partId: string, updates: Partial<Part>) => void;
  onDeletePart: (partId: string) => void;
}

export function PartsTable({ parts, fieldVisibility, onUpdatePart, onDeletePart }: PartsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Part>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [editingPart, setEditingPart] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Part>>({});

  const filteredParts = parts.filter(part =>
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedParts = [...filteredParts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const startEdit = (part: Part) => {
    setEditingPart(part.id);
    setEditFormData({
      partNumber: part.partNumber,
      partDescription: part.partDescription,
      supplier: part.supplier,
      deliveryDate: part.deliveryDate,
      batchNumberBox: part.batchNumberBox,
      batchDateCode: part.batchDateCode,
      count: part.count,
      expectedCount: part.expectedCount,
      sapPlaced: part.sapPlaced,
      sapReleased: part.sapReleased,
      comments: part.comments,
      notes: part.notes,
      inspectorName: part.inspectorName,
      inspectionDate: part.inspectionDate,
      qualityStatus: part.qualityStatus,
      purchaseOrder: part.purchaseOrder,
      storageLocation: part.storageLocation,
      expiryDate: part.expiryDate,
      certificateCompliance: part.certificateCompliance,
      nonConformance: part.nonConformance,
    });
  };

  const saveEdit = () => {
    if (editingPart && editFormData.partNumber?.trim()) {
      onUpdatePart(editingPart, editFormData);
      setEditingPart(null);
      setEditFormData({});
    }
  };

  const cancelEdit = () => {
    setEditingPart(null);
    setEditFormData({});
  };

  const handleEditChange = (field: keyof Part, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      hold: 'bg-orange-100 text-orange-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Part Number', 'Description', 'Supplier', 'Delivery Date', 'Count', 'SAP Placed', 'SAP Released', 'Quality Status'];
    const csvContent = [
      headers.join(','),
      ...sortedParts.map(part => [
        part.partNumber,
        part.partDescription,
        part.supplier,
        part.deliveryDate,
        part.count,
        part.sapPlaced ? 'Yes' : 'No',
        part.sapReleased ? 'Yes' : 'No',
        part.qualityStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: keyof Part) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSapStatus = (partId: string, field: 'sapPlaced' | 'sapReleased', currentValue: boolean) => {
    onUpdatePart(partId, { [field]: !currentValue, updatedAt: new Date().toISOString() });
  };

  const renderEditableCell = (part: Part, field: keyof Part, isEditing: boolean) => {
    if (!isEditing) {
      // Display mode
      if (field === 'qualityStatus') {
        return getStatusBadge(part[field] as string);
      }
      if (field === 'sapPlaced' || field === 'sapReleased') {
        return (
          <button
            onClick={() => toggleSapStatus(part.id, field, part[field] as boolean)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              part[field] 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {part[field] ? 'Yes' : 'No'}
          </button>
        );
      }
      if (field === 'deliveryDate' || field === 'inspectionDate' || field === 'expiryDate') {
        return part[field] ? new Date(part[field] as string).toLocaleDateString() : '-';
      }
      if (field === 'count') {
        return (
          <div>
            <div className="text-sm text-gray-900">{part.count}</div>
            {part.expectedCount && (
              <div className="text-xs text-gray-500">Expected: {part.expectedCount}</div>
            )}
          </div>
        );
      }
      return part[field] as string || '-';
    }

    // Edit mode
    if (field === 'qualityStatus') {
      return (
        <select
          value={editFormData[field] as string || ''}
          onChange={(e) => handleEditChange(field, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
          <option value="hold">Hold</option>
        </select>
      );
    }
    if (field === 'sapPlaced' || field === 'sapReleased') {
      return (
        <input
          type="checkbox"
          checked={editFormData[field] as boolean || false}
          onChange={(e) => handleEditChange(field, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      );
    }
    if (field === 'count' || field === 'expectedCount') {
      return (
        <input
          type="number"
          value={editFormData[field] as number || ''}
          onChange={(e) => handleEditChange(field, parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    if (field === 'deliveryDate' || field === 'inspectionDate' || field === 'expiryDate') {
      return (
        <input
          type="date"
          value={editFormData[field] as string || ''}
          onChange={(e) => handleEditChange(field, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    return (
      <input
        type="text"
        value={editFormData[field] as string || ''}
        onChange={(e) => handleEditChange(field, e.target.value)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">Parts Inventory</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('partNumber')}
              >
                Part Number
              </th>
              {fieldVisibility.partDescription && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              )}
              {fieldVisibility.supplier && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
              )}
              {fieldVisibility.deliveryDate && (
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('deliveryDate')}
                >
                  Delivery Date
                </th>
              )}
              {fieldVisibility.count && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
              )}
              {fieldVisibility.batchDateCode && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Code
                </th>
              )}
              {fieldVisibility.sapPlaced && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SAP Placed
                </th>
              )}
              {fieldVisibility.sapReleased && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SAP Released
                </th>
              )}
              {fieldVisibility.qualityStatus && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedParts.map((part) => {
              const isEditing = editingPart === part.id;
              return (
                <tr key={part.id} className={`${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.partNumber || ''}
                        onChange={(e) => handleEditChange('partNumber', e.target.value)}
                        className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.partNumber}</div>
                        <div className="text-xs text-gray-500">{new Date(part.createdAt).toLocaleDateString()}</div>
                      </div>
                    )}
                  </td>
                  {fieldVisibility.partDescription && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'partDescription', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.supplier && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'supplier', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.deliveryDate && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'deliveryDate', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.count && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'count', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.batchDateCode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'batchDateCode', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.sapPlaced && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'sapPlaced', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.sapReleased && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'sapReleased', isEditing)}
                    </td>
                  )}
                  {fieldVisibility.qualityStatus && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableCell(part, 'qualityStatus', isEditing)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Save changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(part)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit part"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this part?')) {
                              onDeletePart(part.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete part"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedParts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No parts found. Add some parts to get started.</p>
        </div>
      )}
    </div>
  );
}