export function parseOCRText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  
  lines.forEach(line => {
    const match = line.match(/(.+?)\s+(\d+)\s*(pcs|kg|box|ltr|units?|pieces?)/i);
    
    if (match) {
      items.push({
        id: Date.now() + Math.random(),
        productName: match[1].trim(),
        expectedQty: parseInt(match[2]),
        receivedQty: parseInt(match[2]),
        unit: match[3].toLowerCase().replace(/s$/, '')
      });
    }
  });
  
  return items;
}
