import { ServiceConfig, ServiceStatus, LogEntry, ConfigFile, NetworkToolResult, RpcResponse } from '../types';
import { INITIAL_SERVICES } from '../constants';

// SIMULATED BACKEND STATE
let services: ServiceConfig[] = INITIAL_SERVICES as unknown as ServiceConfig[];
let logs: LogEntry[] = [];

// MOCK DATA STORES
const mockConfigs: Record<string, string> = {
    tor: `Log notice stdout\nSocksPort 0.0.0.0:9050\nDataDirectory /app/tor/storage\nControlPort 9051`,
    i2p: `## i2pd.conf\nlog = stdout\ndatadir = /app/i2p/storage\n[http]\nenabled = true\naddress = 0.0.0.0\nport = 4444`,
    monero: `# monerod.conf\ndata-dir=/app/monero/storage\nlog-file=/dev/stdout\nrpc-bind-ip=0.0.0.0\nrpc-bind-port=18081\nno-igd=1`
};

const mockVersions: Record<string, string> = {
    tor: '0.4.7.13 (git-836622b38)',
    i2p: '2.45.0-purple',
    monero: 'v0.18.3.1-release'
};

const mockStorage: Record<string, string> = {
    tor: '45 MB',
    i2p: '128 MB',
    monero: '142 GB'
};

// HELPER: Generate Log
const addLog = (serviceId: string, level: LogEntry['level'], message: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    
    const entry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: `${timeStr}.${ms}`,
        serviceId,
        level,
        message
    };
    logs = [entry, ...logs].slice(0, 5000); 
    return entry;
};

// SIMULATE SYNCING AND PEERS
setInterval(() => {
    services = services.map(s => {
        if (s.status === ServiceStatus.RUNNING) {
            // Update Sync %
            let newSync = (s.syncPercentage || 0);
            if (newSync < 100) newSync += 0.1;
            
            // Fluctuating Network Stats
            const inSpeed = (Math.random() * 500).toFixed(1);
            const outSpeed = (Math.random() * 200).toFixed(1);

            return {
                ...s,
                syncPercentage: parseFloat(newSync.toFixed(2)),
                peers: {
                    in: s.peers?.in || Math.floor(Math.random() * 10),
                    out: s.peers?.out || Math.floor(Math.random() * 12) + 8
                },
                networkStats: {
                    inbound: `${inSpeed} KB/s`,
                    outbound: `${outSpeed} KB/s`,
                    connections: (s.peers?.in || 0) + (s.peers?.out || 0)
                }
            };
        }
        return s;
    });
}, 2000);

