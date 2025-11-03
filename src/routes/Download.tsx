import { Download as DownloadIcon, ChevronDown, Shield, AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlatformDetect } from "@/components/PlatformDetect";
import { CopyableHash } from "@/components/CopyableHash";
import { useDownloads } from "@/hooks/use-downloads";
import { 
  detectPlatform, 
  getPlatformLabel, 
  getPlatformGuidance, 
  type Platform as PlatformType, 
  type PlatformInfo 
} from "@/lib/platform";
import {
  hasAvailableDownloads,
  getAvailableInstallers,
  type Platform,
  type ReleaseInfo,
} from "@/lib/releases";
import { analytics } from "@/lib/analytics";

const ALL_PLATFORMS: Platform[] = ['windows', 'mac-intel', 'mac-arm', 'linux'];

/**
 * Get file extension from download URL or description
 */
function getFileType(installer: ReleaseInfo): string {
  if (installer.downloadUrl) {
    const url = new URL(installer.downloadUrl);
    const pathname = url.pathname.toLowerCase();
    if (pathname.endsWith('.exe')) return '.exe';
    if (pathname.endsWith('.dmg')) return '.dmg';
    if (pathname.endsWith('.appimage')) return '.AppImage';
    if (pathname.endsWith('.deb')) return '.deb';
    if (pathname.endsWith('.msi')) return '.msi';
  }
  // Fallback for description-based inference
  if (installer.description?.toLowerCase().includes('appimage')) return '.AppImage';
  if (installer.description?.toLowerCase().includes('debian') || installer.description?.toLowerCase().includes('ubuntu')) return '.deb';
  return 'Installer';
}

/**
 * Platform-specific verification instructions
 */
function getVerificationInstructions(platform: Platform): string {
  switch (platform) {
    case 'windows':
      return `Using PowerShell:
1. Download the file
2. Open PowerShell in the download folder
3. Run: Get-FileHash -Path "solun.exe" -Algorithm SHA256
4. Compare the hash with the one shown above

Using Command Prompt:
1. Download the file
2. Open Command Prompt in the download folder
3. Run: certutil -hashfile solun.exe SHA256
4. Compare the hash with the one shown above`;
    
    case 'mac-intel':
    case 'mac-arm':
      return `Using Terminal:
1. Download the .dmg file
2. Open Terminal
3. Run: shasum -a 256 /path/to/solun.dmg
4. Compare the hash with the one shown above

Alternative (using openssl):
openssl sha256 /path/to/solun.dmg

Note: macOS may verify the signature automatically, but verifying the hash adds an extra layer of security.`;
    
    case 'linux':
      return `Using command line:
1. Download the file
2. Open Terminal in the download folder
3. Run: sha256sum solun.AppImage (or solun.deb)
4. Compare the hash with the one shown above

For AppImage files, you may also want to check GPG signature if provided.

Alternative (using shasum):
shasum -a 256 solun.AppImage`;
    
    default:
      return 'Please refer to your platform documentation for SHA256 verification instructions.';
  }
}

