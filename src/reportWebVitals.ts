import { type Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(
      ({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(onPerfEntry); // Cumulative Layout Shift
        onFID(onPerfEntry); // First Input Delay
        onFCP(onPerfEntry); // First Contentful Paint
        onLCP(onPerfEntry); // Largest Contentful Paint
        onTTFB(onPerfEntry); // Time to First Byte
        onINP(onPerfEntry); // Interaction to Next Paint
      }
    );
  }
};
export default reportWebVitals;
