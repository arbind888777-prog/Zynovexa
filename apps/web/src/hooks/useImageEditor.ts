'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export type ActiveTool = 'select' | 'text' | 'draw' | 'shape' | 'sticker';

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export interface EditorAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  gamma: number;
  pixelate: number;
  noise: number;
}

const DEFAULT_ADJ: EditorAdjustments = {
  brightness: 0, contrast: 0, saturation: 0,
  blur: 0, hue: 0, gamma: 1, pixelate: 0, noise: 0,
};

// Fabric.js v6 — all exports are named at module root
// Dynamic import ensures SSR safety (no window access at module load)
async function getF() {
  const m = await import('fabric') as any;
  return m;
}

export function useImageEditor() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const fabricRef  = useRef<any>(null);
  const historyRef = useRef<string[]>([]);
  const histIdx    = useRef<number>(-1);
  const baseImgRef = useRef<any>(null);

  const [activeTool,      setActiveTool]      = useState<ActiveTool>('select');
  const [zoom,            setZoom]            = useState(100);
  const [layers,          setLayers]          = useState<LayerItem[]>([]);
  const [selectedId,      setSelectedId]      = useState<string | null>(null);
  const [adjustments,     setAdjustments]     = useState<EditorAdjustments>(DEFAULT_ADJ);
  const [activeFilter,    setActiveFilter]    = useState('original');
  const [canUndo,         setCanUndo]         = useState(false);
  const [canRedo,         setCanRedo]         = useState(false);
  const [isReady,         setIsReady]         = useState(false);
  const [drawColor,       setDrawColor]       = useState('#ffffff');
  const [drawWidth,       setBrushWidth]      = useState(8);

  /* ── helpers ─────────────────────────────────────────────────── */

  const saveHistory = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const snap = JSON.stringify(fc.toJSON(['_id','_name']));
    historyRef.current = historyRef.current.slice(0, histIdx.current + 1);
    historyRef.current.push(snap);
    if (historyRef.current.length > 50) historyRef.current.shift();
    histIdx.current = historyRef.current.length - 1;
    setCanUndo(histIdx.current > 0);
    setCanRedo(false);
  }, []);

  const refreshLayers = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const objs: any[] = fc.getObjects();
    setLayers(
      [...objs].reverse().map((o: any, i: number) => ({
        id:      o._id   || `obj-${i}`,
        name:    o._name || o.type || `Layer ${i + 1}`,
        type:    o.type  || 'object',
        visible: o.visible !== false,
        locked:  !!o.lockMovementX,
      }))
    );
  }, []);

  /* ── init ─────────────────────────────────────────────────────── */

  const initCanvas = useCallback(async (width = 1080, height = 1080) => {
    if (!canvasRef.current) return;
    const f = await getF();

    if (fabricRef.current) {
      try { fabricRef.current.dispose(); } catch {}
    }

    const fc = new f.Canvas(canvasRef.current, {
      width, height,
      backgroundColor: '#1a1a2e',
      preserveObjectStacking: true,
    });
    fabricRef.current = fc;

    fc.on('object:added',    () => { refreshLayers(); saveHistory(); });
    fc.on('object:modified', () => { refreshLayers(); saveHistory(); });
    fc.on('object:removed',  () => { refreshLayers(); saveHistory(); });
    fc.on('selection:created', (e: any) => setSelectedId(e.selected?.[0]?._id ?? null));
    fc.on('selection:cleared', ()       => setSelectedId(null));

    setIsReady(true);
  }, [refreshLayers, saveHistory]);

  /* ── load image ───────────────────────────────────────────────── */

  const loadImage = useCallback(async (src: string) => {
    const f  = await getF();
    const fc = fabricRef.current;
    if (!fc) return;

    try {
      // Fabric v6: FabricImage.fromURL(url, options?) → Promise<FabricImage>
      const img: any = await f.FabricImage.fromURL(src, { crossOrigin: 'anonymous' });

      fc.clear();
      const scale = Math.min(fc.width / img.width, fc.height / img.height, 1);
      img.set({
        left:  (fc.width  - img.width  * scale) / 2,
        top:   (fc.height - img.height * scale) / 2,
        scaleX: scale, scaleY: scale,
        selectable: true,
        _id: 'base-image', _name: 'Background',
      });
      fc.add(img);
      fc.setActiveObject(img);
      baseImgRef.current = img;
      fc.renderAll();
      saveHistory();
    } catch (e) {
      console.error('loadImage error', e);
    }
  }, [saveHistory]);


  /* ── adjustments ──────────────────────────────────────────────── */

  const applyAdjustments = useCallback(async (adj: EditorAdjustments) => {
    const f   = await getF();
    const img = baseImgRef.current;
    if (!img) return;
    setAdjustments(adj);

    // v6: filters are named exports; v5: Image.filters.*
    const Fil = f.filters ?? f.Image?.filters ?? {};

    const active: any[] = [];
    const add = (Cls: any, opts: any) => { if (Cls) active.push(new Cls(opts)); };

    if (adj.brightness !== 0) add(Fil.Brightness,   { brightness: adj.brightness / 100 });
    if (adj.contrast   !== 0) add(Fil.Contrast,     { contrast:   adj.contrast   / 100 });
    if (adj.saturation !== 0) add(Fil.Saturation,   { saturation: adj.saturation / 100 });
    if (adj.blur        > 0)  add(Fil.Blur,         { blur:       adj.blur       / 100 });
    if (adj.noise       > 0)  add(Fil.Noise,        { noise:      adj.noise });
    if (adj.pixelate    > 0)  add(Fil.Pixelate,     { blocksize:  Math.max(2, adj.pixelate) });
    if (adj.gamma      !== 1) add(Fil.Gamma,        { gamma:      [adj.gamma, adj.gamma, adj.gamma] });
    if (adj.hue        !== 0) add(Fil.HueRotation,  { rotation:   adj.hue / 360 });

    img.filters = active;
    img.applyFilters();
    fabricRef.current?.renderAll();
  }, []);

  /* ── preset filters ───────────────────────────────────────────── */

  const applyPresetFilter = useCallback(async (name: string) => {
    const f   = await getF();
    const img = baseImgRef.current;
    if (!img) return;
    setActiveFilter(name);

    const Fil = f.filters ?? f.Image?.filters ?? {};
    const mk  = (Cls: any, opts: any) => Cls ? new Cls(opts) : null;

    const MAP: Record<string, any[]> = {
      original: [],
      vivid:    [mk(Fil.Saturation, { saturation: 0.5 }), mk(Fil.Contrast, { contrast: 0.15 })],
      cool:     [mk(Fil.ColorMatrix, { matrix: [1,0,0,0,0, 0,1,0,0,0, 0,0,1.4,0,0, 0,0,0,1,0] })],
      warm:     [mk(Fil.ColorMatrix, { matrix: [1.1,0,0,0,0, 0,1,0,0,0, 0,0,0.8,0,0, 0,0,0,1,0] })],
      noir:     [mk(Fil.Grayscale, {}), mk(Fil.Contrast, { contrast: 0.3 })],
      sepia:    [mk(Fil.Sepia, {})],
      fade:     [mk(Fil.Brightness, { brightness: 0.1 }), mk(Fil.Saturation, { saturation: -0.3 })],
      vintage:  [mk(Fil.Sepia, {}), mk(Fil.Noise, { noise: 20 }), mk(Fil.Brightness, { brightness: -0.1 })],
      chrome:   [mk(Fil.Contrast, { contrast: 0.3 }), mk(Fil.Saturation, { saturation: 0.2 })],
      dramatic: [mk(Fil.Contrast, { contrast: 0.4 }), mk(Fil.Brightness, { brightness: -0.15 }), mk(Fil.Saturation, { saturation: 0.3 })],
    };

    img.filters = (MAP[name] ?? []).filter(Boolean);
    img.applyFilters();
    fabricRef.current?.renderAll();
    setAdjustments(DEFAULT_ADJ);
  }, []);

  /* ── add text ─────────────────────────────────────────────────── */

  const addText = useCallback(async (text = 'Your Text', opts: any = {}) => {
    const f  = await getF();
    const fc = fabricRef.current;
    if (!fc) return;

    // v6: IText | v5: IText (same name, usually)
    const ITextCls = f.IText ?? f.FabricText ?? f.Text;
    if (!ITextCls) return;

    const id = `text-${Date.now()}`;
    const t  = new ITextCls(text, {
      left:        fc.width  / 2 - 100,
      top:         fc.height / 2 - 25,
      fontSize:    opts.fontSize   || 48,
      fontFamily:  opts.fontFamily || 'Inter, sans-serif',
      fill:        opts.color      || '#ffffff',
      fontWeight:  opts.fontWeight || 'bold',
      textAlign:   opts.textAlign  || 'center',
      stroke:      opts.stroke     || '',
      strokeWidth: opts.strokeWidth || 0,
      _id: id, _name: 'Text Layer',
    });
    fc.add(t);
    fc.setActiveObject(t);
    fc.renderAll();
  }, []);

  /* ── add shape ────────────────────────────────────────────────── */

  const addShape = useCallback(async (
    shape: 'rect' | 'circle' | 'triangle' | 'line',
    opts: any = {},
  ) => {
    const f  = await getF();
    const fc = fabricRef.current;
    if (!fc) return;

    const id  = `shape-${Date.now()}`;
    const common = {
      left: fc.width  / 2 - 60,
      top:  fc.height / 2 - 60,
      fill:        opts.fill        || 'rgba(99,102,241,0.6)',
      stroke:      opts.stroke      || '#6366f1',
      strokeWidth: opts.strokeWidth || 2,
      _id: id, _name: shape[0].toUpperCase() + shape.slice(1),
    };

    let obj: any;
    if      (shape === 'rect'     && f.Rect)     obj = new f.Rect({ ...common, width: 120, height: 120, rx: 8 });
    else if (shape === 'circle'   && f.Circle)   obj = new f.Circle({ ...common, radius: 60 });
    else if (shape === 'triangle' && f.Triangle) obj = new f.Triangle({ ...common, width: 120, height: 120 });
    else if (f.Line)                             obj = new f.Line([0, 0, 200, 0], { ...common, strokeWidth: 4 });

    if (obj) { fc.add(obj); fc.setActiveObject(obj); fc.renderAll(); }
  }, []);

  /* ── add sticker ──────────────────────────────────────────────── */

  const addSticker = useCallback(async (emoji: string) => {
    const f  = await getF();
    const fc = fabricRef.current;
    if (!fc) return;

    const TextCls = f.FabricText ?? f.Text;
    if (!TextCls) return;

    const id = `sticker-${Date.now()}`;
    const t  = new TextCls(emoji, {
      left: fc.width  / 2,
      top:  fc.height / 2,
      fontSize: 80,
      selectable: true,
      _id: id, _name: `Sticker ${emoji}`,
    });
    fc.add(t);
    fc.setActiveObject(t);
    fc.renderAll();
  }, []);

  /* ── drawing mode ─────────────────────────────────────────────── */

  const setDrawingMode = useCallback((enabled: boolean) => {
    const fc = fabricRef.current;
    if (!fc) return;
    fc.isDrawingMode = enabled;
    if (enabled && fc.freeDrawingBrush) {
      fc.freeDrawingBrush.color = drawColor;
      fc.freeDrawingBrush.width = drawWidth;
    }
  }, [drawColor, drawWidth]);

  const updateDrawBrush = useCallback((color?: string, width?: number) => {
    const fc = fabricRef.current;
    if (!fc?.freeDrawingBrush) return;
    if (color !== undefined) { setDrawColor(color); fc.freeDrawingBrush.color = color; }
    if (width !== undefined) { setBrushWidth(width); fc.freeDrawingBrush.width = width; }
  }, []);

  /* ── history ──────────────────────────────────────────────────── */

  const restoreHistory = useCallback((snap: string) => {
    const fc = fabricRef.current;
    if (!fc) return;
    fc.loadFromJSON(JSON.parse(snap), () => {
      fc.renderAll();
      refreshLayers();
      baseImgRef.current = fc.getObjects().find((o: any) => o._id === 'base-image') ?? null;
    });
  }, [refreshLayers]);

  const undo = useCallback(() => {
    if (histIdx.current <= 0) return;
    histIdx.current--;
    restoreHistory(historyRef.current[histIdx.current]);
    setCanUndo(histIdx.current > 0);
    setCanRedo(true);
  }, [restoreHistory]);

  const redo = useCallback(() => {
    if (histIdx.current >= historyRef.current.length - 1) return;
    histIdx.current++;
    restoreHistory(historyRef.current[histIdx.current]);
    setCanUndo(true);
    setCanRedo(histIdx.current < historyRef.current.length - 1);
  }, [restoreHistory]);

  /* ── object actions ───────────────────────────────────────────── */

  const deleteSelected = useCallback(() => {
    const fc  = fabricRef.current;
    const obj = fc?.getActiveObject() as any;
    if (obj && obj._id !== 'base-image') { fc.remove(obj); fc.renderAll(); }
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    const fc  = fabricRef.current;
    const obj = fc?.getObjects().find((o: any) => o._id === id) as any;
    if (obj) { obj.visible = !obj.visible; fc.renderAll(); refreshLayers(); }
  }, [refreshLayers]);

  const toggleLayerLock = useCallback((id: string) => {
    const fc  = fabricRef.current;
    const obj = fc?.getObjects().find((o: any) => o._id === id) as any;
    if (!obj) return;
    const lock = !obj.lockMovementX;
    obj.set({ lockMovementX: lock, lockMovementY: lock, lockRotation: lock, lockScalingX: lock, lockScalingY: lock });
    fc.renderAll(); refreshLayers();
  }, [refreshLayers]);

  const deleteLayer = useCallback((id: string) => {
    const fc  = fabricRef.current;
    const obj = fc?.getObjects().find((o: any) => o._id === id);
    if (obj && (obj as any)._id !== 'base-image') { fc.remove(obj); fc.renderAll(); }
  }, []);

  const duplicateLayer = useCallback((id: string) => {
    const fc  = fabricRef.current;
    const obj = fc?.getObjects().find((o: any) => o._id === id) as any;
    if (!obj) return;
    const cloneFn = obj.clone?.bind(obj);
    if (!cloneFn) return;
    Promise.resolve(cloneFn(['_id','_name'])).then((cloned: any) => {
      cloned.set({
        left: obj.left + 20, top: obj.top + 20,
        _id: `${id}-copy-${Date.now()}`, _name: `${obj._name ?? obj.type} Copy`,
      });
      fc.add(cloned); fc.setActiveObject(cloned); fc.renderAll();
    });
  }, []);

  /* ── export ───────────────────────────────────────────────────── */

  const exportImage = useCallback((format: 'png' | 'jpeg' | 'webp' = 'png', quality = 1) => {
    const fc = fabricRef.current;
    if (!fc) return null;
    return fc.toDataURL({ format, quality, multiplier: 1 });
  }, []);

  /* ── zoom ─────────────────────────────────────────────────────── */

  const setZoomLevel = useCallback((level: number) => {
    const fc = fabricRef.current;
    if (!fc) return;
    fc.setZoom(level / 100);
    setZoom(level);
  }, []);

  /* ── keyboard shortcuts ───────────────────────────────────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Delete') deleteSelected();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, deleteSelected]);

  return {
    canvasRef, fabricRef, isReady,
    activeTool, setActiveTool,
    zoom, setZoomLevel,
    layers, selectedId,
    adjustments, activeFilter,
    canUndo, canRedo,
    drawColor, drawWidth,
    initCanvas, loadImage,
    applyAdjustments, applyPresetFilter,
    addText, addShape, addSticker,
    setDrawingMode, updateDrawBrush,
    undo, redo, deleteSelected,
    toggleLayerVisibility, toggleLayerLock, deleteLayer, duplicateLayer,
    exportImage,
  };
}

// tiny stub so loadImage can call it without import cycle
function toast(msg: string) { console.warn('[editor]', msg); }
