import { useState } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const scanDocument = async (file) => {
    setIsScanning(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      // Parse the text
      const text = result.data.text;
      const parsedData = parseOCRText(text);
      
      return parsedData;
    } catch (error) {
      console.error('OCR Error:', error);
      return null;
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  };

  const parseOCRText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const items = [];
    
    lines.forEach(line => {
      const match = line.match(/(.+?)\s+(\d+)\s*(pcs|kg|box|ltr|units?)/i);
      
      if (match) {
        items.push({
          id: Date.now() + Math.random(),
          productName: match[1].trim(),
          expectedQty: parseInt(match[2]),
          receivedQty: parseInt(match[2]),
          unit: match[3].toLowerCase()
        });
      }
    });
    
    return items;
  };

  return { scanDocument, isScanning, progress };
}
