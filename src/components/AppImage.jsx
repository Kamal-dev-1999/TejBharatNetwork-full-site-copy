import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {
  // Trim the src to avoid whitespace issues
  const safeSrc = (src || '').trim();

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.target.src !== '/assets/images/no_image.png') {
          e.target.onerror = null;
          e.target.src = '/assets/images/no_image.png';
        }
      }}
      {...props}
    />
  );
}

export default Image;
