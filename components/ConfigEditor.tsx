import React, { useState, useEffect } from 'react';
import { ConfigFile } from '../types';
import { MockApi } from '../services/mockService';
import { Icons } from '../constants';

interface Props {
    services: { id: string; name: string }[];
}

const ConfigEditor: React.FC<Props> = ({ services }) => {
    const [selectedId, setSelectedId] = useState(services[0].id);
    const [config, setConfig] = useState<ConfigFile | null>(null);
    const [content, setContent] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        loadConfig(selectedId);
    }, [selectedId]);

    const loadConfig = async (id: string) => {
        const data = await MockApi.getConfig(id);
        setConfig(data);
        setContent(data.content);
        setIsDirty(false);
    };

    const handleSave = async () => {
        if (!config) return;
        await MockApi.saveConfig(config.serviceId, content);
        setIsDirty(false);
    };

    return (
        <div className="h-full flex flex-col bg-panel-bg rounded-lg border border-gray-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-800">
                <div className="flex gap-2">
                    {services.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                                selectedId === s.id 
                                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <Icons.FileText />
                    {config?.path || 'Loading...'}
                </div>
            </div>

            <div className="flex-1 relative">
                <textarea 
                    value={content}
                    onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
                    className="w-full h-full bg-[#0d1117] p-4 font-mono text-sm text-gray-300 resize-none focus:outline-none"
                    spellCheck={false}
                />
            </div>

            <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                <button 
                    onClick={() => loadConfig(selectedId)}
                    disabled={!isDirty}
                    className="px-4 py-2 rounded text-sm text-gray-400 hover:text-white disabled:opacity-50"
                >
                    Reset
                </button>
                <button 
                    onClick={handleSave}
                    disabled={!isDirty}
                    className={`px-6 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
                        isDirty 
                        ? 'bg-neon-green text-black hover:bg-green-400 shadow-[0_0_10px_rgba(0,255,65,0.3)]' 
                        : 'bg-gray-800 text-gray-500'
                    }`}
                >
                    <Icons.Edit /> Save Configuration
                </button>
            </div>
        </div>
    );
};

export default ConfigEditor;