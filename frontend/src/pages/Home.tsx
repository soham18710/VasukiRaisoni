import React from 'react';
import { QrCode, ShieldCheck, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '24px' }}>
          Never Lose What Matters <br />
          <span className="text-gradient">With Smart QR Tags</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6' }}>
          Secure your valuables with privacy-first QR codes. When someone finds your lost item,
          they simply scan it to help return it safely to you—without exposing your personal details.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
          <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Generate QR Tag
          </button>
          <button className="glass-panel" style={{ 
            padding: '16px 32px', 
            fontSize: '1.1rem', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--surface-border)',
            background: 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600
          }}>
            Learn More
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px',
          textAlign: 'left'
        }}>
          {[
            { icon: QrCode, title: "Instant QR Generation", desc: "Create unique QR codes for your keys, bags, pets, and devices instantly." },
            { icon: ShieldCheck, title: "Privacy First", desc: "No phone numbers exposed. Built-in anonymous messaging system." },
            { icon: MapPin, title: "Smart Location", desc: "Get notified with a location pinpoint when your item's tag is scanned." }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ 
                background: 'rgba(99, 102, 241, 0.1)', 
                width: '48px', height: '48px', 
                borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <feature.icon size={24} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{feature.title}</h3>
              <p className="text-muted" style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
