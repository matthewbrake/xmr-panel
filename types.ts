export enum ServiceStatus {
    STOPPED = 'STOPPED',
    STARTING = 'STARTING',
    RUNNING = 'RUNNING',
    ERROR = 'ERROR',
    INSTALLING = 'INSTALLING',
    VALIDATING = 'VALIDATING'
}

export interface ServiceConfig {
    id: string;
    name: string;
    description: string;
    paths: {
        binary: string;
        config: string;
        storage: string;
    };
    port: number;
    status: ServiceStatus;
    uptime?: number;
    version?: string;
    storageSize?: string;
    // New fields for extended metrics
    syncPercentage?: number; 
    peers?: {
        in: number;
        out: number;
    };
    networkStats?: {
        inbound: string;
        outbound: string;
        connections: number;
    };
}

export interface LogEntry {
    id: string;
    timestamp: string;
    serviceId: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG' | 'STEP';
    message: string;
}

export interface DocFile {
    id: string;
    title: string;
    content: string;
}

export interface ConfigFile {
    serviceId: string;
    content: string;
    path: string;
}

export interface NetworkToolResult {
    id: string;
    toolName: string;
    status: 'PENDING' | 'SUCCESS' | 'FAIL';
    output: string[];
}

export interface RpcResponse {
    result?: any;
    error?: {
        code: number;
        message: string;
    };
}