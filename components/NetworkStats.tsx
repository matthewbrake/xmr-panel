import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', tor: 400, i2p: 240, monero: 240 },
  { name: '00:05', tor: 300, i2p: 139, monero: 221 },
  { name: '00:10', tor: 200, i2p: 980, monero: 229 },
  { name: '00:15', tor: 278, i2p: 390, monero: 200 },
  { name: '00:20', tor: 189, i2p: 480, monero: 218 },
  { name: '00:25', tor: 239, i2p: 380, monero: 250 },
  { name: '00:30', tor: 349, i2p: 430, monero: 210 },
];

const NetworkStats = () => {
  return (
    <div className="bg-panel-bg border border-gray-800 rounded-lg p-4 h-full flex flex-col">
        <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
            Network Activity (KB/s)
        </h3>
        <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                <defs>
                    <linearGradient id="colorTor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorI2p" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#333' }}
                    itemStyle={{ color: '#ccc' }}
                />
                <Area type="monotone" dataKey="tor" stackId="1" stroke="#8884d8" fill="url(#colorTor)" />
                <Area type="monotone" dataKey="i2p" stackId="1" stroke="#00f3ff" fill="url(#colorI2p)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}

export default NetworkStats;