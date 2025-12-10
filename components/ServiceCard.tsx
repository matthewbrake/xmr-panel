import React from 'react';
import { ServiceConfig, ServiceStatus } from '../types';
import { Icons } from '../constants';

interface ServiceCardProps {
    service: ServiceConfig;
    onStart: (id: string) => void;
    onStop: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onStart, onStop }) => {
    const isRunning = service.status === ServiceStatus.RUNNING;
    const isWorking = service.status === ServiceStatus.STARTING;

    return (
        <div className="bg-panel-bg border border-gray-800 rounded-lg p-5 relative overflow-hidden transition-all hover:border-gray-600 group">
            {/* Status Indicator Line */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${
                isRunning ? 'bg-neon-green shadow-[0_0_10px_#00ff41]' : 
                service.status === ServiceStatus.ERROR ? 'bg-neon-red' : 
                isWorking ? 'bg-yellow-400 animate-pulse' : 'bg-gray-700'
            }`} />

            <div className="flex justify-between items-start pl-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        {service.name}
                        {isRunning && <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                        </span>}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{service.description}</p>
                </div>
                <div className="text-right">
                    <div className={`font-mono text-sm font-bold ${
                        isRunning ? 'text-neon-green' : 'text-gray-500'
                    }`}>
                        {service.status}
                    </div>
                    {isRunning && (
                        <div className="text-xs text-gray-600 font-mono mt-1">
                            Port: <span className="text-gray-400">{service.port}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Binary Info */}
            <div className="mt-4 pl-3 bg-black/30 rounded p-2 border border-gray-800/50">
                 <div className="flex items-center gap-2 text-xs text-gray-500 font-mono truncate">
                    <Icons.Terminal />
                    {service.paths.binary}
                 </div>
            </div>

            {/* Controls */}
            <div className="mt-6 pl-3 flex gap-3">
                {!isRunning && (
                    <button
                        onClick={() => onStart(service.id)}
                        disabled={isWorking}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold transition-all ${
                            isWorking 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] border border-neon-green/30'
                        }`}
                    >
                        {isWorking ? <Icons.RefreshCw /> : <Icons.Play />}
                        {isWorking ? 'STARTING...' : 'START SERVICE'}
                    </button>
                )}
                
                {isRunning && (
                    <button
                        onClick={() => onStop(service.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold bg-neon-red/10 text-neon-red hover:bg-neon-red/20 border border-neon-red/30 transition-all"
                    >
                        <Icons.Square />
                        STOP SERVICE
                    </button>
                )}

                <button 
                    onClick={() => { onStop(service.id); setTimeout(() => onStart(service.id), 1000); }}
                    disabled={!isRunning && !isWorking}
                    className="p-2 rounded bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Restart"
                >
                    <Icons.RefreshCw />
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;