import { BookOpen, Check, Feather, FileText, Link2, MessageSquare, Moon, PanelLeft, Sparkles } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const scenes = [
  { title: "The bells before dawn", chapter: "Chapter twelve", text: "The bells began before dawn, each note crossing the valley like a question no one wanted to answer.", continuation: "Elian stood at the window of the Glass Abbey. Below him, the river carried the last of the stars toward the sea. For the first time in seven years, the western gate was open.", note: "The western gate", detail: "Sealed seven years ago after the disappearance of the abbey’s keeper. Only Elian knows where the key was hidden." },
  { title: "The moth market", chapter: "Chapter thirteen", text: "At dusk, the moth market opened beneath the bridge. Every lantern sold there remembered a different summer.", continuation: "Elian chose the smallest one. Inside its glass, a girl was laughing beside a river he had never seen. The merchant closed his hand around the coin and looked away.", note: "Mothlight Market", detail: "A market beneath the old bridge. Its lanterns hold memories, but the sellers never say whose." },
  { title: "A letter from the north", chapter: "Chapter fourteen", text: "Dear Juniper, the northbound train arrived empty again, except for a teacup that was still warm.", continuation: "I waited until the platform lights went out. Somewhere beyond the tracks, someone was singing the song you taught me. I think you should come home.", note: "The northbound train", detail: "Arrives at the last platform every evening. No passenger has stepped off it since the first snow." },
];

export function StoryWorkspace() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const scene = scenes[sceneIndex];

  return (
    <Tabs defaultValue="manuscript" className="story-workspace">
      <div className="workspace-bar">
        <div className="workspace-project"><Moon size={17} aria-hidden="true" /><span>The Glass Abbey</span></div>
        <span className="workspace-preview">Interactive preview</span>
      </div>
      <TabsList className="workspace-tabs" aria-label="Explore the writing studio">
        <TabsTrigger value="manuscript"><FileText size={16} aria-hidden="true" />Manuscript</TabsTrigger>
        <TabsTrigger value="lore"><BookOpen size={16} aria-hidden="true" />Lore Vault</TabsTrigger>
        <TabsTrigger value="ideas"><Sparkles size={16} aria-hidden="true" />Ideas</TabsTrigger>
      </TabsList>
      <TabsContent value="manuscript" className="workspace-panel">
        <div className="manuscript-layout">
          <aside className="scene-list" aria-label="Sample chapters">
            <p><PanelLeft size={15} aria-hidden="true" />Your manuscript</p>
            {scenes.map((item, index) => (
              <button key={item.title} type="button" aria-pressed={sceneIndex === index} onClick={() => { setSceneIndex(index); setShowNote(false); }}>
                <span>{item.chapter}</span>{item.title}
              </button>
            ))}
            <div className="scene-list-note"><Feather size={18} aria-hidden="true" /><span>One scene at a time.<br />A world taking shape.</span></div>
          </aside>
          <article className="manuscript-page" key={scene.chapter}>
            <div className="manuscript-meta"><span>{scene.chapter}</span><span><Check size={13} aria-hidden="true" />Sample draft</span></div>
            <h3>{scene.title}</h3>
            <p className="manuscript-opening">{scene.text}</p>
            <p>{scene.continuation}</p>
            <button type="button" className="lore-link" aria-expanded={showNote} aria-controls="linked-story-note" onClick={() => setShowNote(!showNote)}><Link2 size={15} aria-hidden="true" />{scene.note}<span>{showNote ? "Close note" : "Open note"}</span></button>
            {showNote && <div id="linked-story-note" className="linked-note"><BookOpen size={16} aria-hidden="true" /><div><strong>{scene.note}</strong><p>{scene.detail}</p></div></div>}
          </article>
        </div>
      </TabsContent>
      <TabsContent value="lore" className="workspace-panel">
        <div className="vault-panel">
          <div className="vault-intro"><BookOpen size={24} aria-hidden="true" /><h3>A world worth remembering.</h3><p>People, places, and the threads between them.</p></div>
          <div className="vault-grid">
            <article><span className="vault-symbol" aria-hidden="true">E</span><span className="vault-kind">Character</span><h4>Elian Voss</h4><p>The abbey’s reluctant archivist. Keeps a key he promised never to use.</p><span className="vault-connection"><Link2 size={14} aria-hidden="true" />The Glass Abbey</span></article>
            <article><span className="vault-symbol abbey-symbol" aria-hidden="true">⌂</span><span className="vault-kind">Place</span><h4>The Glass Abbey</h4><p>A home for forgotten things. Its western gate has been sealed for seven years.</p><span className="vault-connection"><Link2 size={14} aria-hidden="true" />The western gate</span></article>
            <article><span className="vault-symbol key-symbol" aria-hidden="true">✧</span><span className="vault-kind">Object</span><h4>The keeper’s key</h4><p>Warm to the touch. A small inscription reads: only what is lost may enter.</p><span className="vault-connection"><Link2 size={14} aria-hidden="true" />Elian Voss</span></article>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="ideas" className="workspace-panel">
        <div className="ideas-panel"><div className="ideas-heading"><MessageSquare size={24} aria-hidden="true" /><h3>Another way into the scene.</h3><p>Optional AI assistance, with you in control.</p></div><div className="idea-prompt">What if Elian decides not to open the gate?</div><div className="idea-response"><Sparkles size={18} aria-hidden="true" /><div><strong>A direction to explore</strong><p>Let the consequence come to him. A bell rings from beyond the sealed gate, and Elian recognises a voice he thought he had forgotten. Now staying still is a choice, too.</p><span>Illustrative response. No AI request is sent.</span></div></div></div>
      </TabsContent>
      <div className="workspace-foot"><span><Feather size={14} aria-hidden="true" />Your words. Your world.</span><span>A glimpse inside Solun</span></div>
    </Tabs>
  );
}
