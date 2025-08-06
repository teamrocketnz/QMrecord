import React, { useState, useRef, useEffect } from 'react';
import { Part, FieldVisibility } from '../types';
import { Grid, Save, Plus, Trash2, Upload } from 'lucide-react';

interface SpreadsheetInputProps {
  onAddParts: (parts: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  fieldVisibility: FieldVisibility;
  existingParts?: Part[];
  onImportToExisting?: (parts: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

interface SpreadsheetRow {
  id: string;
  partNumber: string;
  partDescription: string;
  supplier: string;
  deliveryDate: string;
  batchNumberBox: string;
  batchDateCode: string;
  count: string;
  expectedCount: string;
  sapPlaced: boolean;
  sapReleased: boolean;
  comments: string;
  notes: string;
  inspectorName: string;
  inspectionDate: string;
  qualityStatus: 'pending' | 'pass' | 'fail' | 'hold';
  purchaseOrder: string;
  storageLocation: string;
  expiryDate: string;
  certificateCompliance: string;
  nonConformance: string;
}

export function SpreadsheetInput({ onAddParts, fieldVisibility, existingParts = [], onImportToExisting }: SpreadsheetInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<SpreadsheetRow[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ rowId: string; field: string } | null>(null);
  const [importMode, setImportMode] = useState<'new' | 'existing'>('new');
  const tableRef = useRef<HTMLDivElement>(null);

  const createEmptyRow = (): SpreadsheetRow => ({
    id: crypto.randomUUID(),
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

  useEffect(() => {
    if (isOpen && rows.length === 0) {
      setRows([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
    }
  }, [isOpen]);

  const loadExistingParts = () => {
    if (existingParts.length === 0) {
      alert('No existing parts to load.');
      return;
    }

    const loadedRows = existingParts.map(part => ({
      id: crypto.randomUUID(),
      partNumber: part.partNumber,
      partDescription: part.partDescription,
      supplier: part.supplier,
      deliveryDate: part.deliveryDate,
      batchNumberBox: part.batchNumberBox || '',
      batchDateCode: part.batchDateCode,
      count: part.count.toString(),
      expectedCount: part.expectedCount?.toString() || '',
      sapPlaced: part.sapPlaced,
      sapReleased: part.sapReleased,
      comments: part.comments,
      notes: part.notes,
      inspectorName: part.inspectorName,
      inspectionDate: part.inspectionDate,
      qualityStatus: part.qualityStatus,
      purchaseOrder: part.purchaseOrder || '',
      storageLocation: part.storageLocation || '',
      expiryDate: part.expiryDate || '',
      certificateCompliance: part.certificateCompliance || '',
      nonConformance: part.nonConformance || '',
    }));

    setRows(loadedRows);
    setImportMode('existing');
  };

  const addRow = () => {
    setRows(prev => [...prev, createEmptyRow()]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(row => row.id !== rowId));
    }
  };

  const updateCell = (rowId: string, field: keyof SpreadsheetRow, value: string | boolean) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowId: string, field: string) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const visibleFields = getVisibleFields();
      const currentFieldIndex = visibleFields.indexOf(field);
      const currentRowIndex = rows.findIndex(row => row.id === rowId);

      if (e.key === 'Tab') {
        if (currentFieldIndex < visibleFields.length - 1) {
          // Move to next field in same row
          setSelectedCell({ rowId, field: visibleFields[currentFieldIndex + 1] });
        } else if (currentRowIndex < rows.length - 1) {
          // Move to first field of next row
          setSelectedCell({ rowId: rows[currentRowIndex + 1].id, field: visibleFields[0] });
        }
      } else if (e.key === 'Enter') {
        if (currentRowIndex < rows.length - 1) {
          // Move to same field in next row
          setSelectedCell({ rowId: rows[currentRowIndex + 1].id, field });
        } else {
          // Add new row and move to it
          const newRow = createEmptyRow();
          setRows(prev => [...prev, newRow]);
          setTimeout(() => {
            setSelectedCell({ rowId: newRow.id, field });
          }, 0);
        }
      }
    }
  };

  const getVisibleFields = () => {
    const allFields = [
      'partNumber',
      ...(fieldVisibility.partDescription ? ['partDescription'] : []),
      ...(fieldVisibility.supplier ? ['supplier'] : []),
      ...(fieldVisibility.deliveryDate ? ['deliveryDate'] : []),
      ...(fieldVisibility.batchNumberBox ? ['batchNumberBox'] : []),
      ...(fieldVisibility.batchDateCode ? ['batchDateCode'] : []),
      ...(fieldVisibility.count ? ['count'] : []),
      ...(fieldVisibility.expectedCount ? ['expectedCount'] : []),
      ...(fieldVisibility.inspectorName ? ['inspectorName'] : []),
      ...(fieldVisibility.inspectionDate ? ['inspectionDate'] : []),
      ...(fieldVisibility.qualityStatus ? ['qualityStatus'] : []),
      ...(fieldVisibility.comments ? ['comments'] : []),
      ...(fieldVisibility.notes ? ['notes'] : []),
      ...(fieldVisibility.purchaseOrder ? ['purchaseOrder'] : []),
      ...(fieldVisibility.storageLocation ? ['storageLocation'] : []),
      ...(fieldVisibility.expiryDate ? ['expiryDate'] : []),
      ...(fieldVisibility.certificateCompliance ? ['certificateCompliance'] : []),
      ...(fieldVisibility.nonConformance ? ['nonConformance'] : []),
    ];
    return allFields;
  };

  const handleSave = () => {
    const validRows = rows.filter(row => row.partNumber.trim() !== '');
    
    if (validRows.length === 0) {
      alert('Please enter at least one part with a part number.');
      return;
    }

    const partsToAdd = validRows.map(row => ({
      partNumber: row.partNumber,
      partDescription: row.partDescription,
      supplier: row.supplier,
      deliveryDate: row.deliveryDate,
      batchNumberBox: row.batchNumberBox,
      batchDateCode: row.batchDateCode,
      count: parseInt(row.count) || 0,
      expectedCount: row.expectedCount ? parseInt(row.expectedCount) : undefined,
      sapPlaced: row.sapPlaced,
      sapReleased: row.sapReleased,
      comments: row.comments,
      notes: row.notes,
      inspectorName: row.inspectorName,
      inspectionDate: row.inspectionDate,
      qualityStatus: row.qualityStatus,
      purchaseOrder: row.purchaseOrder,
      storageLocation: row.storageLocation,
      expiryDate: row.expiryDate,
      certificateCompliance: row.certificateCompliance,
      nonConformance: row.nonConformance,
    }));

    if (importMode === 'existing' && onImportToExisting) {
      onImportToExisting(partsToAdd);
    } else {
      onAddParts(partsToAdd);
    }
    
    setRows([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
    setImportMode('new');
    setIsOpen(false);
  };

  const renderCellContent = (row: SpreadsheetRow, field: keyof SpreadsheetRow, label: string) => {
    const isSelected = selectedCell?.rowId === row.id && selectedCell?.field === field;
    
    if (field === 'qualityStatus') {
      return (
        <select
          value={row[field]}
          onChange={(e) => updateCell(row.id, field, e.target.value as any)}
          onFocus={() => setSelectedCell({ rowId: row.id, field })}
          onKeyDown={(e) => handleKeyDown(e, row.id, field)}
          className={`w-full h-8 px-1 sm:px-2 border-0 focus:ring-2 focus:ring-blue-500 text-xs ${
            isSelected ? 'bg-blue-50' : 'bg-white'
          }`}
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
        <div className="flex justify-center py-2">
          <input
            type="checkbox"
            checked={row[field] as boolean}
            onChange={(e) => updateCell(row.id, field, e.target.checked)}
            onFocus={() => setSelectedCell({ rowId: row.id, field })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      );
    }

    const inputType = field === 'deliveryDate' || field === 'inspectionDate' || field === 'expiryDate' ? 'date' : 
                     field === 'count' || field === 'expectedCount' ? 'number' : 'text';

    return (
      <input
        type={inputType}
        value={row[field] as string}
        onChange={(e) => updateCell(row.id, field, e.target.value)}
        onFocus={() => setSelectedCell({ rowId: row.id, field })}
        onKeyDown={(e) => handleKeyDown(e, row.id, field)}
        className={`w-full h-8 px-1 sm:px-2 border-0 focus:ring-2 focus:ring-blue-500 text-xs ${
          isSelected ? 'bg-blue-50' : 'bg-white'
        } ${field === 'partNumber' ? 'font-medium' : ''}`}
        placeholder={field === 'partNumber' ? 'Required' : ''}
      />
    );
  };

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span>Spreadsheet Input</span>
        </button>
      </div>
    );
  }

  const visibleFields = getVisibleFields();

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Grid className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Spreadsheet Input</h2>
                <p className="text-sm text-gray-600">Enter multiple parts quickly using spreadsheet-style input</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={addRow}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Row</span>
                </button>
                {existingParts.length > 0 && (
                  <button
                    onClick={loadExistingParts}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm font-medium transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Load Existing Parts</span>
                  </button>
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                Use Tab to move right, Enter to move down
              </span>
            </div>
            {importMode === 'existing' && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg mt-2 sm:mt-0">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="text-xs sm:text-sm text-purple-700 font-medium">Editing existing parts</span>
              </div>
            )}
          </div>

          {/* Mobile Instructions */}
          <div className="block sm:hidden mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-1">📱 Mobile Tip:</p>
            <p className="text-xs text-blue-600">Scroll horizontally to see all columns. Tap cells to edit.</p>
          </div>

          <div ref={tableRef} className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 sticky top-0 z-10">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-left w-8 bg-gray-50 sticky left-0 z-20">
                    #
                  </th>
                  {visibleFields.map((field, index) => (
                    <th key={field} className={`border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-left min-w-24 ${
                      field === 'partNumber' ? 'sticky left-8 z-20 bg-gray-50' : ''
                    } ${index === 0 && field !== 'partNumber' ? 'min-w-32' : ''}`}>
                      {field === 'partNumber' ? 'Part #*' :
                       field === 'partDescription' ? 'Description' :
                       field === 'deliveryDate' ? 'Delivery Date' :
                       field === 'batchNumberBox' ? 'Batch # (Box)' :
                       field === 'batchDateCode' ? 'Batch/Date Code' :
                       field === 'expectedCount' ? 'Expected Count' :
                       field === 'sapPlaced' ? 'SAP Placed' :
                       field === 'sapReleased' ? 'SAP Released' :
                       field === 'inspectorName' ? 'Inspector' :
                       field === 'inspectionDate' ? 'Inspection Date' :
                       field === 'qualityStatus' ? 'Quality' :
                       field === 'purchaseOrder' ? 'PO' :
                       field === 'storageLocation' ? 'Storage' :
                       field === 'expiryDate' ? 'Expiry' :
                       field === 'certificateCompliance' ? 'Certificate' :
                       field === 'nonConformance' ? 'Non-Conformance' :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 text-center w-12 sticky right-0 bg-gray-50 z-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 text-xs text-gray-500 text-center bg-gray-50 sticky left-0 z-10">
                      {index + 1}
                    </td>
                    {visibleFields.map((field, fieldIndex) => 
                      <td key={field} className={`border border-gray-300 p-0 ${
                        field === 'partNumber' ? 'sticky left-8 z-10 bg-white' : ''
                      }`}>
                        {renderCellContent(row, field as keyof SpreadsheetRow, field)}
                      </td>
                    )}
                    <td className="border border-gray-300 p-1 text-center sticky right-0 bg-white z-10">
                      <button
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                importMode === 'existing' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{importMode === 'existing' ? 'Update Existing Parts' : 'Save All Parts'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}