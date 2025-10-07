import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <Helmet>
        <title>Solun - Write worlds. Keep them true.</title>
        <meta name="description" content="A premium AI workspace for writers and world-builders. Distraction-free editor, Lore Vault, and RAG-powered chat working in harmony." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B3D2E" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)] selection:bg-[#1E7F5C]/20">
        <Outlet />
      </div>
    </>
  );
}
