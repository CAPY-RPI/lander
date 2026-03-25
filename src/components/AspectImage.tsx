type AspectImageProps = {
  src: string
  alt: string
  className?: string
}

export function AspectImage({ src, alt, className }: AspectImageProps) {
  return (
    <img src={src} alt={alt} className={`aspectSafe ${className ?? ''}`.trim()} loading="lazy" />
  )
}