export default function Download() {
  const [platform, setPlatform] = useState<PlatformType>('unknown');
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const { releases: releaseConfig, loading } = useDownloads();

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handlePlatformDetected = (info: PlatformInfo) => {
    setPlatformInfo(info);
    setPlatform(info.platform);
  };

  // Get available installers for detected platform
  const detectedPlatform = platform !== 'unknown' ? (platform as Platform) : null;
  const currentInstallers = detectedPlatform && releaseConfig[detectedPlatform]
    ? getAvailableInstallers(releaseConfig[detectedPlatform])
    : [];

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
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-download.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Download Solun - Premium AI Writing Workspace" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solun_app" />
        <meta name="twitter:creator" content="@solun_app" />
        <meta name="twitter:title" content="Download Solun - Premium AI Writing Workspace" />
        <meta name="twitter:description" content="Get Solun for free. Context-aware AI, Lore Vault, and elegant editor for writers and world-builders." />
        <meta name="twitter:image" content="https://solun.app/og-image-download.png" />
        <meta name="twitter:image:alt" content="Download Solun - Premium AI Writing Workspace" />
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
            {!loading && detectedPlatform && currentInstallers.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DownloadIcon className="h-5 w-5" aria-hidden="true" />
                    Recommended Downloads
                  </CardTitle>
                  <CardDescription>
                    {getPlatformGuidance(platform)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentInstallers.map((installer, index) => {
                    const fileType = getFileType(installer);
                    const hash = installer.sha256 || '';
                    
                    return (
                      <div
                        key={`${detectedPlatform}-${index}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{fileType}</p>
                            {installer.recommended && (
                              <Badge className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          {installer.description && (
                            <p className="text-sm text-muted-foreground mb-2">{installer.description}</p>
                          )}
                          {installer.size && (
                            <p className="text-xs text-muted-foreground">{installer.size}</p>
                          )}
                        </div>
                        {installer.downloadUrl && (
                          <Button
                            className="btn btn-primary ml-4"
                            onClick={() => {
                              analytics.track({
                                name: 'download_click',
                                properties: {
                                  platform: fileType,
                                  recommended: installer.recommended,
                                  location: 'recommended_downloads'
                                }
                              });
                              window.open(installer.downloadUrl, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                            Download
                          </Button>
                        )}
                      </div>
                    );
                  })}

                  {/* Security Information with Copyable Hashes */}
                  {currentInstallers.some(i => i.sha256) && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5" aria-hidden="true" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-2">Security & Verification</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            All downloads are cryptographically signed and verified. After downloading, verify the SHA256 hash matches exactly.
                          </p>

                          <div className="space-y-3 mb-4">
                            {currentInstallers
                              .filter(i => i.sha256)
                              .map((installer, idx) => (
                                <CopyableHash
                                  key={`hash-${idx}`}
                                  hash={installer.sha256 || ''}
                                  label={`${getFileType(installer)} SHA256 Hash`}
                                />
                              ))}
                          </div>

                          {/* How to Verify Accordion */}
                          <Accordion type="single" collapsible className="mb-3">
                            <AccordionItem value="how-to-verify">
                              <AccordionTrigger className="text-sm">
                                How to verify SHA256 hash
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3">
                                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {getVerificationInstructions(detectedPlatform)}
                                  </p>
                                  {currentInstallers[0]?.signature && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                                      <Shield className="h-3 w-3" aria-hidden="true" />
                                      <span>{currentInstallers[0].signature}</span>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" aria-hidden="true" />
                              <div className="text-xs text-amber-800">
                                <strong>Security Notice:</strong> Always verify file hashes before installation. Never run executables from untrusted sources.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* All Platforms */}
            {!loading && (
              <div className="space-y-6">
                <button
                  onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                  className="w-full text-left py-3 px-2 min-h-[44px] flex items-center"
                  aria-expanded={showAllPlatforms}
                  aria-controls="all-platforms-content"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2 hover:text-phthalo transition-colors">
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAllPlatforms ? 'rotate-180' : ''}`} aria-hidden="true" />
                    All platforms and installers
                  </h3>
                </button>

                {showAllPlatforms && (
                  <div id="all-platforms-content" className="space-y-6">
                    {ALL_PLATFORMS.map((platformKey) => {
                      const platformInstallers = releaseConfig[platformKey] || [];
                      const availableInstallers = getAvailableInstallers(platformInstallers);
                      const hasAvailable = hasAvailableDownloads(platformKey, releaseConfig);

                      return (
                        <Card key={platformKey}>
                          <CardHeader>
                            <CardTitle className="capitalize flex items-center gap-2">
                              {getPlatformLabel(platformKey as PlatformType)}
                              {!hasAvailable && (
                                  <Badge variant="outline" className="ml-auto">
                                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                  Coming soon
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {getPlatformGuidance(platformKey as PlatformType)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {hasAvailable ? (
                              <>
                                {availableInstallers.map((installer, idx) => {
                                  const fileType = getFileType(installer);
                                  const hash = installer.sha256 || '';
                                  
                                  return (
                                    <div key={`${platformKey}-${idx}`}>
                                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-sm">{fileType}</p>
                                            {installer.recommended && (
                                              <Badge className="text-xs">
                                                Recommended
                                              </Badge>
                                            )}
                                          </div>
                                          {installer.description && (
                                            <p className="text-xs text-muted-foreground mb-1">{installer.description}</p>
                                          )}
                                          {installer.size && (
                                            <p className="text-xs text-muted-foreground">{installer.size}</p>
                                          )}
                                        </div>
                                        {installer.downloadUrl && (
                                          <Button
                                            size="default"
                                            variant="outline"
                                            className="btn btn-ghost ml-4"
                                            onClick={() => {
                                              analytics.track({
                                                name: 'download_click',
                                                properties: {
                                                  platform: fileType,
                                                  recommended: installer.recommended,
                                                  location: 'all_platforms'
                                                }
                                              });
                                              window.open(installer.downloadUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                          >
                                            <DownloadIcon className="h-4 w-4" />
                                            Download
                                          </Button>
                                        )}
                                      </div>
                                      
                                      {/* Hash display for each installer */}
                                      {hash && (
                                        <div className="mt-2">
                                          <CopyableHash
                                            hash={hash}
                                            variant="compact"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Platform-specific security info */}
                                {availableInstallers.some(i => i.sha256) && (
                                  <Accordion type="single" collapsible className="mt-4">
                                    <AccordionItem value="verify">
                                      <AccordionTrigger className="text-sm">
                                        How to verify SHA256 hash
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-3">
                                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                                            {getVerificationInstructions(platformKey)}
                                          </p>
                                          {availableInstallers[0]?.signature && (
                                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                                              <Shield className="h-3 w-3" />
                                              <span>{availableInstallers[0].signature}</span>
                                            </div>
                                          )}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">
                                  Downloads for {getPlatformLabel(platformKey as PlatformType)} are coming soon.
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Installation Help */}
            <div className="card mt-8">
              <h3 className="text-xl font-semibold mb-4">Having issues?</h3>
              <div className="space-y-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="windows-install">
                    <AccordionTrigger>How do I install on Windows?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Download the .exe file and run it. Follow the installation wizard. 
                        Windows may show a SmartScreen warning—click "More info" then "Run anyway."
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mac-install">
                    <AccordionTrigger>How do I install on macOS?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm text-muted-foreground">
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
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="linux-install">
                    <AccordionTrigger>How do I install on Linux?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        For AppImage: make it executable (chmod +x solun.AppImage) and run. 
                        For .deb: sudo dpkg -i solun.deb (or use your package manager).
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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