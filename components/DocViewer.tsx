import React, { useState } from 'react';
import { DOCS_DATA, Icons } from '../constants';

const DocViewer: React.FC = () => {
    const [activeDoc, setActiveDoc] = useState(DOCS_DATA[0]);

    return (
        <div className="h-full flex bg-panel-bg border border-gray-800 rounded-lg overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800 font-bold text-gray-300 flex items-center gap-2">
                    <Icons.Folder /> Knowledge Base
                </div>
                <div className="flex-1 p-2 space-y-1">
                    {DOCS_DATA.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => setActiveDoc(doc)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                activeDoc.id === doc.id 
                                ? 'bg-gray-800 text-white border-l-2 border-neon-blue' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        >
                            {doc.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <article className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-a:text-neon-blue prose-pre:bg-black prose-pre:border prose-pre:border-gray-800">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300">
                        {activeDoc.content}
                    </pre>
                </article>
            </div>
        </div>
    );
};

export default DocViewer;