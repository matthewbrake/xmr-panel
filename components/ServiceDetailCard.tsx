import React, { useState } from 'react';
import { ServiceConfig, ServiceStatus, LogEntry } from '../types';
import { Icons } from '../constants';
import { MockApi } from '../services/mockService';
import TerminalView from './TerminalView';

interface Props {
    service: ServiceConfig;
    onRefresh: () => void;
    logs: LogEntry[];
}

const ServiceDetailCard: React.FC<Props> = ({ service, onRefresh, logs }) => {
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [showConsole, setShowConsole] = useState(false);
    
    // SMART INSTALL SCRIPT
    const [installScript, setInstallScript] = useState(`#!/bin/bash
# ---------------------------------------------------------
# SMART INSTALLER FOR ${service.name.toUpperCase()}
# ---------------------------------------------------------
# 1. Downloads the binary
# 2. Extracts it
# 3. LOCATES the specific binary file (${service.paths.binary.split('/').pop()}) 
#    and moves it to the target folder, regardless of subfolder structure.

TARGET_DIR="$(dirname ${service.paths.binary})"
BINARY_NAME="$(basename ${service.paths.binary})"

echo "[*] Target Directory: $TARGET_DIR"
echo "[*] Binary Name: $BINARY_NAME"

mkdir -p $TARGET_DIR
cd $TARGET_DIR

# --- EXAMPLE: MONERO ---
# URL="https://downloads.getmonero.org/cli/linux64"
# echo "Downloading Monero..."
# wget -q -O monero.tar.bz2 $URL
# echo "Extracting..."
# tar -xjf monero.tar.bz2
# echo "Searching for binary..."
# find . -name "$BINARY_NAME" -type f -exec mv {} . \;
# chmod +x $BINARY_NAME
# rm monero.tar.bz2
# echo "Done!"

# --- EXAMPLE: TOR ---
# apt-get update && apt-get install -y tor
# cp /usr/bin/tor $TARGET_DIR/tor

echo "Please uncomment the section above relevant to your service or paste your own script!"
`);

    const isRunning = service.status === ServiceStatus.RUNNING;
    const isInstalling = service.status === ServiceStatus.INSTALLING;
    const isWorking = service.status === ServiceStatus.STARTING || isInstalling;

    const handleInstall = async () => {
        setShowInstallModal(false);
        setShowConsole(true);
        await MockApi.installService(service.id, installScript);
        onRefresh();
    };

    const handleValidate = async () => {
        setShowConsole(true);
        await MockApi.validateBinary(service.id);
        onRefresh();
    }

    return (
        <div className="bg-panel-bg border border-gray-800 rounded-lg overflow-hidden group hover:border-gray-600 transition-all shadow-lg flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] transition-colors ${
                        isRunning ? 'bg-neon-green text-neon-green' : 
                        service.status === ServiceStatus.ERROR ? 'bg-neon-red text-neon-red' : 
                        isWorking ? 'bg-yellow-400 text-yellow-400 animate-pulse' :
                        'bg-gray-600 text-gray-600'
                    }`} />
                    <div>
                        <h2 className="text-lg font-bold text-gray-100 leading-none flex items-center gap-2">
                            {service.name}
                        </h2>
                        <span className="text-xs font-mono text-gray-500">{service.status}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setShowConsole(!showConsole)} className={`p-2 rounded transition-colors ${showConsole ? 'bg-neon-blue/20 text-neon-blue' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}><Icons.Terminal /></button>
                     <div className="w-px h-8 bg-gray-800 mx-1"></div>
                     <button onClick={handleValidate} disabled={isWorking} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white disabled:opacity-50"><Icons.CheckCircle /></button>
                     <button onClick={() => setShowInstallModal(true)} disabled={isWorking || isRunning} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white disabled:opacity-50"><Icons.Download /></button>
                </div>
            </div>

            {/* Sync Status Bar */}
            {service.syncPercentage !== undefined && (
                <div className="h-1 bg-gray-800 w-full relative">
                    <div 
                        className="h-full bg-neon-blue transition-all duration-1000 ease-out shadow-[0_0_10px_#00f3ff]" 
                        style={{ width: `${service.syncPercentage}%` }}
                    />
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800">
                <div className="bg-panel-bg p-3">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Peers (In/Out)</div>
                    <div className="font-mono text-sm text-gray-300">
                        <span className="text-neon-green">↓{service.peers?.in || 0}</span> / <span className="text-neon-blue">↑{service.peers?.out || 0}</span>
                    </div>
                </div>
                <div className="bg-panel-bg p-3">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Bandwidth</div>
                    <div className="font-mono text-sm text-gray-300 flex flex-col leading-tight">
                         <span>IN: {service.networkStats?.inbound || '0 B/s'}</span>
                         <span>OUT: {service.networkStats?.outbound || '0 B/s'}</span>
                    </div>
                </div>
                <div className="bg-panel-bg p-3">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Storage / Sync</div>
                    <div className="font-mono text-sm text-gray-300">
                        {service.storageSize}
                        {service.syncPercentage !== undefined && <span className="text-neon-blue text-xs block">{service.syncPercentage}% Synced</span>}
                    </div>
                </div>
                <div className="bg-panel-bg p-3">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Port Check</div>
                    <div className={`font-mono text-sm ${isRunning ? 'text-neon-green' : 'text-gray-500'}`}>
                        {service.port} {isRunning ? '●' : '○'}
                    </div>
                </div>
            </div>

            {/* Embedded Console */}
            {showConsole && (
                <div className="h-48 border-t border-b border-gray-800 bg-black relative animate-in slide-in-from-top-2 fade-in duration-200">
                    <TerminalView logs={logs} filter={service.id} compact={true} />
                </div>
            )}

            {/* Action Bar */}
            <div className="p-4 flex gap-3 bg-gray-900/30">
                {!isRunning ? (
                    <button 
                        onClick={() => { setShowConsole(true); MockApi.startService(service.id).then(onRefresh); }}
                        disabled={isWorking}
                        className={`flex-1 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            isWorking ? 'bg-gray-800 text-gray-500' : 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                        }`}
                    >
                        {isWorking ? <Icons.RefreshCw /> : <Icons.Play />}
                        {isWorking ? 'WORKING...' : 'START SERVICE'}
                    </button>
                ) : (
                    <button 
                        onClick={() => MockApi.stopService(service.id).then(onRefresh)}
                        className="flex-1 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20 shadow-[0_0_15px_rgba(255,0,60,0.1)]"
                    >
                        <Icons.Square />
                        TERMINATE
                    </button>
                )}
                
                <button 
                    disabled={!isRunning}
                    onClick={() => { setShowConsole(true); MockApi.stopService(service.id).then(() => setTimeout(() => MockApi.startService(service.id), 1000)).then(onRefresh); }}
                    className="px-4 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 disabled:opacity-50 transition-colors"
                    title="Restart Service"
                >
                    <Icons.RefreshCw />
                </button>
            </div>

            {/* Install Modal */}
            {showInstallModal && (
                <div className="absolute inset-0 bg-black/95 z-20 flex flex-col p-4 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-neon-blue font-bold flex items-center gap-2"><Icons.Download /> BINARY INSTALLER</h3>
                         <button onClick={() => setShowInstallModal(false)}><Icons.XCircle /></button>
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded border border-gray-800 mb-2">
                         <p className="text-[10px] text-gray-500 font-mono uppercase">TARGET BINARY PATH (MAPPED TO HOST)</p>
                         <p className="text-xs text-gray-300 font-mono">{service.paths.binary}</p>
                    </div>
                    <textarea 
                        value={installScript}
                        onChange={(e) => setInstallScript(e.target.value)}
                        className="flex-1 bg-[#0d1117] border border-gray-700 rounded p-3 text-xs font-mono text-green-400 resize-none focus:outline-none focus:border-neon-blue mb-2 shadow-inner"
                        spellCheck={false}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowInstallModal(false)} className="px-4 py-2 text-xs bg-gray-800 rounded text-gray-300 hover:bg-gray-700 font-bold border border-gray-700">Cancel</button>
                        <button onClick={handleInstall} className="px-4 py-2 text-xs bg-neon-blue text-black font-bold rounded hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.3)]">EXECUTE SCRIPT</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailCard;