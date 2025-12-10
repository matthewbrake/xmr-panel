import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { spawn, exec } from 'child_process';

// --- CONFIG MAPPINGS ---
const SERVICE_MAP = {
    tor: {
        conf: '/app/tor/config/torrc',
        bin: '/app/tor/bin/tor',
        log: '/app/tor/storage/tor.log',
        defaultConf: `Log notice file /app/tor/storage/tor.log\nSocksPort 0.0.0.0:9050\nDataDirectory /app/tor/storage\nControlPort 0.0.0.0:9051\nCookieAuthentication 1`
    },
    i2p: {
        conf: '/app/i2p/config/i2pd.conf',
        bin: '/app/i2p/bin/i2pd',
        log: '/app/i2p/storage/i2p.log',
        defaultConf: `## i2pd.conf\nlog = file\nlogfile = /app/i2p/storage/i2p.log\ndatadir = /app/i2p/storage\n[http]\nenabled = true\naddress = 0.0.0.0\nport = 4444`
    },
    monero: {
        conf: '/app/monero/config/monerod.conf',
        bin: '/app/monero/bin/monerod',
        log: '/app/monero/storage/monero.log',
        defaultConf: `# monerod.conf\ndata-dir=/app/monero/storage\nlog-file=/app/monero/storage/monero.log\nrpc-bind-ip=0.0.0.0\nrpc-bind-port=18081\nno-igd=1\nconfirm-external-bind=1`
    }
};

// Helper to ensure directory exists
const ensureDir = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// MIDDLEWARE: The "Real" Backend
const fileSystemMiddleware = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      
      // 1. GET CONFIG
      if (url.pathname === '/api/config' && req.method === 'GET') {
        const id = url.searchParams.get('serviceId');
        if (id && SERVICE_MAP[id]) {
            const filePath = SERVICE_MAP[id].conf;
            if (fs.existsSync(filePath)) {
                res.end(JSON.stringify({ serviceId: id, content: fs.readFileSync(filePath, 'utf-8'), path: filePath }));
            } else {
                res.end(JSON.stringify({ serviceId: id, content: SERVICE_MAP[id].defaultConf, path: filePath }));
            }
            return;
        }
      }

      // 2. SAVE CONFIG
      if (url.pathname === '/api/config' && req.method === 'POST') {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const data = JSON.parse(Buffer.concat(buffers).toString());
        
        if (SERVICE_MAP[data.serviceId]) {
            const filePath = SERVICE_MAP[data.serviceId].conf;
            ensureDir(filePath);
            fs.writeFileSync(filePath, data.content);
            res.end(JSON.stringify({ success: true }));
            return;
        }
      }

      // 3. SERVICE CONTROL (Start/Stop)
      if (url.pathname === '/api/control' && req.method === 'POST') {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const { command, id } = JSON.parse(Buffer.concat(buffers).toString());
        const svc = SERVICE_MAP[id];

        if (!svc) { res.statusCode = 400; res.end('Invalid ID'); return; }

        if (command === 'start') {
            // Check if binary exists
            if (!fs.existsSync(svc.bin)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: `Binary not found at ${svc.bin}` }));
                return;
            }

            ensureDir(svc.log);
            
            // Spawn Process Detached
            // We use 'nohup' style via shell to ensure logging works as expected
            const cmdString = `${svc.bin} --config ${svc.conf} > ${svc.log} 2>&1 &`;
            
            exec(cmdString, (error) => {
                if (error) console.error(`Exec error: ${error}`);
            });

            res.end(JSON.stringify({ success: true, message: 'Process spawned' }));
            return;
        }

        if (command === 'stop') {
            // Kill by binary name
            const binName = path.basename(svc.bin);
            exec(`pkill -f ${binName}`, (err) => {
                res.end(JSON.stringify({ success: true }));
            });
            return;
        }

        if (command === 'check') {
            const binName = path.basename(svc.bin);
            exec(`pgrep -f ${binName}`, (err, stdout) => {
                const isRunning = !!stdout.trim();
                res.end(JSON.stringify({ isRunning }));
            });
            return;
        }
      }

      // 4. INSTALL / EXECUTE SCRIPT
      if (url.pathname === '/api/install' && req.method === 'POST') {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const { script } = JSON.parse(Buffer.concat(buffers).toString());

        const tmpScript = `/tmp/install_${Date.now()}.sh`;
        fs.writeFileSync(tmpScript, script);
        fs.chmodSync(tmpScript, '755');

        exec(`bash ${tmpScript}`, (error, stdout, stderr) => {
            const output = stdout + '\n' + stderr;
            fs.unlinkSync(tmpScript); // Cleanup
            res.end(JSON.stringify({ output, success: !error }));
        });
        return;
      }

      // 5. READ LOGS
      if (url.pathname === '/api/logs' && req.method === 'GET') {
         const id = url.searchParams.get('serviceId');
         if (id && SERVICE_MAP[id] && fs.existsSync(SERVICE_MAP[id].log)) {
             // Read last 4KB of logs
             const logPath = SERVICE_MAP[id].log;
             const stats = fs.statSync(logPath);
             const size = stats.size;
             const readSize = Math.min(size, 8192); // Last 8KB
             const buffer = Buffer.alloc(readSize);
             
             const fd = fs.openSync(logPath, 'r');
             fs.readSync(fd, buffer, 0, readSize, size - readSize);
             fs.closeSync(fd);
             
             res.end(JSON.stringify({ logs: buffer.toString() }));
             return;
         }
         res.end(JSON.stringify({ logs: '' }));
         return;
      }

      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), fileSystemMiddleware()],
  server: {
    port: 3000,
    host: true, 
    watch: { usePolling: true }
  }
});