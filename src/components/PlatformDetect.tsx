import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Cpu, Monitor } from "lucide-react";
import { getDetailedPlatformInfo, getPlatformLabel, getPlatformGuidance, type PlatformInfo } from "@/lib/platform";

interface PlatformDetectProps {
  onPlatformDetected?: (platformInfo: PlatformInfo) => void;
  showDetails?: boolean;
  className?: string;
}

export function PlatformDetect({
  onPlatformDetected,
  showDetails = false,
  className = ""
}: PlatformDetectProps) {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectPlatform = async () => {
      try {
        const info = getDetailedPlatformInfo();
        setPlatformInfo(info);
        onPlatformDetected?.(info);
      } catch (error) {
        console.error('Error detecting platform:', error);
      } finally {
        setLoading(false);
      }
    };

    detectPlatform();
  }, [onPlatformDetected]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-phthalo"></div>
            <span className="text-muted-foreground">Detecting your platform...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!platformInfo) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-lg font-semibold mb-2">Unable to detect platform</h3>
            <p className="text-muted-foreground">
              Please select your platform manually from the options below.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMac = platformInfo.platform === 'mac-intel' || platformInfo.platform === 'mac-arm';
  const guidance = getPlatformGuidance(platformInfo.platform);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Detected Platform
          <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
        </CardTitle>
        <CardDescription>
          We've automatically detected your system configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              {isMac ? (
                <span className="text-white font-bold text-sm"></span>
              ) : (
                <Monitor className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{getPlatformLabel(platformInfo.platform)}</h3>
              <p className="text-sm text-muted-foreground">
                {platformInfo.architecture.toUpperCase()} • {platformInfo.isMobile ? 'Mobile' : 'Desktop'}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {platformInfo.architecture}
          </Badge>
        </div>

        {guidance && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> {guidance}
            </p>
          </div>
        )}

        {isMac && platformInfo.platform === 'mac-arm' && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Apple Silicon detected:</strong> This installer is optimized for M1/M2/M3 Macs and will run natively for best performance.
            </p>
          </div>
        )}

        {showDetails && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              View technical details
            </summary>
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2 text-xs font-mono">
                <div><strong>Platform:</strong> {navigator.platform}</div>
                <div><strong>User Agent:</strong> {platformInfo.userAgent.substring(0, 100)}...</div>
                <div><strong>Architecture:</strong> {platformInfo.architecture}</div>
                <div><strong>Mobile:</strong> {platformInfo.isMobile ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
