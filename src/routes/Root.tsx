import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <Helmet>
        <title>Solun - Write worlds. Keep them true.</title>
        <meta name="description" content="A local-first desktop writing studio with a focused editor, Lore Vault, and optional AI assistance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B3D2E" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>
      <Outlet />
    </>
  );
}
