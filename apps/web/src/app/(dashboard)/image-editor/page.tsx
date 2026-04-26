'use client';
import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useImageEditor } from '@/hooks/useImageEditor';
import { useAuthStore } from '@/stores/auth.store';

const EMOJIS = ['😀','😍','🔥','⭐','💯','🎉','❤️','🚀','🌈','💎','👑','✨','🎨','📸','🎯','💪','🙌','🤩','💫','🌟'];
const PRESET_FILTERS = ['original','vivid','cool','warm','noir','sepia','fade','vintage','chrome','dramatic'];
const FONTS = ['Inter','Montserrat','Playfair Display','Pacifico','Roboto','Oswald','Lato','Poppins'];

const SMART_SUGGESTIONS = [
  { id:'portrait',  icon:'🤳', label:'Portrait Glow',    adj:{ brightness:8, contrast:10, saturation:15, blur:0, hue:0, gamma:1.05, pixelate:0, noise:0 }, filter:'original' },
  { id:'product',   icon:'🛍️', label:'Product Clean',   adj:{ brightness:5, contrast:20, saturation:-5,  blur:0, hue:0, gamma:1,    pixelate:0, noise:0 }, filter:'vivid' },
  { id:'food',      icon:'🍜', label:'Food Warm',        adj:{ brightness:5, contrast:10, saturation:25, blur:0, hue:5, gamma:1.1,  pixelate:0, noise:0 }, filter:'warm' },
  { id:'landscape', icon:'🏞️', label:'Landscape Epic',  adj:{ brightness:0, contrast:25, saturation:20, blur:0, hue:0, gamma:1,    pixelate:0, noise:0 }, filter:'dramatic' },
  { id:'moody',     icon:'🌑', label:'Moody Dark',       adj:{ brightness:-15,contrast:30,saturation:-20,blur:0, hue:0, gamma:0.85, pixelate:0, noise:5  }, filter:'noir' },
  { id:'vintage',   icon:'📷', label:'Vintage Film',     adj:{ brightness:-5, contrast:5,  saturation:-15,blur:0, hue:0, gamma:0.95, pixelate:0, noise:20 }, filter:'vintage' },
  { id:'minimal',   icon:'⬜', label:'Minimal Soft',     adj:{ brightness:15, contrast:-10,saturation:-20,blur:0, hue:0, gamma:1.15, pixelate:0, noise:0  }, filter:'fade' },
  { id:'neon',      icon:'🔮', label:'Neon Pop',         adj:{ brightness:5,  contrast:20, saturation:50, blur:0, hue:15,gamma:1,    pixelate:0, noise:0  }, filter:'vivid' },
];

const CANVAS_SIZES = [
  { label:'Square 1:1',   w:1080, h:1080 },
  { label:'Portrait 4:5', w:1080, h:1350 },
  { label:'Story 9:16',   w:1080, h:1920 },
  { label:'Landscape 16:9',w:1920,h:1080 },
  { label:'Twitter',      w:1200, h:628  },
];

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api$/, '');

