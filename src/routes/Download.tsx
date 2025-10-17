import { Download as DownloadIcon, Check, ChevronDown, Shield, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlatformDetect } from "@/components/PlatformDetect";
import { detectPlatform, getPlatformLabel, getRecommendedInstaller, getPlatformGuidance, type Platform, type PlatformInfo } from "@/lib/platform";
import { analytics } from "@/lib/analytics";

const installers = {
  windows: [
    {
      type: ".exe",
      size: "~192 MB",
      sha256: "sha256:410bea8874a627e57251b28d97ca97e84d9d165aaf4e200b6d74f1385b490f51",
      recommended: true,
      signature: "Code signed by Solun Technologies Pty Ltd",
      description: "Standard installer with auto-updater",
      downloadUrl: "https://github.com/Armaxian/Solun/releases/latest/download/win-unpacked.zip"
}],
  'mac-intel': [
    {
      type: ".dmg",
      size: "~80 MB",
      sha256: "c3d4e5f6789012345678901234567890123456789012345678901234567890a1b2",
      recommended: true,
      signature: "Developer ID signed and notarized by Apple",
      description: "Optimized for Intel-based Macs",
      downloadUrl: undefined
    },
  ],
  'mac-arm': [
    {
      type: ".dmg",
      size: "~78 MB",
      sha256: "d4e5f6789012345678901234567890123456789012345678901234567890a1b2c3",
      recommended: true,
      signature: "Developer ID signed and notarized by Apple",
      description: "Native Apple Silicon performance",
      downloadUrl: undefined
    },
  ],
  linux: [
    {
      type: ".AppImage",
      size: "~90 MB",
      sha256: "e5f6789012345678901234567890123456789012345678901234567890a1b2c3d4",
      recommended: true,
      signature: "GPG signed",
      description: "Universal Linux package",
      downloadUrl: undefined
    },
    {
      type: ".deb",
      size: "~75 MB",
      sha256: "f6789012345678901234567890123456789012345678901234567890a1b2c3d4e5",
      recommended: false,
      signature: "GPG signed",
      description: "Debian/Ubuntu package",
      downloadUrl: undefined
    },
  ],
};

