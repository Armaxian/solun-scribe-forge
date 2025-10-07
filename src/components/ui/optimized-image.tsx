import { forwardRef } from "react";

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholder?: string;
}

/**
 * OptimizedImage component with modern image format support and responsive loading
 * Supports AVIF, WebP fallbacks, and lazy loading
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    loading = "lazy",
    quality = 85,
    placeholder,
    className,
    ...props
  }, ref) => {
    // Generate responsive image sources
    const generateSrcSet = (baseSrc: string, format?: string) => {
      const extension = format || baseSrc.split('.').pop();
      const basePath = baseSrc.replace(/\.[^/.]+$/, "");

      // Generate multiple sizes for responsive images
      const sizes = [480, 768, 1024, 1280, 1920];
      return sizes
        .map(size => `${basePath}-${size}.${extension} ${size}w`)
        .join(', ');
    };

    // Check if the image supports modern formats
    const supportsModernFormats = src.match(/\.(jpg|jpeg|png)$/i);

    return (
      <picture>
        {/* AVIF format for modern browsers */}
        {supportsModernFormats && (
          <source
            srcSet={generateSrcSet(src.replace(/\.[^/.]+$/, ".avif"), "avif")}
            sizes={sizes}
            type="image/avif"
          />
        )}

        {/* WebP format for modern browsers */}
        {supportsModernFormats && (
          <source
            srcSet={generateSrcSet(src.replace(/\.[^/.]+$/, ".webp"), "webp")}
            sizes={sizes}
            type="image/webp"
          />
        )}

        {/* Fallback to original format */}
        <img
          ref={ref}
          src={src}
          srcSet={supportsModernFormats ? generateSrcSet(src) : undefined}
          sizes={supportsModernFormats ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          className={className}
          {...props}
        />
      </picture>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
