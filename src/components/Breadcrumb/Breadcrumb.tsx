import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className={styles.item}>
              {item.href && !isLast ? (
                <Link to={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight size={14} className={styles.separator} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
