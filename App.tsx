import React, { useEffect, useState } from 'react';
import { Icons } from './constants';
import { ServiceConfig, LogEntry } from './types';
import { MockApi } from './services/mockService';
import ServiceDetailCard from './components/ServiceDetailCard';
import TerminalView from './components/TerminalView';
import ConfigEditor from './components/ConfigEditor';
import DocViewer from './components/DocViewer';
import NetworkStats from './components/NetworkStats';
import NetworkTools from './components/NetworkTools';
import RpcConsole from './components/RpcConsole';

type Tab = 'dashboard' | 'configs' | 'logs' | 'docs' | 'network' | 'rpc';

const App: React.FC = () => {
    const [services, setServices] = useState<ServiceConfig[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        MockApi.init();
        setIsLoaded(true);

        const interval = setInterval(async () => {
            const currentServices = await MockApi.getServices();
            const currentLogs = await MockApi.getLogs();
            setServices(currentServices);
            setLogs(currentLogs);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const refreshServices = async () => {
        const updated = await MockApi.getServices();
        setServices(updated);
    };

    if (!isLoaded) return <div className="h-screen bg-dark-bg flex items-center justify-center text-neon-green font-mono">INITIALIZING SYSTEM CONTROLLER...</div>;

    const navItem = (id: Tab, label: string, Icon: any) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                activeTab === id 
                ? 'border-neon-blue text-white bg-gray-800/50' 
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
        >
            <Icon /> {label}
        </button>
    );

    return (
        <div className="h-screen flex flex-col bg-dark-bg text-gray-300 font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="bg-panel-bg border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 py-3">
                    <div className="p-2 bg-neon-blue/10 rounded text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                        <Icons.Shield />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">PRIVACY SUITE <span className="text-neon-blue">CONTROLLER</span></h1>
                        <p className="text-xs text-gray-500 font-mono">v3.0.3-docker • Node.js Backend</p>
                    </div>
                </div>
                
                <nav className="flex h-full overflow-x-auto scrollbar-hide">
                    {navItem('dashboard', 'DASHBOARD', Icons.LayoutDashboard)}
                    {navItem('configs', 'CONFIGS', Icons.Edit)}
                    {navItem('network', 'NET TOOLS', Icons.Globe)}
                    {navItem('rpc', 'RPC API', Icons.Terminal)}
                    {navItem('logs', 'LOGS', Icons.Activity)}
                    {navItem('docs', 'DOCS', Icons.Folder)}
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden p-6 relative">
                
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-10">
                        {/* Service Cards Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {services.map(s => (
                                <ServiceDetailCard key={s.id} service={s} onRefresh={refreshServices} logs={logs} />
                            ))}
                            <div className="h-64">
                                <NetworkStats />
                            </div>
                        </div>

                        {/* Quick Logs Column */}
                        <div className="lg:col-span-1 h-full flex flex-col">
                            <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <Icons.Activity /> Global System Activity
                            </h3>
                            <div className="flex-1">
                                <TerminalView logs={logs} filter="all" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'configs' && (
                    <ConfigEditor services={services.map(s => ({ id: s.id, name: s.name }))} />
                )}

                {activeTab === 'network' && (
                    <NetworkTools />
                )}

                {activeTab === 'rpc' && (
                    <RpcConsole services={services} />
                )}

                {activeTab === 'logs' && (
                     <div className="h-full flex flex-col gap-4">
                        <div className="flex-1">
                             <TerminalView logs={logs} filter="all" />
                        </div>
                     </div>
                )}

                {activeTab === 'docs' && (
                    <DocViewer />
                )}

            </main>
        </div>
    );
};

export default App;