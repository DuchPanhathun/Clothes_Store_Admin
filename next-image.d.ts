declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

  type ImageProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    loader?: (resolverProps: ImageLoaderProps) => string;
    quality?: number | string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    lazyBoundary?: string;
    lazyRoot?: React.RefObject<HTMLElement>;
  };

  type ImageLoaderProps = {
    src: string;
    width: number;
    quality?: number;
  };

  const Image: React.FC<ImageProps>;

  export default Image;
}