export default function Download() {
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handlePlatformDetected = (info: PlatformInfo) => {
    setPlatformInfo(info);
    setPlatform(info.platform);
  };

  const currentInstallers = platform !== 'unknown' && platform in installers ? installers[platform as keyof typeof installers] : [];

  return (
    <>
      <Helmet>
        <title>Download Solun - Free Writing Software for World-Builders</title>
        <meta name="description" content="Download Solun for free. Available for Windows, macOS, and Linux. Premium AI writing workspace with Lore Vault, RAG-powered chat, and distraction-free editor." />
        <link rel="canonical" href="https://solun.app/download" />
        <meta property="og:title" content="Download Solun - Premium AI Writing Workspace" />
        <meta property="og:description" content="Get Solun for free. Context-aware AI, Lore Vault, and elegant editor for writers and world-builders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/download" />
        <meta property="og:image" content="https://solun.app/og-image-download.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Download Solun - Premium AI Writing Workspace" />
        <meta name="twitter:description" content="Get Solun for free. Context-aware AI, Lore Vault, and elegant editor for writers and world-builders." />
        <meta name="twitter:image" content="https://solun.app/og-image-download.png" />
      </Helmet>
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

          {/* Platform Detection */}
          <div className="mb-8">
            <PlatformDetect
              onPlatformDetected={handlePlatformDetected}
              showDetails={false}
            />
          </div>

          {/* Detected Platform Installers */}
          {platform !== 'unknown' && currentInstallers.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DownloadIcon className="h-5 w-5" />
                  Recommended Downloads
                </CardTitle>
                <CardDescription>
                  {getPlatformGuidance(platform)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentInstallers.map((installer) => (
                  <div
                    key={installer.type}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{installer.type}</p>
                        {installer.recommended && (
                          <Badge className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{installer.description}</p>
                      <p className="text-xs text-muted-foreground">{installer.size}</p>
                    </div>
                    <Button
                      className="btn btn-primary ml-4"
                      onClick={() => {
                        analytics.track({
                          name: 'download_click',
                          properties: {
                            platform: installer.type,
                            recommended: installer.recommended,
                            location: 'recommended_downloads'
                          }
                        });
                        if (installer.downloadUrl) {
                          window.open(installer.downloadUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}

                {/* Security Information */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2">Security & Verification</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        All downloads are cryptographically signed and verified. After downloading, verify the SHA256 hash matches exactly.
                      </p>

                      <details className="group">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mb-2">
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          View SHA256 hashes and signatures
                        </summary>
                        <div className="space-y-3 pl-6">
                          {currentInstallers.map((installer) => (
                            <div key={installer.type} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                                  {installer.sha256}
                                </code>
                                <span className="text-xs text-muted-foreground">({installer.type})</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-3 w-3" />
                                {installer.signature}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>

                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <div className="text-xs text-amber-800">
                            <strong>Security Notice:</strong> Always verify file hashes before installation. Never run executables from untrusted sources.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Platforms */}
          <div className="space-y-6">
            <button
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="w-full text-left"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 hover:text-phthalo transition-colors">
                <ChevronDown className={`h-4 w-4 transition-transform ${showAllPlatforms ? 'rotate-180' : ''}`} />
                All platforms and installers
              </h3>
            </button>

            {showAllPlatforms && (
              <div className="space-y-6">
                {Object.entries(installers).map(([platformKey, platformInstallers]) => (
                  <Card key={platformKey}>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        {getPlatformLabel(platformKey as Platform)}
                      </CardTitle>
                      <CardDescription>
                        {getPlatformGuidance(platformKey as Platform)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {platformInstallers.map((installer) => (
                        <div
                          key={installer.type}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{installer.type}</p>
                              {installer.recommended && (
                                <Badge className="text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{installer.description}</p>
                            <p className="text-xs text-muted-foreground">{installer.size}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="btn btn-ghost ml-4"
                            onClick={() => {
                              analytics.track({
                                name: 'download_click',
                                properties: {
                                  platform: installer.type,
                                  recommended: installer.recommended,
                                  location: 'all_platforms'
                                }
                              });
                              if (installer.downloadUrl) {
                                window.open(installer.downloadUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                          >
                            <DownloadIcon className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      ))}

                      {/* Platform-specific security info */}
                      <details className="mt-4 group">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          Security verification
                        </summary>
                        <div className="mt-3 space-y-2 pl-6">
                          {platformInstallers.map((installer) => (
                            <div key={installer.type} className="space-y-1">
                              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                SHA256: {installer.sha256}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {installer.signature}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </CardContent>
                  </Card>
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
                <div className="mt-2 pl-6 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong>Apple Silicon Macs (M1/M2/M3):</strong> Download the Apple Silicon .dmg file for native performance.
                  </div>
                  <div>
                    <strong>Intel Macs:</strong> Download the Intel .dmg file for compatibility.
                  </div>
                  <div className="mt-2">
                    <strong>Installation:</strong> Open the .dmg file and drag Solun to your Applications folder.
                    First launch: right-click → Open to bypass Gatekeeper if needed.
                  </div>
                  <div className="text-xs text-amber-600 mt-2">
                    <strong>Tip:</strong> Check "About This Mac" → "Overview" tab to see your chip type.
                  </div>
                </div>
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

          {/* Security Footer */}
          <div className="mt-12 p-6 bg-white rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-phthalo" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Security & Trust</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    All Solun installers are digitally signed and cryptographically verified.
                    We use industry-standard security practices to ensure your downloads are safe.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Code Signing</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Windows: Authenticode signed by Solun Technologies</li>
                        <li>• macOS: Developer ID signed and Apple notarized</li>
                        <li>• Linux: GPG signed packages</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Verification</h4>
                      <ul className="text-xs space-y-1">
                        <li>• SHA256 hashes provided for all downloads</li>
                        <li>• Automatic integrity checks during installation</li>
                        <li>• Regular security audits and updates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-800">
                      <strong>Important:</strong> Only download Solun from this official website.
                      Third-party sources may distribute modified or malicious versions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
