// pages/index.js
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [mood, setMood] = useState('motivation');
  const [region, setRegion] = useState('none');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);

  async function handleGenerate(e) {
    e && e.preventDefault();
    if (!subject.trim()) return;
    setLoading(true);
    setVariants([]);
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mood, region })
      });
      const data = await r.json();
      if (r.ok) setVariants(data.variants || []);
      else console.error('API err', data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const copyText = async (t) => {
    try {
      await navigator.clipboard.writeText(t);
      alert('Copied to clipboard');
    } catch (_) { /* ignore */ }
  };

  const moods = ['attitude','motivation','love','breakup','gym','travel','cute','savage','aesthetic','sad','happy','alone','boss','genz','calm'];
  const regions = ['none','gujarati','hindi','punjabi','marathi','bengali','telugu','tamil'];

  return (
    <>
      <Head>
        <title>FunCaption — Generate Viral Captions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight:'100vh', background:'#0a0e27', color:'white', fontFamily:'Inter, sans-serif' }}>
        <section style={{ padding:'3rem 1rem', textAlign:'center' }}>
          <h1 style={{ fontSize: '2rem', color:'#00ffff', marginBottom:'1rem' }}>FunCaption — Hack Instagram Algorithm</h1>
          <form onSubmit={handleGenerate} style={{ maxWidth:700, margin:'0 auto', display:'grid', gap:16 }}>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="What's your post about?" style={{ padding:12, borderRadius:8, border:'2px solid rgba(0,255,255,0.15)', background:'rgba(0,0,0,0.6)', color:'white' }} required />
            <select value={mood} onChange={e=>setMood(e.target.value)} style={{ padding:12, borderRadius:8, background:'rgba(0,0,0,0.6)', color:'white' }}>
              {moods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={region} onChange={e=>setRegion(e.target.value)} style={{ padding:12, borderRadius:8, background:'rgba(0,0,0,0.6)', color:'white' }}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" disabled={loading} style={{ padding:14, borderRadius:10, background: loading ? 'gray' : 'linear-gradient(135deg,#8a2be2,#00ffff)', fontWeight:900, color:'white' }}>{loading ? 'Generating...' : 'Generate'}</button>
          </form>
        </section>

        <section style={{ maxWidth:900, margin:'2rem auto', padding:'0 1rem' }}>
          {variants.length === 0 ? (
            <div style={{ color:'#9aa', textAlign:'center' }}>No captions generated yet — try one.</div>
          ) : (
            variants.map((v,i) => {
              const isPremium = v.premium === true && i === 0;
              return (
                <div key={i} style={{
                  marginBottom:20,
                  padding:20,
                  borderRadius:12,
                  background: isPremium ? 'linear-gradient(135deg, rgba(138,43,226,0.12), rgba(0,255,255,0.08))' : 'rgba(0,0,0,0.5)',
                  border: isPremium ? '2px solid linear-gradient(135deg,#ffd700,#ff7a00)' : '1px solid rgba(255,255,255,0.03)',
                  boxShadow: isPremium ? '0 10px 30px rgba(138,43,226,0.12)' : 'none'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <div style={{ fontSize:12, color:'#00ffff', fontWeight:800 }}>Caption {i+1} {isPremium && '— PREMIUM'}</div>
                    <div style={{ fontSize:12, color:'#c0c0c0' }}>{v.regionLabel || ''}</div>
                  </div>
                  <pre style={{ whiteSpace:'pre-wrap', fontSize:16, lineHeight:1.6, color:'#e6e6e6' }}>{v.caption}</pre>
                  <div style={{ marginTop:12, display:'flex', gap:8 }}>
                    <button onClick={()=>copyText(v.caption)} style={{ padding:'10px 14px', borderRadius:8, border:'none', background:isPremium ? 'linear-gradient(135deg,#ffd700,#ff7a00)' : 'linear-gradient(135deg,#8a2be2,#00ffff)', color:'#000', fontWeight:800, cursor:'pointer' }}>{isPremium ? 'COPY PREMIUM' : 'COPY'}</button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </>
  );
}
