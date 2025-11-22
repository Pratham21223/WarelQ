export async function getReceipts(filters) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      referenceNo: 'RCP-2025-001',
      supplier: 'ABC Suppliers Ltd.',
      warehouse: 'Main Warehouse',
      date: '2025-11-22',
      status: 'validated',
      itemCount: 5
    }
  ];
}

export async function createReceipt(data) {
  console.log('Creating receipt:', data);
  return { success: true, id: Date.now() };
}
