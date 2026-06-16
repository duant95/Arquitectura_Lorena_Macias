import Image from 'next/image';

// Imagen optimizada (next/image) que llena su contenedor.
// El contenedor debe ser position:relative/absolute con tamaño (aspect-ratio o alto).
// Mantiene object-fit: cover, así los hover/zoom del CSS siguen funcionando.
export default function Img({ src, alt = '', sizes = '100vw', priority = false, className }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: 'cover' }}
    />
  );
}
