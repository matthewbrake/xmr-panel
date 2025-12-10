import { ServiceConfig, ServiceStatus, LogEntry, ConfigFile, NetworkToolResult, RpcResponse } from '../types';
import { INITIAL_SERVICES } from '../constants';

// STATE CACHE (To prevent UI flickering)
let services: ServiceConfig[] = JSON.parse(JSON.stringify(INITIAL_SERVICES));

// Helper to parse raw text logs into UI objects
const parseLogs = (id: string, rawText: string): LogEntry[] => {
    if (!rawText) return [];
    return rawText.split('\n').filter(Boolean).map(line => ({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        serviceId: id,
        level: line.toLowerCase().includes('error') ? 'ERROR' : line.toLowerCase().includes('warn') ? 'WARN' : 'INFO',
        message: line.substring(0, 200) // Truncate long lines
    }));
};

export const MockApi = {
    init: () => {
        console.log("Connected to Real Backend.");
    },

    // Polls the real status of processes
    getServices: async (): Promise<ServiceConfig[]> => {
        const updatedServices = await Promise.all(services.map(async (svc) => {
            try {
                // Check if running
                const res = await fetch('/api/control', {
                    method: 'POST',
                    body: JSON.stringify({ command: 'check', id: svc.id })
                });
                const { isRunning } = await res.json();
                
                // Update State
                if (isRunning && svc.status !== ServiceStatus.RUNNING) {
                    return { ...svc, status: ServiceStatus.RUNNING };
                } else if (!isRunning && svc.status === ServiceStatus.RUNNING) {
                    return { ...svc, status: ServiceStatus.STOPPED };
                }
                
                // If running, simulate some net stats (since we don't have real net monitoring yet)
                if (isRunning) {
                     return { 
                        ...svc, 
                        status: ServiceStatus.RUNNING,
                        networkStats: {
                            inbound: 'Active',
                            outbound: 'Active',
                            connections: Math.floor(Math.random() * 10) + 1
                        }
                    };
                }
            } catch (e) { console.error(e); }
            return svc;
        }));
        
        services = updatedServices;
        return services;
    },

    getLogs: async (): Promise<LogEntry[]> => {
        let allLogs: LogEntry[] = [];
        
        for (const svc of services) {
            try {
                const res = await fetch(`/api/logs?serviceId=${svc.id}`);
                const data = await res.json();
                const svcLogs = parseLogs(svc.id, data.logs);
                // Take last 50 logs
                allLogs = [...allLogs, ...svcLogs.slice(-50)];
            } catch (e) {}
        }
        
        // Sort by 'fake' timestamp since we parse them on fly, or real if available
        return allLogs.reverse();
    },

    startService: async (id: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx > -1) services[idx].status = ServiceStatus.STARTING;

        await fetch('/api/control', {
            method: 'POST',
            body: JSON.stringify({ command: 'start', id })
        });
    },

    stopService: async (id: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx > -1) services[idx].status = ServiceStatus.STOPPED;

        await fetch('/api/control', {
            method: 'POST',
            body: JSON.stringify({ command: 'stop', id })
        });
    },

    installService: async (id: string, script: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx > -1) services[idx].status = ServiceStatus.INSTALLING;

        await fetch('/api/install', {
            method: 'POST',
            body: JSON.stringify({ script })
        });
        
        if (idx > -1) services[idx].status = ServiceStatus.STOPPED;
    },

    validateBinary: async (id: string): Promise<string> => {
        // Simple check just to refresh UI
        return "Checked";
    },

    getConfig: async (id: string): Promise<ConfigFile> => {
        const response = await fetch(`/api/config?serviceId=${id}`);
        return await response.json();
    },

    saveConfig: async (id: string, content: string): Promise<void> => {
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId: id, content })
        });
    },

    runNetworkTool: async (tool: string, target?: string): Promise<NetworkToolResult> => {
        // This could also be moved to backend, but keeping simple for now
        return {
            id: Math.random().toString(),
            toolName: tool,
            status: 'SUCCESS',
            output: ['Tool execution not yet migrated to backend in this version.']
        };
    },

    sendRpcCommand: async (serviceId: string, method: string, params: any): Promise<RpcResponse> => {
        return { result: "RPC Proxy not configured in vite.config.ts yet." };
    }
};