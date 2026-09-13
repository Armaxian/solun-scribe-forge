import React from 'react';

import { Manuscript } from './Manuscript';

export function ManuscriptExample() {
  return (
    <Manuscript>
      <h1 className="typewriter text-3xl font-bold mb-6">The Art of Digital Writing</h1>
      
      <p className="mb-4 leading-relaxed">
        In the digital age, the tools we use to write shape not just our process, but our thinking itself. 
        The manuscript page container brings the tactile feel of traditional writing to the digital realm.
      </p>
      
      <p className="mb-4 leading-relaxed">
        Notice how the margin line guides your eye, just like in a traditional manuscript. The subtle 
        paper texture and soft shadows create a sense of depth and focus that's often missing in 
        modern digital interfaces.
      </p>
      
      <h2 className="typewriter text-xl font-semibold mb-3 mt-6">Why This Matters</h2>
      
      <p className="mb-4 leading-relaxed">
        When we write on a blank screen, we lose the physical constraints that have shaped writing 
        for centuries. The manuscript page restores those constraints in a digital form, helping 
        us focus on the words themselves.
      </p>
      
      <blockquote className="border-l-4 border-[var(--solun-green)] pl-4 py-2 my-6 italic text-gray-700">
        "The best writing happens when the tools disappear and only the words remain."
      </blockquote>
      
      <p className="mb-4 leading-relaxed">
        This component is perfect for long-form content, documentation, articles, or any writing 
        that benefits from the traditional manuscript format. The ghost annotations that appear on 
        hover add a playful editorial touch.
      </p>
    </Manuscript>
  );
}
