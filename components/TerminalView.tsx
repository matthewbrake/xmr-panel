import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { Icons } from '../constants';

interface Props {
    logs: LogEntry[];
    filter?: string; // 'system', 'tor', 'i2p', 'monero'
    compact?: boolean;
}

const TerminalView: React.FC<Props> = ({ logs, filter, compact = false }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showDebug, setShowDebug] = useState(false);

    // Filter logs
    const displayedLogs = logs.filter(l => {
        if (filter && l.serviceId !== filter && filter !== 'all') return false;
        if (!showDebug && l.level === 'DEBUG') return false;
        return true;
    });

    useEffect(() => {
        if (autoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [displayedLogs, autoScroll]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'WARN': return 'text-yellow-400';
            case 'ERROR': return 'text-neon-red bg-red-900/20';
            case 'SUCCESS': return 'text-neon-green';
            case 'DEBUG': return 'text-gray-500';
            case 'STEP': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className={`flex flex-col bg-black overflow-hidden font-mono ${compact ? 'h-full border-none' : 'h-full border border-gray-800 rounded-lg shadow-2xl'}`}>
            {/* Toolbar */}
            <div className={`flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 ${compact ? 'py-1 px-2' : ''}`}>
                <div className="flex gap-4 items-center">
                    <span className={`font-bold text-gray-300 flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
                        <Icons.Terminal /> {filter === 'all' ? 'SYSTEM AGGREGATE' : filter?.toUpperCase()} LOGS
                    </span>
                    {!compact && (
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white">
                            <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} className="rounded bg-gray-800 border-gray-700" />
                            Show Verbose/Debug
                        </label>
                    )}
                </div>
                <button 
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`text-[10px] uppercase px-2 py-0.5 rounded border ${autoScroll ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' : 'border-gray-700 text-gray-500'}`}
                >
                    {autoScroll ? 'Scroll: ON' : 'Scroll: OFF'}
                </button>
            </div>

            {/* Log Area */}
            <div className={`flex-1 overflow-y-auto space-y-1 ${compact ? 'p-2 text-[10px]' : 'p-4 text-xs md:text-sm'}`}>
                {displayedLogs.length === 0 && <div className="text-gray-600 italic">No logs available for {filter}...</div>}
                {displayedLogs.map((log) => (
                    <div key={log.id} className={`flex gap-3 hover:bg-white/5 p-0.5 rounded ${log.level === 'ERROR' ? 'bg-red-900/10' : ''}`}>
                        <span className="text-gray-600 select-none min-w-[70px]">{log.timestamp}</span>
                        <span className={`font-bold min-w-[50px] ${getLevelColor(log.level)}`}>{log.level}</span>
                        {filter === 'all' && (
                            <span className="text-cyan-600 min-w-[60px] uppercase">[{log.serviceId}]</span>
                        )}
                        <span className="text-gray-300 break-all">{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TerminalView;