function ImageEditorInner() {
  const router = useRouter();
  const params = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<'adjust'|'filter'|'text'|'sticker'|'draw'|'shape'|'layers'|'smart'>('smart');
  const [textOpts, setTextOpts] = useState({ text:'Your Text', fontSize:48, fontFamily:'Inter', color:'#ffffff', fontWeight:'bold', stroke:'', strokeWidth:0 });
  const [exportFormat, setExportFormat] = useState<'png'|'jpeg'|'webp'>('png');
  const [exportQuality, setExportQuality] = useState(95);
  const [isSaving,    setIsSaving]    = useState(false);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isDragOver,   setIsDragOver]  = useState(false);

  const { accessToken } = useAuthStore();
  const accessTokenRef = useRef(accessToken);
  useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);
  const ed = useImageEditor();
  const edRef = useRef(ed);
  useEffect(() => { edRef.current = ed; }, [ed]);

  useEffect(() => {
    ed.initCanvas(1080, 1080);
  }, []);

  useEffect(() => {
    if (!ed.isReady) return;
    const url = params.get('imageUrl');
    if (url) ed.loadImage(decodeURIComponent(url));
  }, [ed.isReady]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Sirf image files allowed hain.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) edRef.current.loadImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const handleExport = (toPost = false) => {
    const dataUrl = ed.exportImage(exportFormat, exportQuality / 100);
    if (!dataUrl) return;
    if (toPost) {
      sessionStorage.setItem('zynovexa.aiStudioDraft', JSON.stringify({ mediaUrl: dataUrl, mediaType: 'IMAGE' }));
      toast.success('Image Create Post mein bhej di!');
      router.push('/create?source=editor');
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `zynovexa-edit-${Date.now()}.${exportFormat}`;
    a.click();
    toast.success('Image download ho gayi!');
  };

  const saveToLibrary = useCallback(async () => {
    const dataUrl = edRef.current.exportImage('png', 1);
    if (!dataUrl) { toast.error('Canvas mein koi image nahi hai.'); return; }
    setIsSaving(true);
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `edited-${Date.now()}.png`, { type: 'image/png' });
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'edited-images');
      const resp = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      if (!resp.ok) throw new Error('Upload failed');
      const data = await resp.json();
      const url = data?.data?.url || data?.url || '';
      if (url) toast.success(`✅ Saved! URL: ${url.slice(0,40)}...`);
      else toast.success('✅ Image library mein save ho gayi!');
    } catch (e: any) {
      toast.error('Save failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  }, [accessToken]);

  const applySmartSuggestion = useCallback(async (s: typeof SMART_SUGGESTIONS[0]) => {
    await edRef.current.applyPresetFilter(s.filter);
    await edRef.current.applyAdjustments(s.adj);
    toast.success(`✨ ${s.label} applied!`);
  }, []);

  const changeCanvasSize = useCallback((idx: number) => {
    const size = CANVAS_SIZES[idx];
    setSelectedSize(idx);
    edRef.current.initCanvas(size.w, size.h);
    toast.success(`Canvas: ${size.label}`);
  }, []);

  const adj = ed.adjustments;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#0d0d1a', color:'#fff', fontFamily:'Inter,sans-serif' }}>
      {/* Top Bar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:'#111128', borderBottom:'1px solid rgba(255,255,255,0.08)', flexWrap:'wrap' }}>
        <button onClick={() => router.back()} style={btnStyle('secondary')}>← Back</button>
        <span style={{ fontWeight:700, fontSize:15, marginRight:8 }}>🎨 Image Editor</span>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileUpload} />
        <button onClick={() => fileInputRef.current?.click()} style={btnStyle('secondary')}>📁 Upload Image</button>
        <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto' }}>
          <button onClick={ed.undo} disabled={!ed.canUndo} style={btnStyle('ghost')}>↩ Undo</button>
          <button onClick={ed.redo} disabled={!ed.canRedo} style={btnStyle('ghost')}>↪ Redo</button>
          <button onClick={ed.deleteSelected} style={btnStyle('danger')}>🗑 Delete</button>
          <select value={exportFormat} onChange={e => setExportFormat(e.target.value as any)} style={selectStyle}>
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WEBP</option>
          </select>
          <input type="range" min={50} max={100} value={exportQuality} onChange={e => setExportQuality(+e.target.value)} title={`Quality: ${exportQuality}%`} style={{ width:80 }} />
          <button onClick={() => handleExport(false)} style={btnStyle('primary')}>⬇ Download</button>
          <button onClick={saveToLibrary} disabled={isSaving} style={btnStyle('secondary')}>{isSaving ? '⏳...' : '☁️ Save'}</button>
          <button onClick={() => handleExport(true)} style={btnStyle('success')}>✅ Use in Post</button>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left: Tool Tabs */}
        <div style={{ width:52, background:'#111128', borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:8, gap:4 }}>
          {([
            ['smart','🪄'],['adjust','🎨'],['filter','✨'],['text','T'],['sticker','😀'],['draw','✏️'],['shape','⬛'],['layers','🧅']
          ] as const).map(([id, icon]) => (
            <button key={id} onClick={() => { setActivePanel(id as any); if (id === 'draw') ed.setDrawingMode(true); else ed.setDrawingMode(false); }} title={id}
              style={{ width:40, height:40, borderRadius:8, border:'none', cursor:'pointer', fontSize:18, background: activePanel === id ? 'rgba(99,102,241,0.4)' : 'transparent', color:'#fff' }}>
              {icon}
            </button>
          ))}
        </div>

        {/* Right Panel */}
        <div style={{ width:260, background:'#111128', borderRight:'1px solid rgba(255,255,255,0.08)', overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:12 }}>

          {activePanel === 'smart' && (
            <>
              <label style={labelStyle}>🪄 Smart Suggestions</label>
              <p style={{ fontSize:11, color:'#9ca3af', marginBottom:4 }}>Ek click mein professional look apply karo</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {SMART_SUGGESTIONS.map(s => (
                  <button key={s.id} onClick={() => applySmartSuggestion(s)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(99,102,241,0.2)', background:'rgba(99,102,241,0.07)', color:'#fff', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{s.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop:8 }}>
                <label style={{ ...labelStyle, marginBottom:6, display:'block' }}>📐 Canvas Size</label>
                {CANVAS_SIZES.map((sz, i) => (
                  <button key={i} onClick={() => changeCanvasSize(i)}
                    style={{ display:'block', width:'100%', padding:'7px 10px', marginBottom:4, borderRadius:8, border:`1px solid ${selectedSize===i ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: selectedSize===i ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: selectedSize===i ? '#a78bfa' : '#9ca3af', cursor:'pointer', fontSize:12, textAlign:'left' }}>
                    {sz.label} <span style={{ opacity:0.5, fontSize:11 }}>({sz.w}×{sz.h})</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop:8 }}>
                <label style={{ ...labelStyle, marginBottom:6, display:'block' }}>🔄 Quick Transform</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <button onClick={() => { const fc = ed.fabricRef.current; if (!fc) return; const obj = fc.getActiveObject() || fc.getObjects()[0]; if (obj) { obj.rotate(((obj.angle||0)+90)%360); fc.renderAll(); }}} style={{ ...btnStyle('secondary'), fontSize:11 }}>↻ Rotate 90°</button>
                  <button onClick={() => { const fc = ed.fabricRef.current; if (!fc) return; const obj = fc.getActiveObject() || fc.getObjects()[0]; if (obj) { obj.set({ flipX: !obj.flipX }); fc.renderAll(); }}} style={{ ...btnStyle('secondary'), fontSize:11 }}>⇄ Flip H</button>
                  <button onClick={() => { const fc = ed.fabricRef.current; if (!fc) return; const obj = fc.getActiveObject() || fc.getObjects()[0]; if (obj) { obj.set({ flipY: !obj.flipY }); fc.renderAll(); }}} style={{ ...btnStyle('secondary'), fontSize:11 }}>⇅ Flip V</button>
                  <button onClick={() => { const fc = ed.fabricRef.current; if (!fc) return; fc.getObjects().forEach((o:any) => fc.remove(o)); fc.renderAll(); toast.success('Canvas cleared');}} style={{ ...btnStyle('danger'), fontSize:11 }}>🗑 Clear All</button>
                </div>
              </div>
            </>
          )}

          {activePanel === 'adjust' && (
            <>
              <label style={labelStyle}>Adjustments</label>
              {([
                ['Brightness', 'brightness', -100, 100],
                ['Contrast', 'contrast', -100, 100],
                ['Saturation', 'saturation', -100, 100],
                ['Blur', 'blur', 0, 100],
                ['Hue', 'hue', 0, 360],
                ['Gamma', 'gamma', 0.2, 2.2],
                ['Pixelate', 'pixelate', 0, 20],
                ['Noise', 'noise', 0, 200],
              ] as [string, keyof typeof adj, number, number][]).map(([label, key, min, max]) => (
                <div key={key}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9ca3af', marginBottom:2 }}>
                    <span>{label}</span>
                    <span>{(adj as any)[key]}</span>
                  </div>
                  <input type="range" min={min} max={max} step={key === 'gamma' ? 0.05 : 1}
                    value={(adj as any)[key]}
                    onChange={e => ed.applyAdjustments({ ...adj, [key]: +e.target.value })}
                    style={{ width:'100%' }} />
                </div>
              ))}
              <button onClick={() => ed.applyAdjustments({ brightness:0, contrast:0, saturation:0, blur:0, hue:0, gamma:1, pixelate:0, noise:0 })}
                style={{ ...btnStyle('ghost'), fontSize:11 }}>Reset All</button>
            </>
          )}

          {activePanel === 'filter' && (
            <>
              <label style={labelStyle}>Preset Filters</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {PRESET_FILTERS.map(f => (
                  <button key={f} onClick={() => ed.applyPresetFilter(f)}
                    style={{ padding:'8px 4px', borderRadius:8, border:`2px solid ${ed.activeFilter === f ? '#6366f1' : 'transparent'}`, background:'rgba(255,255,255,0.05)', color:'#fff', cursor:'pointer', fontSize:12, textTransform:'capitalize' }}>
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}

          {activePanel === 'text' && (
            <>
              <label style={labelStyle}>Add Text</label>
              <input value={textOpts.text} onChange={e => setTextOpts(p => ({...p, text: e.target.value}))} placeholder="Text content" style={inputStyle} />
              <select value={textOpts.fontFamily} onChange={e => setTextOpts(p => ({...p, fontFamily: e.target.value}))} style={selectStyle}>
                {FONTS.map(f => <option key={f}>{f}</option>)}
              </select>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:'#9ca3af', marginBottom:2 }}>Size: {textOpts.fontSize}px</div>
                  <input type="range" min={12} max={200} value={textOpts.fontSize} onChange={e => setTextOpts(p => ({...p, fontSize: +e.target.value}))} style={{ width:'100%' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <label style={{ fontSize:11, color:'#9ca3af' }}>Color</label>
                <input type="color" value={textOpts.color} onChange={e => setTextOpts(p => ({...p, color: e.target.value}))} style={{ width:36, height:28, border:'none', borderRadius:4, cursor:'pointer', background:'none' }} />
                <label style={{ fontSize:11, color:'#9ca3af' }}>Stroke</label>
                <input type="color" value={textOpts.stroke || '#000000'} onChange={e => setTextOpts(p => ({...p, stroke: e.target.value}))} style={{ width:36, height:28, border:'none', borderRadius:4, cursor:'pointer', background:'none' }} />
              </div>
              <div>
                <div style={{ fontSize:11, color:'#9ca3af', marginBottom:2 }}>Stroke Width: {textOpts.strokeWidth}</div>
                <input type="range" min={0} max={10} value={textOpts.strokeWidth} onChange={e => setTextOpts(p => ({...p, strokeWidth: +e.target.value}))} style={{ width:'100%' }} />
              </div>
              <select value={textOpts.fontWeight} onChange={e => setTextOpts(p => ({...p, fontWeight: e.target.value}))} style={selectStyle}>
                {['normal','bold','100','300','500','700','900'].map(w => <option key={w}>{w}</option>)}
              </select>
              <button onClick={() => ed.addText(textOpts.text, textOpts)} style={btnStyle('primary')}>+ Add Text</button>
            </>
          )}

          {activePanel === 'sticker' && (
            <>
              <label style={labelStyle}>Stickers & Emojis</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => ed.addSticker(e)} style={{ fontSize:24, background:'rgba(255,255,255,0.05)', border:'none', borderRadius:8, cursor:'pointer', padding:6 }}>
                    {e}
                  </button>
                ))}
              </div>
            </>
          )}

          {activePanel === 'draw' && (
            <>
              <label style={labelStyle}>Drawing Tools</label>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <label style={{ fontSize:11, color:'#9ca3af' }}>Color</label>
                <input type="color" value={ed.drawColor} onChange={e => ed.updateDrawBrush(e.target.value)} style={{ width:36, height:28, border:'none', borderRadius:4, cursor:'pointer' }} />
              </div>
              <div>
                <div style={{ fontSize:11, color:'#9ca3af', marginBottom:2 }}>Brush Size: {ed.drawWidth}px</div>
                <input type="range" min={1} max={50} value={ed.drawWidth} onChange={e => ed.updateDrawBrush(undefined, +e.target.value)} style={{ width:'100%' }} />
              </div>
              <p style={{ fontSize:11, color:'#6366f1' }}>Drawing mode is active. Draw on canvas freely.</p>
            </>
          )}

          {activePanel === 'shape' && (
            <>
              <label style={labelStyle}>Add Shapes</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {([['rect','⬛ Rectangle'],['circle','⭕ Circle'],['triangle','🔺 Triangle'],['line','➖ Line']] as const).map(([s, label]) => (
                  <button key={s} onClick={() => ed.addShape(s)} style={{ ...btnStyle('secondary'), fontSize:12 }}>{label}</button>
                ))}
              </div>
            </>
          )}

          {activePanel === 'layers' && (
            <>
              <label style={labelStyle}>Layers ({ed.layers.length})</label>
              {ed.layers.map(layer => (
                <div key={layer.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderRadius:8, background: layer.id === ed.selectedId ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize:12, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{layer.name}</span>
                  <button onClick={() => ed.toggleLayerVisibility(layer.id)} style={{ ...iconBtn, opacity: layer.visible ? 1 : 0.4 }} title="Toggle visibility">👁</button>
                  <button onClick={() => ed.toggleLayerLock(layer.id)} style={{ ...iconBtn }} title="Lock">{layer.locked ? '🔒' : '🔓'}</button>
                  <button onClick={() => ed.duplicateLayer(layer.id)} style={{ ...iconBtn }} title="Duplicate">⧉</button>
                  <button onClick={() => ed.deleteLayer(layer.id)} style={{ ...iconBtn, color:'#f87171' }} title="Delete">✕</button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Canvas Area — supports drag & drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'auto', padding:24, gap:12, position:'relative', transition:'background 0.2s', background: isDragOver ? 'rgba(99,102,241,0.08)' : 'transparent' }}>
          {isDragOver && (
            <div style={{ position:'absolute', inset:0, border:'3px dashed #6366f1', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:10, background:'rgba(99,102,241,0.06)' }}>
              <div style={{ textAlign:'center', color:'#a78bfa' }}>
                <div style={{ fontSize:48 }}>📸</div>
                <p style={{ fontSize:18, fontWeight:700 }}>Drop image here</p>
              </div>
            </div>
          )}
          {!ed.isReady && (
            <div style={{ color:'#6366f1', fontSize:14 }}>Initializing canvas...</div>
          )}
          {ed.isReady && ed.layers.length === 0 && (
            <div style={{ position:'absolute', textAlign:'center', color:'rgba(255,255,255,0.15)', pointerEvents:'none' }}>
              <div style={{ fontSize:56 }}>🖼️</div>
              <p style={{ fontSize:14 }}>Upload karo ya AI se generate karo</p>
              <p style={{ fontSize:12, marginTop:4 }}>Ya yahan drag & drop karo</p>
            </div>
          )}
          <div style={{ boxShadow:'0 0 60px rgba(99,102,241,0.3)', borderRadius:8, overflow:'hidden' }}>
            <canvas ref={ed.canvasRef} />
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={() => ed.setZoomLevel(Math.max(25, ed.zoom - 25))} style={btnStyle('ghost')}>−</button>
            <span style={{ fontSize:13, color:'#9ca3af', minWidth:50, textAlign:'center' }}>{ed.zoom}%</span>
            <button onClick={() => ed.setZoomLevel(Math.min(400, ed.zoom + 25))} style={btnStyle('ghost')}>+</button>
            <button onClick={() => ed.setZoomLevel(100)} style={btnStyle('ghost')}>Fit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
function btnStyle(variant: 'primary'|'secondary'|'ghost'|'danger'|'success') {
  const base: React.CSSProperties = { padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.15s' };
  const variants = {
    primary: { background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff' },
    secondary: { background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)' },
    ghost: { background:'transparent', color:'#9ca3af', border:'1px solid rgba(255,255,255,0.1)' },
    danger: { background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' },
    success: { background:'rgba(34,197,94,0.15)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' },
  };
  return { ...base, ...variants[variant] };
}
const labelStyle: React.CSSProperties = { fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9ca3af' };
const inputStyle: React.CSSProperties = { width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const selectStyle: React.CSSProperties = { ...inputStyle, cursor:'pointer' };
const iconBtn: React.CSSProperties = { background:'none', border:'none', cursor:'pointer', fontSize:13, padding:2, color:'#9ca3af' };

export default function ImageEditorPage() {
  return (
    <Suspense fallback={<div style={{ color:'#fff', padding:24 }}>Loading editor...</div>}>
      <ImageEditorInner />
    </Suspense>
  );
}
