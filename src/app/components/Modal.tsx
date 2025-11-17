"use client";
import { ReactNode } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export default function Modal({ show, onClose, children, title }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
