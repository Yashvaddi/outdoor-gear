import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height,
  width,
  borderRadius,
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ height, width, borderRadius }}
      aria-hidden="true"
    />
  );
};

export const ProductGallerySkeleton: React.FC = () => (
  <div className={styles.gallerySkeletonWrapper}>
    <Skeleton className={styles.mainImageSkeleton} />
    <div className={styles.thumbRow}>
      {[0, 1, 2, 3].map(i => (
        <Skeleton key={i} className={styles.thumbSkeleton} />
      ))}
    </div>
  </div>
);

export const ProductInfoSkeleton: React.FC = () => (
  <div className={styles.infoSkeletonWrapper}>
    <Skeleton width="60%" height="14px" borderRadius="4px" />
    <Skeleton width="90%" height="32px" borderRadius="6px" />
    <Skeleton width="45%" height="28px" borderRadius="6px" />
    <Skeleton width="100%" height="1px" />
    <Skeleton width="40%" height="14px" borderRadius="4px" />
    <div className={styles.swatchRow}>
      {[0, 1, 2, 3].map(i => (
        <Skeleton key={i} width="36px" height="36px" borderRadius="50%" />
      ))}
    </div>
    <Skeleton width="35%" height="14px" borderRadius="4px" />
    <div className={styles.sizeRow}>
      {[0, 1, 2, 3, 4].map(i => (
        <Skeleton key={i} width="60px" height="42px" borderRadius="8px" />
      ))}
    </div>
    <Skeleton width="100%" height="52px" borderRadius="8px" />
  </div>
);
