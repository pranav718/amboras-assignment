'use client';

import type { TopProduct } from '@/lib/types';


interface TopProductsProps {
  data: TopProduct[];
  loading?: boolean;
}

const PRODUCT_NAMES: Record<string, string> = {
  prod_001: 'Wireless Earbuds Pro',
  prod_002: 'Phone Case Ultra',
  prod_003: 'USB-C Hub 7-in-1',
  prod_004: 'Laptop Stand Adjustable',
  prod_005: 'Mechanical Keyboard RGB',
  prod_006: 'Mouse Pad XXL',
  prod_007: 'Webcam HD 1080p',
  prod_008: 'Monitor Light Bar',
  prod_009: 'Cable Management Kit',
  prod_010: 'Desk Organizer Premium',
  prod_011: 'Wireless Charger Pad',
  prod_012: 'Bluetooth Speaker Mini',
  prod_013: 'Smart Plug 4-Pack',
  prod_014: 'LED Desk Lamp',
  prod_015: 'Noise Cancelling Headphones',
  prod_016: 'Portable SSD 1TB',
  prod_017: 'Ergonomic Mouse',
  prod_018: 'Screen Protector 3-Pack',
  prod_019: 'Power Bank 20000mAh',
  prod_020: 'Gaming Headset',
};

const RANK_COLORS = ['#FFFFFF', '#A3A3A3', '#6F6F6F']; 

export default function TopProducts({ data, loading }: TopProductsProps) {
  if (loading) {
    return (
      <div className="dashboard-card animate-in" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Top Products by Revenue</h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '40px', marginBottom: '16px' }} />
        ))}
      </div>
    );
  }

  const maxRevenue = data.length > 0 ? Math.max(...data.map((p) => p.revenue)) : 1;

  return (
    <div className="dashboard-card animate-in animate-delay-3" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
         Top Products by Revenue
      </h3>

      {data.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#6F6F6F', fontSize: '14px' }}>
          No product data for this period
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((product, index) => (
            <div
              key={product.product_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'background 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#111111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: index < 3 ? RANK_COLORS[index] : '#333333',
                  width: '24px',
                  textAlign: 'center',
                }}
              >
                #{index + 1}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {PRODUCT_NAMES[product.product_id] || product.product_id}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', flexShrink: 0 }}>
                    ${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div
                  style={{
                    height: '2px',
                    background: '#F3F4F6',
                    borderRadius: '1px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(product.revenue / maxRevenue) * 100}%`,
                      background: '#FFFFFF',
                      borderRadius: '1px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color: '#A3A3A3',
                  minWidth: '60px',
                  textAlign: 'right',
                }}
              >
                {product.quantity_sold} sold
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
