import React from 'react';
import Card from './Card';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, label, className, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 bg-opacity-30">
            <Card className={`relative bg-zinc-200 border-zinc-300 w-11/12 md:w-1/3 ${className}`}>
                <button
                    className="absolute top-2 right-2  p-2 focus:outline-none"
                    onClick={onClose}
                >
                    <X className='w-4 h-auto' />
                </button>
                <div className='my-3'>
                    <h2 className="text-lg font-medium ml-4 text-zinc-800">{title}</h2>
                    <p className='text-sm font-light ml-4 text-zinc-500'>{label}</p>
                </div>
                <div className='px-4 pb-4'>
                    {children}
                </div>
            </Card>
        </div>
    );
};

export default Modal;

