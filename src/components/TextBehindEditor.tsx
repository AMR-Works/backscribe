import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Download, Plus, Trash2 } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

// Types
interface TextLayer {
  id: string;
  text: string;
  fontFamily: string;
  fontWeight: string; // e.g., "400", "600", "700"
  fontSizeNorm: number; // relative to image height (0..1)
  color: string; // hex
  opacity: number; // 0..1
  letterSpacingEm: number; // in em relative to font size
  rotationDeg: number; // -180..180
  tiltXDeg: number; // skewX
  tiltYDeg: number; // skewY
  xNorm: number; // 0..1
  yNorm: number; // 0..1
}

// Utilities
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export const TextBehindEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [fgImg, setFgImg] = useState<HTMLImageElement | null>(null);
  const [fgObjectUrl, setFgObjectUrl] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLayer = useMemo(() => layers.find(l => l.id === activeId) || null, [layers, activeId]);

  // Drag state
  const dragState = useRef<{ id: string | null; startX: number; startY: number; origX: number; origY: number }>(
    { id: null, startX: 0, startY: 0, origX: 0, origY: 0 }
  );

  const aspectRatio = useMemo(() => {
    if (!bgImg) return 1;
    return bgImg.naturalWidth / bgImg.naturalHeight;
  }, [bgImg]);

  const [previewH, setPreviewH] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPreviewH(entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImageFromUrl(url);
      setBgImg(img);

      // Start background removal automatically
      setIsRemoving(true);
      try {
        const blob = await removeBackground(file as File, {
          // model options are internal; defaults are OK. Keeping simple for compatibility
          debug: false,
          publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
        } as any);
        const objUrl = URL.createObjectURL(blob as Blob);
        const fg = await loadImageFromUrl(objUrl);
        // Clean up old URL
        if (fgObjectUrl) URL.revokeObjectURL(fgObjectUrl);
        setFgObjectUrl(objUrl);
        setFgImg(fg);
        toast.success("Background removed!");
      } catch (err) {
        console.error(err);
        toast.error("Background removal failed. You can still edit with the original image.");
        setFgImg(null);
        if (fgObjectUrl) URL.revokeObjectURL(fgObjectUrl);
        setFgObjectUrl(null);
      } finally {
        setIsRemoving(false);
      }

      // Initialize one text layer as an example
      setLayers([
        {
          id: uid(),
          text: "Your Text",
          fontFamily: "Inter",
          fontWeight: "700",
          fontSizeNorm: 0.08, // 8% of image height
          color: "#ffffff",
          opacity: 1,
          letterSpacingEm: 0,
          rotationDeg: 0,
          tiltXDeg: 0,
          tiltYDeg: 0,
          xNorm: 0.5,
          yNorm: 0.5,
        },
      ]);
      setActiveId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load image");
    }
  };

  const addTextLayer = () => {
    if (!bgImg) return toast.error("Upload an image first");
    const nl: TextLayer = {
      id: uid(),
      text: "New Text",
      fontFamily: "Inter",
      fontWeight: "700",
      fontSizeNorm: 0.06,
      color: "#ff0055",
      opacity: 1,
      letterSpacingEm: 0,
      rotationDeg: 0,
      tiltXDeg: 0,
      tiltYDeg: 0,
      xNorm: 0.5,
      yNorm: 0.5,
    };
    setLayers(prev => [...prev, nl]);
    setActiveId(nl.id);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateActiveLayer = <K extends keyof TextLayer>(key: K, value: TextLayer[K]) => {
    if (!activeId) return;
    setLayers(prev => prev.map(l => (l.id === activeId ? { ...l, [key]: value } : l)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    dragState.current = {
      id,
      startX: pointerX,
      startY: pointerY,
      origX: layer.xNorm,
      origY: layer.yNorm,
    };
    (e.target as Element).setPointerCapture(e.pointerId);
    setActiveId(id);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const id = dragState.current.id;
    if (!id || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const dx = (pointerX - dragState.current.startX) / rect.width;
    const dy = (pointerY - dragState.current.startY) / rect.height;

    setLayers(prev => prev.map(l => {
      if (l.id !== id) return l;
      return {
        ...l,
        xNorm: Math.min(1, Math.max(0, dragState.current.origX + dx)),
        yNorm: Math.min(1, Math.max(0, dragState.current.origY + dy)),
      };
    }));
  };

  const onPointerUp = () => {
    dragState.current.id = null;
  };

  // Draw text onto canvas with letter spacing and transforms
  function drawTextOnCanvas(
    ctx: CanvasRenderingContext2D,
    layer: TextLayer,
    imgW: number,
    imgH: number
  ) {
    const fontSizePx = Math.max(1, Math.round(layer.fontSizeNorm * imgH));
    ctx.save();
    // Position
    const x = layer.xNorm * imgW;
    const y = layer.yNorm * imgH;
    ctx.translate(x, y);

    // Rotation and tilt (skew) — apply skew THEN rotate to match CSS
    const rot = (layer.rotationDeg * Math.PI) / 180;
    const skewX = Math.tan((layer.tiltXDeg * Math.PI) / 180);
    const skewY = Math.tan((layer.tiltYDeg * Math.PI) / 180);
    ctx.transform(1, skewY, skewX, 1, 0, 0);
    ctx.rotate(rot);

    // Styles
    ctx.globalAlpha = layer.opacity;
    ctx.fillStyle = layer.color;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.font = `${layer.fontWeight} ${fontSizePx}px ${layer.fontFamily}`;

    // Letter spacing drawing
    const lsPx = layer.letterSpacingEm * fontSizePx;
    const text = layer.text;
    let cursorX = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      ctx.fillText(ch, cursorX, 0);
      const chWidth = ctx.measureText(ch).width;
      cursorX += chWidth + lsPx;
    }

    ctx.restore();
  }

  const handleDownload = async () => {
    try {
      if (!bgImg) return toast.error("Please upload an image first");
      const imgW = bgImg.naturalWidth;
      const imgH = bgImg.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = imgW;
      canvas.height = imgH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      // 1) Background
      ctx.drawImage(bgImg, 0, 0, imgW, imgH);
      // 2) Text layers (behind subject)
      for (const layer of layers) {
        drawTextOnCanvas(ctx, layer, imgW, imgH);
      }
      // 3) Foreground cutout
      if (fgImg) {
        ctx.drawImage(fgImg, 0, 0, imgW, imgH);
      }

      canvas.toBlob((blob) => {
        if (!blob) return toast.error("Failed to export image");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "backscribed.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 500);
      }, "image/png");
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };

  // Fonts
  const fontOptions = [
    "Inter",
    "Playfair Display",
    "Montserrat",
    "Oswald",
    "Lato",
    "Roboto",
    "Georgia",
    "Times New Roman",
  ];

  return (
    <div className="space-y-6">
      {/* Upload row */}
      <div className="flex items-center gap-3">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" /> Upload Image
        </Button>
        <Button onClick={handleDownload} disabled={!bgImg}>
          <Download className="w-4 h-4 mr-2" /> Download PNG
        </Button>
        <div className="text-sm text-muted-foreground">
          {bgImg ? (
            <span>
              {bgImg.naturalWidth} × {bgImg.naturalHeight}
            </span>
          ) : (
            <span>No image loaded</span>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            className="relative w-full bg-muted/40 rounded-md overflow-hidden border border-border"
            style={{ aspectRatio: `${aspectRatio}` }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Background */}
            {bgImg && (
              <img
                src={bgImg.src}
                alt="Background"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
            )}

            {/* Text layers */}
            {bgImg && layers.map((l) => (
              <div
                key={l.id}
                className={`absolute select-none ${activeId === l.id ? "ring-2 ring-primary/60" : ""}`}
                style={{
                  left: `${l.xNorm * 100}%`,
                  top: `${l.yNorm * 100}%`,
                  transform: `skew(${l.tiltXDeg}deg, ${l.tiltYDeg}deg) rotate(${l.rotationDeg}deg)`,
                  transformOrigin: "top left",
                  color: l.color,
                  opacity: l.opacity,
                  fontFamily: l.fontFamily,
                  fontWeight: l.fontWeight as any,
                  fontSize: `${Math.max(1, l.fontSizeNorm * previewH).toFixed(2)}px`,
                  letterSpacing: `${l.letterSpacingEm}em`,
                  pointerEvents: "auto",
                  cursor: "move",
                }}
                onPointerDown={(e) => onPointerDown(e, l.id)}
                onClick={() => setActiveId(l.id)}
              >
                {l.text}
              </div>
            ))}

            {/* Foreground cutout */}
            {fgImg && (
              <img
                src={fgImg.src}
                alt="Foreground"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            )}

            {!bgImg && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Upload className="w-10 h-10 mx-auto mb-3" />
                  <p>Upload an image to start</p>
                </div>
              </div>
            )}

            {isRemoving && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-sm">Removing background…</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Text Layers</h4>
            <Button size="sm" variant="secondary" onClick={addTextLayer} disabled={!bgImg}>
              <Plus className="w-4 h-4 mr-1" /> Add Text
            </Button>
          </div>

          <div className="space-y-2">
            {layers.map((l) => (
              <div
                key={l.id}
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${activeId === l.id ? "border-primary/50 bg-muted/30" : "border-border"}`}
              >
                <button className="text-left flex-1" onClick={() => setActiveId(l.id)}>
                  <div className="text-sm font-medium truncate">{l.text || "(empty)"}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.fontFamily} • {l.fontWeight}</div>
                </button>
                <Button variant="ghost" size="icon" onClick={() => removeLayer(l.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {layers.length === 0 && (
              <div className="text-sm text-muted-foreground border rounded-md p-3">
                No layers yet. Click "Add Text" to create one.
              </div>
            )}
          </div>

          {activeLayer && (
            <div className="space-y-4 border rounded-md p-4">
              <div className="space-y-2">
                <Label>Text</Label>
                <Input
                  value={activeLayer.text}
                  onChange={(e) => updateActiveLayer("text", e.target.value)}
                  placeholder="Enter text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={activeLayer.fontFamily}
                    onValueChange={(v) => updateActiveLayer("fontFamily", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Font Weight</Label>
                  <Select
                    value={activeLayer.fontWeight}
                    onValueChange={(v) => updateActiveLayer("fontWeight", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Weight" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["400", "500", "600", "700", "800"] as const).map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Font Size</span>
                  <span className="text-xs text-muted-foreground">{Math.round(activeLayer.fontSizeNorm * 100)}% of image height</span>
                </Label>
                <Slider
                  value={[activeLayer.fontSizeNorm]}
                  min={0.01}
                  max={0.25}
                  step={0.005}
                  onValueChange={([v]) => updateActiveLayer("fontSizeNorm", v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={activeLayer.color}
                    onChange={(e) => updateActiveLayer("color", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacity</Label>
                  <Slider
                    value={[activeLayer.opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([v]) => updateActiveLayer("opacity", v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Rotation</Label>
                  <Slider
                    value={[activeLayer.rotationDeg]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={([v]) => updateActiveLayer("rotationDeg", v)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tilt X</Label>
                  <Slider
                    value={[activeLayer.tiltXDeg]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={([v]) => updateActiveLayer("tiltXDeg", v)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tilt Y</Label>
                  <Slider
                    value={[activeLayer.tiltYDeg]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={([v]) => updateActiveLayer("tiltYDeg", v)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Letter Spacing (em)</Label>
                <Slider
                  value={[activeLayer.letterSpacingEm]}
                  min={-0.1}
                  max={1}
                  step={0.01}
                  onValueChange={([v]) => updateActiveLayer("letterSpacingEm", v)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextBehindEditor;
