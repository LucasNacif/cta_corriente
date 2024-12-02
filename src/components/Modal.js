import React from 'react';
import Card from './Card';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 bg-opacity-30">
            <Card className="relative bg-monza-200 border-monza-300 p-6 w-11/12 md:w-1/3">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2  p-2 focus:outline-none"
                >
                    <X className='w-4 h-auto'/>
                </button>
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                {children}
            </Card>
        </div>
    );
};

export default Modal;

