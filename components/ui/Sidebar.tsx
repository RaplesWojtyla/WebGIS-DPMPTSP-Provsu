'use client';

import { X } from 'lucide-react';
import { Button } from './button';

interface SidebarProps {
    selectedRegion: any | null;
    onClose: () => void;
    onPredict: () => void;
}

const Sidebar = ({ selectedRegion, onClose, onPredict }: SidebarProps) => {
    if (!selectedRegion) return null;

    const { properties } = selectedRegion;
    const regionName = properties.province || properties.VARNAME_2 || 'Unknown Region';
    const districtName = properties.NAME_1 || 'Sumatera Utara';

    return (
        <div className="absolute left-4 top-4 bottom-4 w-80 bg-white shadow-xl rounded-xl z-1000 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-lg">{regionName}</h2>
                    <p className="text-xs text-slate-300">{districtName}</p>
                </div>
                <Button
                    onClick={onClose}
                    className="hover:bg-slate-700 rounded-full transition-colors"
                    size='icon'
                >
                    <X className='size-5' />
                </Button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Investment Overview</h3>
                        <p className="text-sm text-blue-800">
                            Select "Analyze Investment" to view AI-driven predictions for this region.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-slate-500 uppercase tracking-wider">Region Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-slate-500">Province</div>
                            <div className="font-medium text-right">{districtName}</div>
                            <div className="text-slate-500">Type</div>
                            <div className="font-medium text-right">{properties.type || 'Regency/City'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
                <Button
                    onClick={onPredict}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <span>✨ Analyze Investment</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
