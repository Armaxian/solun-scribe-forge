import React from 'react';

export function FontDemo() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography Demo</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Monospace (Courier) - Default body text</h3>
            <p className="font-mono">
              The quick brown fox jumps over the lazy dog. This is the default monospace font for body text.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Typewriter (Courier Prime)</h3>
            <p className="typewriter">
              The quick brown fox jumps over the lazy dog. This is the typewriter font with monospace spacing.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Mono (Azeret Mono)</h3>
            <p className="font-mono">
              The quick brown fox jumps over the lazy dog. This is the monospace font for code and labels.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Label Mono Utility</h3>
            <p className="label-mono">
              This is a label with uppercase, small text, and monospace font
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
