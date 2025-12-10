import React, { useState } from 'react';
import { MockApi } from '../services/mockService';
import { Icons } from '../constants';
import { NetworkToolResult } from '../types';

const NetworkTools: React.FC = () => {
    const [results, setResults] = useState<NetworkToolResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [pingTarget, setPingTarget] = useState('8.8.8.8');

    const runTool = async (tool: string, target?: string) => {
        setIsRunning(true);
        const res = await MockApi.runNetworkTool(tool, target);
        setResults(prev => [res, ...prev]);
        setIsRunning(false);
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-4">
            {/* Controls */}
            <div className="w-full md:w-1/3 space-y-4">
                <div className="bg-panel-bg border border-gray-800 rounded-lg p-4">
                    <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2"><Icons.Globe /> Connectivity Tools</h3>
                    
                    <div className="space-y-3">
                        <div className="p-3 bg-black/30 rounded border border-gray-800">
                            <label className="text-xs text-gray-500 font-bold block mb-2">PING UTILITY</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={pingTarget} 
                                    onChange={(e) => setPingTarget(e.target.value)}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 text-sm text-gray-300"
                                />
                                <button 
                                    onClick={() => runTool('ping', pingTarget)}
                                    disabled={isRunning}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold"
                                >
                                    PING
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => runTool('check_tor')}
                                disabled={isRunning}
                                className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs font-bold flex flex-col items-center gap-2"
                            >
                                <span className="text-neon-green">●</span> Test Tor Proxy
                            </button>
                            <button 
                                onClick={() => runTool('check_i2p')}
                                disabled={isRunning}
                                className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs font-bold flex flex-col items-center gap-2"
                            >
                                <span className="text-neon-blue">●</span> Test I2P Proxy
                            </button>
                            <button 
                                onClick={() => runTool('netstat')}
                                disabled={isRunning}
                                className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs font-bold flex flex-col items-center gap-2 col-span-2"
                            >
                                <Icons.Activity /> Check Listening Ports
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Output */}
            <div className="flex-1 bg-black border border-gray-800 rounded-lg overflow-hidden flex flex-col">
                <div className="p-2 bg-gray-900 border-b border-gray-800 text-xs font-bold text-gray-400">
                    TOOL OUTPUT LOG
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                    {results.length === 0 && <div className="text-gray-600 text-center mt-10">Select a tool to verify network connectivity.</div>}
                    {results.map((res) => (
                        <div key={res.id} className="border-l-2 border-gray-700 pl-3">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-neon-blue uppercase">{res.toolName}</span>
                                <span className={res.status === 'SUCCESS' ? 'text-neon-green' : 'text-neon-red'}>{res.status}</span>
                            </div>
                            <div className="text-gray-300">
                                {res.output.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NetworkTools;