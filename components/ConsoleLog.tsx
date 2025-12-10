import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Icons } from '../constants';

interface ConsoleLogProps {
    logs: LogEntry[];
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'WARN': return 'text-yellow-400';
            case 'ERROR': return 'text-red-500';
            case 'SUCCESS': return 'text-neon-green';
            case 'STEP': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-panel-bg border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <Icons.Terminal />
                    <span className="font-mono text-sm font-bold text-gray-300">SYSTEM CONSOLE</span>
                </div>
                <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm space-y-1 bg-black/90">
                {logs.length === 0 && <span className="text-gray-600 italic">Waiting for logs...</span>}
                {logs.slice().reverse().map((log) => (
                    <div key={log.id} className="flex">
                        <span className="text-gray-500 min-w-[80px] select-none">[{log.timestamp}]</span>
                        <span className={`min-w-[70px] font-bold ${getLevelColor(log.level)}`}>{log.level}</span>
                        <span className="text-cyan-600 min-w-[100px] hidden md:block">[{log.serviceId}]</span>
                        <span className="text-gray-300 break-all">{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ConsoleLog;