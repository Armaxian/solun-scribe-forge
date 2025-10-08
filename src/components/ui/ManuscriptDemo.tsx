import React from 'react';
import { Manuscript } from './Manuscript';

export function ManuscriptDemo() {
  return (
    <div className="min-h-screen bg-[var(--solun-cream)] py-8">
      <Manuscript>
        <h1 className="typewriter text-3xl font-bold mb-6">Write worlds.</h1>
        <p className="mb-4 leading-relaxed">
          The manuscript page container provides a beautiful paper-like surface for long-form content. 
          Notice the subtle margin line on the left and the ghost annotations that appear when you hover over the page.
        </p>
        <p className="mb-4 leading-relaxed">
          This component is perfect for articles, blog posts, documentation, or any content that benefits 
          from a traditional manuscript layout. The rounded corners and soft shadows give it a premium feel.
        </p>
        <h2 className="typewriter text-xl font-semibold mb-3 mt-6">Features</h2>
        <ul className="mb-4 space-y-2">
          <li className="flex items-start">
            <span className="label-mono mr-3 mt-1">01</span>
            <span>Centered layout with optimal reading width (78 characters)</span>
          </li>
          <li className="flex items-start">
            <span className="label-mono mr-3 mt-1">02</span>
            <span>Editor margin line for traditional manuscript feel</span>
          </li>
          <li className="flex items-start">
            <span className="label-mono mr-3 mt-1">03</span>
            <span>Ghost annotations that appear on hover</span>
          </li>
          <li className="flex items-start">
            <span className="label-mono mr-3 mt-1">04</span>
            <span>Responsive padding and typography</span>
          </li>
        </ul>
        <p className="leading-relaxed text-sm text-gray-600 italic">
          Hover over this page to see the editor annotations appear. The red margin line 
          provides a traditional manuscript feel, while the blue annotations simulate 
          editorial feedback.
        </p>
      </Manuscript>
    </div>
  );
}
