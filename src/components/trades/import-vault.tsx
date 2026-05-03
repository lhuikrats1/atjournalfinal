"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ImportVault() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/trades/import/tradingview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => {
          setIsOpen(false);
          setFile(null);
          setStatus("idle");
          router.refresh();
        }, 2000);
      } else {
        throw new Error(data.error || "Import failed");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-2 border border-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
      >
        <Upload size={14} strokeWidth={3} />
        Vault Import
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !status.includes("uploading") && setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-black border border-primary p-12 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter">VAULT_IMPORT</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">TradingView CSV Protocol V1.0</p>
              </div>

              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all p-12 flex flex-col items-center justify-center space-y-6 cursor-pointer group"
                >
                  <div className="size-16 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                    <Upload size={24} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-widest">Transmit CSV Data Stream</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Drop file or click to select</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-6 bg-primary/5 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="size-10 bg-primary flex items-center justify-center text-background">
                          <Check size={16} strokeWidth={3} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase tracking-widest">{file.name}</p>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{(file.size / 1024).toFixed(2)} KB</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      disabled={status === "uploading"}
                      className="p-2 text-primary/40 hover:text-primary transition-all disabled:opacity-50"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {status === "idle" && (
                    <button 
                      onClick={handleUpload}
                      className="w-full py-6 bg-primary text-background text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all"
                    >
                      INITIATE_IMPORT_SEQUENCE
                    </button>
                  )}

                  {status === "uploading" && (
                    <div className="w-full py-6 bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                      <Loader2 size={16} className="animate-spin" />
                      AUTHORIZING_DATA_HANDSHAKE...
                    </div>
                  )}

                  {status === "success" && (
                    <div className="w-full py-6 bg-primary text-background text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                      <Check size={16} strokeWidth={3} />
                      {message.toUpperCase()}
                    </div>
                  )}

                  {status === "error" && (
                    <div className="w-full py-6 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                      <AlertCircle size={16} />
                      {message.toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                 <button 
                   onClick={() => setIsOpen(false)}
                   disabled={status === "uploading"}
                   className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-opacity"
                 >
                   ABORT_MISSION
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
