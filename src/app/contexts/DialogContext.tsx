import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogOptions {
  type: 'alert' | 'confirm';
  title?: string;
  message: string;
  resolve: (value: boolean) => void;
}

interface DialogContextType {
  showAlert: (message: string, title?: string) => Promise<boolean>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const showAlert = useCallback((message: string, title: string = '안내') => {
    return new Promise<boolean>((resolve) => {
      setDialog({ type: 'alert', message, title, resolve });
    });
  }, []);

  const showConfirm = useCallback((message: string, title: string = '확인') => {
    return new Promise<boolean>((resolve) => {
      setDialog({ type: 'confirm', message, title, resolve });
    });
  }, []);

  const handleClose = (value: boolean) => {
    if (dialog) {
      dialog.resolve(value);
      setDialog(null);
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className={`p-4 border-b border-gray-100 flex justify-between items-center ${dialog.type === 'confirm' ? 'bg-red-50/50' : 'bg-gray-50/50'}`}>
              <h3 className={`font-bold text-lg ${dialog.type === 'confirm' ? 'text-red-800' : 'text-gray-800'}`}>
                {dialog.title}
              </h3>
              <button onClick={() => handleClose(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {dialog.message}
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              {dialog.type === 'confirm' && (
                <button
                  onClick={() => handleClose(false)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  취소
                </button>
              )}
              <button
                onClick={() => handleClose(true)}
                className={`flex-1 py-3 font-bold rounded-xl transition shadow-sm hover:shadow-md ${
                  dialog.type === 'confirm' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-[#C8963E] text-white hover:bg-[#B38536]'
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};
