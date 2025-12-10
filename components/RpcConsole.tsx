import React, { useState } from 'react';
import { ServiceConfig } from '../types';
import { MockApi } from '../services/mockService';
import { Icons } from '../constants';

interface Props {
    services: ServiceConfig[];
}

const RpcConsole: React.FC<Props> = ({ services }) => {
    const [selectedService, setSelectedService] = useState(services[0].id);
    const [method, setMethod] = useState('');
    const [params, setParams] = useState('{}');
    const [history, setHistory] = useState<{ req: string, res: string }[]>([]);

    const handleSend = async () => {
        try {
            const parsedParams = JSON.parse(params);
            const res = await MockApi.sendRpcCommand(selectedService, method, parsedParams);
            
            const entry = {
                req: `${selectedService.toUpperCase()}: ${method}`,
                res: JSON.stringify(res, null, 2)
            };
            setHistory([entry, ...history]);
        } catch (e) {
            setHistory([{ req: method, res: "Error: Invalid JSON Params" }, ...history]);
        }
    };

    return (
        <div className="h-full flex gap-4">
            {/* Control Panel */}
            <div className="w-1/3 bg-panel-bg border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                     <div className="p-2 bg-purple-500/10 rounded text-purple-400"><Icons.Terminal /></div>
                     <h3 className="font-bold text-gray-200">RPC / API CONSOLE</h3>
                </div>

                <div>
                    <label className="text-xs text-gray-500 font-bold block mb-1">TARGET NODE</label>
                    <div className="flex gap-2">
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedService(s.id)}
                                className={`flex-1 py-2 text-xs font-bold rounded border ${
                                    selectedService === s.id 
                                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' 
                                    : 'bg-gray-800 border-gray-700 text-gray-400'
                                }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 font-bold block mb-1">METHOD</label>
                    <input 
                        type="text" 
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        placeholder="e.g. get_info"
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none font-mono"
                    />
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="text-xs text-gray-500 font-bold block mb-1">PARAMS (JSON)</label>
                    <textarea 
                        value={params}
                        onChange={(e) => setParams(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-green-400 font-mono resize-none focus:border-purple-500 outline-none"
                    />
                </div>

                <button 
                    onClick={handleSend}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                >
                    SEND REQUEST
                </button>
            </div>

            {/* Output Panel */}
            <div className="flex-1 bg-black border border-gray-800 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 text-xs font-bold text-gray-500">
                    RESPONSE HISTORY
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.length === 0 && <div className="text-gray-600 text-center mt-10 italic">Ready to send commands...</div>}
                    {history.map((h, i) => (
                        <div key={i} className="border-l-2 border-purple-500 pl-4">
                            <div className="text-xs text-purple-400 font-bold mb-1">{h.req}</div>
                            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{h.res}</pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RpcConsole;