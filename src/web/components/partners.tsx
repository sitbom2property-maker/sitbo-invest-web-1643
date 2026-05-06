type Partner = {
  name: string;
  logo: string;
};

const partners: Partner[] = [
  { name: 'Bank of Georgia', logo: '/partners/partner-bank-bog.png' },
  { name: 'TBC Bank', logo: '/partners/partner-bank-tbc.png' },
  { name: 'GPI Insurance', logo: '/partners/partner-insurance-gpi.png' },
  { name: 'Ambassadori', logo: '/partners/partner-logo-ambassadori.png' },
  { name: 'Archi', logo: '/partners/partner-logo-archi.png' },
  { name: 'Artex', logo: '/partners/partner-logo-artex.png' },
  { name: 'Eagle Hills', logo: '/partners/partner-logo-eaglehills.png' },
  { name: 'Gumbati', logo: '/partners/partner-logo-gumbati.png' },
  { name: 'One', logo: '/partners/partner-logo-one.png' },
  { name: 'Rogantini', logo: '/partners/partner-logo-rogantini.png' },
  { name: 'Silk Development', logo: '/partners/partner-logo-silkdev.png' },
  { name: 'Tempo', logo: '/partners/partner-logo-tempo.png' },
];

const track = [...partners, ...partners, ...partners];

const css = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(calc(-100% / 3)); }
  }
  .p-track { display: flex; gap: 20px; width: max-content; animation: marquee 50s linear infinite; padding: 16px 0; }
  .p-card {
    width: 280px; height: 120px; flex-shrink: 0;
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.95);
    box-shadow: 0 2px 12px rgba(33,20,26,0.07);
    display: flex; align-items: center; justify-content: center;
    padding: 20px 28px; box-sizing: border-box;
    transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
    cursor: default;
  }
  .p-card:hover {
    box-shadow: 0 8px 32px rgba(33,20,26,0.12), 0 0 0 1.5px rgba(140,178,192,0.5);
    border-color: rgba(140,178,192,0.6);
    transform: translateY(-3px);
  }
  .p-card img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .p-fade-l { position: absolute; left: 0; top: 0; bottom: 0; width: 140px; background: linear-gradient(to right, #FFFBF0 20%, transparent); pointer-events: none; z-index: 2; }
  .p-fade-r { position: absolute; right: 0; top: 0; bottom: 0; width: 140px; background: linear-gradient(to left, #FFFBF0 20%, transparent); pointer-events: none; z-index: 2; }
`;

export function Partners() {
  return (
    <section style={{ background: '#FFFBF0', padding: 'clamp(48px,6vw,96px) 0', overflow: 'hidden' }}>
      <style>{css}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '1px', background: 'rgba(33,20,26,0.3)' }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(33,20,26,0.45)', margin: 0 }}>Trusted Partners</p>
        </div>
        <h2 style={{ fontFamily: 'Jun, serif', fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 400, color: '#21141A', margin: 0 }}>Developer & Banking Partners</h2>
      </div>
      <div style={{ position: 'relative' }}>
        <div className='p-fade-l' />
        <div className='p-fade-r' />
        <div className='p-track'>
          {track.map((item, i) => (
            <div key={i} className='p-card'>
              <img src={item.logo} alt={item.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
