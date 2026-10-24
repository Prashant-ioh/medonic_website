// Cropped photo in a clipped frame. Children render on top (gradients, chips, captions).
const Photo = ({ src, alt, className = '', imgClassName = '', priority = false, children }) => (
  <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={`h-full w-full object-cover ${imgClassName}`}
    />
    {children}
  </div>
);

export default Photo;
