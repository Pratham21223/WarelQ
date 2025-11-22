import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, DocumentArrowUpIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useOCR } from '../../hooks/useOCR';

export default function DocumentScanner({ onScanComplete, autoSave = false, onAutoSave }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [savedReceipt, setSavedReceipt] = useState(null);
  const fileInputRef = useRef(null);
  const { scanDocument, isScanning, progress } = useOCR();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setPreviewImage(event.target.result);
    reader.readAsDataURL(file);

    // Scan document
    const scannedData = await scanDocument(file);
    
    if (scannedData && scannedData.length > 0) {
      onScanComplete(scannedData);
      
      // Auto-save if enabled
      if (autoSave && onAutoSave) {
        const receiptData = {
          referenceNo: `RCP-${Date.now()}`,
          supplier: 'Auto-detected Supplier',
          warehouse: 'Main Warehouse',
          expectedDate: new Date().toISOString().split('T')[0],
          status: 'draft',
          lineItems: scannedData
        };
        
        const savedReceipt = await onAutoSave(receiptData);
        setSavedReceipt(savedReceipt);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      {!previewImage ? (
        <div className="text-center">
          <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-base font-medium text-gray-900 mb-1">Scan Delivery Document</h3>
          <p className="text-sm text-gray-500 mb-4">
            {autoSave ? 'Upload to auto-extract and save receipt' : 'Upload an image to auto-fill receipt details'}
          </p>
          
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isScanning}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <CameraIcon className="w-5 h-5 inline mr-2" />
            {isScanning ? `Scanning... ${progress}%` : 'Upload & Scan'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {isScanning && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-2">Processing document and extracting data...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <img src={previewImage} alt="Document" className="max-h-64 mx-auto rounded-lg" />
          <button
            onClick={() => {
              setPreviewImage(null);
              setSavedReceipt(null);
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          
          {savedReceipt ? (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircleIcon className="w-5 h-5" />
                <div>
                  <p className="font-medium">Receipt saved automatically!</p>
                  <p className="text-sm">Reference: {savedReceipt.referenceNo}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-green-600 text-center mt-3">Document scanned successfully!</p>
          )}
        </div>
      )}
    </div>
  );
}
