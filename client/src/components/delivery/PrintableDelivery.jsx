// components/delivery/PrintableDelivery.jsx
import React from 'react';

export default function PrintableDelivery({ delivery }) {
  if (!delivery) return null;

  return (
    <div className="print-only">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
          }
          @page {
            margin: 20mm;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      <div style={{ fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Delivery Note</h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>Delivery ID: {delivery.id}</p>
        </div>

        {/* Customer & Delivery Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Customer Details
            </h2>
            <div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{delivery.customer.name}</p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '2px' }}>{delivery.customer.email}</p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '2px' }}>{delivery.customer.phone}</p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>{delivery.customer.address}</p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Delivery Information
            </h2>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Warehouse:</span>{' '}
                <span style={{ fontWeight: '600' }}>{delivery.warehouse}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Scheduled:</span>{' '}
                <span style={{ fontWeight: '600' }}>
                  {new Date(delivery.scheduledDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Expected Delivery:</span>{' '}
                <span style={{ fontWeight: '600' }}>
                  {new Date(delivery.expectedDeliveryDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Total Value:</span>{' '}
                <span style={{ fontWeight: '700', fontSize: '16px' }}>{delivery.value}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase' }}>
            Items
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>SKU</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {delivery.items?.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#64748b' }}>{item.sku}</td>
                  <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>₹{item.price.toLocaleString()}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            Generated on {new Date().toLocaleDateString('en-IN')} | StockMaster Pro
          </p>
        </div>
      </div>
    </div>
  );
}