export const MockApi = {
    init: () => {
        addLog('system', 'INFO', 'Privacy Suite Controller v3.0 Booting...');
        addLog('system', 'INFO', 'Verifying directory structure at /app...');
        services.forEach(s => {
            const sIndex = services.findIndex(ser => ser.id === s.id);
            services[sIndex].version = 'Unknown';
            services[sIndex].storageSize = '0 B';
            services[sIndex].syncPercentage = 0;
            services[sIndex].peers = { in: 0, out: 0 };
        });
    },

    getServices: async (): Promise<ServiceConfig[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...services]), 200));
    },

    getLogs: async (): Promise<LogEntry[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...logs]), 200));
    },

    startService: async (id: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx === -1) return;

        services[idx].status = ServiceStatus.STARTING;
        addLog('system', 'INFO', `Executing: ${services[idx].paths.binary} --config ${services[idx].paths.config}`);
        
        // Simulate Process
        setTimeout(() => {
            services[idx].status = ServiceStatus.RUNNING;
            services[idx].uptime = 1;
            services[idx].storageSize = mockStorage[id];
            services[idx].version = mockVersions[id];
            services[idx].syncPercentage = id === 'monero' ? 98.4 : 100; // Simulate Monero catchup
            services[idx].peers = { in: 8, out: 12 };
            
            addLog(id, 'INFO', 'Process started successfully (PID: ' + Math.floor(Math.random() * 9000 + 1000) + ')');
            
            if (id === 'monero') {
                addLog(id, 'INFO', 'Initializing cryptonote protocol...');
                addLog(id, 'INFO', 'Loading blockchain from ' + services[idx].paths.storage);
            }
        }, 2000);
    },

    stopService: async (id: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx === -1) return;

        addLog(id, 'WARN', 'Received SIGTERM');
        services[idx].status = ServiceStatus.STOPPED;
        services[idx].uptime = 0;
        services[idx].syncPercentage = 0;
        services[idx].peers = { in: 0, out: 0 };
        services[idx].networkStats = { connections: 0, inbound: '0 B', outbound: '0 B' };
        addLog('system', 'SUCCESS', `Service ${id} stopped gracefully`);
    },

    validateBinary: async (id: string): Promise<string> => {
        const idx = services.findIndex(s => s.id === id);
        services[idx].status = ServiceStatus.VALIDATING;
        addLog(id, 'DEBUG', 'Running --version check...');
        
        return new Promise(resolve => {
            setTimeout(() => {
                const v = mockVersions[id] || 'Unknown';
                services[idx].version = v;
                if (services[idx].status === ServiceStatus.VALIDATING) {
                    services[idx].status = ServiceStatus.STOPPED;
                }
                addLog(id, 'SUCCESS', `Binary verification passed: ${v}`);
                resolve(v);
            }, 1000);
        });
    },

    installService: async (id: string, script: string): Promise<void> => {
        const idx = services.findIndex(s => s.id === id);
        if (idx === -1) return;

        services[idx].status = ServiceStatus.INSTALLING;
        addLog(id, 'INFO', 'Executing Installation Script...');
        addLog(id, 'DEBUG', `Target Dir: ${services[idx].paths.binary.split('/').slice(0, -1).join('/')}`);

        const lines = script.split('\n');
        let totalDelay = 0;
        
        lines.forEach(line => {
            if (line.trim()) {
                const delay = Math.random() * 500 + 200;
                totalDelay += delay;
                setTimeout(() => addLog(id, 'STEP', `> ${line}`), totalDelay);
            }
        });

        setTimeout(() => {
            addLog(id, 'SUCCESS', 'Installation script completed. Binaries unpacked.');
            services[idx].status = ServiceStatus.STOPPED;
            services[idx].version = mockVersions[id];
        }, totalDelay + 1000);
    },

    getConfig: async (id: string): Promise<ConfigFile> => {
        const service = services.find(s => s.id === id);
        return {
            serviceId: id,
            content: mockConfigs[id] || '# No config found',
            path: service?.paths.config || ''
        };
    },

    saveConfig: async (id: string, content: string): Promise<void> => {
        addLog('system', 'WARN', `Writing new configuration to /app/${id}/config/...`);
        mockConfigs[id] = content;
        addLog('system', 'SUCCESS', 'Configuration saved. Restart service to apply.');
    },

    runNetworkTool: async (tool: string, target?: string): Promise<NetworkToolResult> => {
        addLog('network', 'STEP', `Running tool: ${tool} ${target || ''}`);
        return new Promise(resolve => {
            setTimeout(() => {
                // ... (Existing tool logic) ...
                let result: NetworkToolResult = {
                    id: Math.random().toString(),
                    toolName: tool,
                    status: 'SUCCESS',
                    output: ['Command executed successfully.']
                };
                if(tool === 'ping') {
                    result.output = [`Pinging ${target}...`, `Reply from ${target}: bytes=32 time=14ms`, `Reply from ${target}: bytes=32 time=15ms`];
                }
                resolve(result);
            }, 1000);
        });
    },

    // NEW: RPC SIMULATION
    sendRpcCommand: async (serviceId: string, method: string, params: any): Promise<RpcResponse> => {
        addLog(serviceId, 'INFO', `RPC Call: ${method} ${JSON.stringify(params)}`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                if (services.find(s => s.id === serviceId)?.status !== ServiceStatus.RUNNING) {
                    addLog(serviceId, 'ERROR', `RPC Failed: Service not running`);
                    resolve({ error: { code: -1, message: "Service not running" }});
                    return;
                }

                if (serviceId === 'monero' && method === 'get_info') {
                    resolve({
                        result: {
                            height: 2983120,
                            target_height: 2983122,
                            difficulty: 2983120123,
                            tx_count: 120,
                            tx_pool_size: 4,
                            alt_blocks_count: 0,
                            outgoing_connections_count: 12,
                            incoming_connections_count: 8,
                            white_peerlist_size: 1000,
                            grey_peerlist_size: 5000,
                            mainnet: true,
                            synchronized: true
                        }
                    });
                } else if (serviceId === 'tor' && method === 'GETINFO') {
                    resolve({ result: { version: "0.4.7.13", traffic: { read: 12345, written: 54321 } } });
                } else {
                    resolve({ result: { status: "OK", method: method, data: "Simulated Response" } });
                }
            }, 800);
        });
    }
};