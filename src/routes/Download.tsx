import { Download as DownloadIcon, Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { detectPlatform, getPlatformLabel, type Platform } from "@/lib/platform";

const installers = {
  windows: [
    { type: ".exe", size: "~85 MB", sha256: "placeholder-hash-windows-exe" },
    { type: ".msi", size: "~82 MB", sha256: "placeholder-hash-windows-msi" },
  ],
  mac: [
    { type: ".dmg (Apple Silicon)", size: "~78 MB", sha256: "placeholder-hash-mac-arm" },
    { type: ".dmg (Intel)", size: "~80 MB", sha256: "placeholder-hash-mac-intel" },
  ],
  linux: [
    { type: ".AppImage", size: "~90 MB", sha256: "placeholder-hash-linux-appimage" },
    { type: ".deb", size: "~75 MB", sha256: "placeholder-hash-linux-deb" },
  ],
};

export default function Download() {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const currentInstallers = platform !== 'unknown' ? installers[platform] : [];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="section">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Download Solun
            </h1>
            <p className="text-lg text-muted-foreground">
              Get started with the premium writing workspace
            </p>
          </div>

          {/* Detected Platform */}
          {platform !== 'unknown' && (
            <div className="card-hover mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    {getPlatformLabel(platform)}
                  </h2>
                  <p className="text-muted-foreground">
                    We've detected your operating system
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {currentInstallers.map((installer) => (
                  <div
                    key={installer.type}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                  >
                    <div>
                      <p className="font-medium mb-1">{installer.type}</p>
                      <p className="text-sm text-muted-foreground">{installer.size}</p>
                    </div>
                    <Button className="btn-hero">
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <details className="mt-6 group">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  View SHA256 hashes
                </summary>
                <div className="mt-3 space-y-2 pl-6">
                  {currentInstallers.map((installer) => (
                    <div key={installer.type} className="text-xs font-mono text-muted-foreground">
                      <span className="font-semibold">{installer.type}:</span> {installer.sha256}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* All Platforms */}
          <div className="space-y-6">
            <button
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="w-full text-left"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 hover:text-phthalo transition-colors">
                <ChevronDown className={`h-4 w-4 transition-transform ${showAllPlatforms ? 'rotate-180' : ''}`} />
                Other platforms
              </h3>
            </button>

            {showAllPlatforms && (
              <div className="space-y-6">
                {Object.entries(installers).map(([platformKey, platformInstallers]) => (
                  <div key={platformKey} className="card">
                    <h4 className="text-xl font-semibold mb-4 capitalize">
                      {getPlatformLabel(platformKey as Platform)}
                    </h4>
                    <div className="space-y-3">
                      {platformInstallers.map((installer) => (
                        <div
                          key={installer.type}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                        >
                          <div>
                            <p className="font-medium text-sm">{installer.type}</p>
                            <p className="text-xs text-muted-foreground">{installer.size}</p>
                          </div>
                          <Button size="sm" variant="outline" className="btn-ghost">
                            <DownloadIcon className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Installation Help */}
          <div className="card mt-8">
            <h3 className="text-xl font-semibold mb-4">Having issues?</h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium hover:text-phthalo transition-colors flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  How do I install on Windows?
                </summary>
                <p className="mt-2 pl-6 text-sm text-muted-foreground">
                  Download the .exe or .msi file and run it. Follow the installation wizard. 
                  Windows may show a SmartScreen warning—click "More info" then "Run anyway."
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium hover:text-phthalo transition-colors flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  How do I install on macOS?
                </summary>
                <p className="mt-2 pl-6 text-sm text-muted-foreground">
                  Open the .dmg file and drag Solun to your Applications folder. 
                  First launch: right-click → Open to bypass Gatekeeper if needed.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium hover:text-phthalo transition-colors flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  How do I install on Linux?
                </summary>
                <p className="mt-2 pl-6 text-sm text-muted-foreground">
                  For AppImage: make it executable (chmod +x) and run. For .deb: sudo dpkg -i solun.deb
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
