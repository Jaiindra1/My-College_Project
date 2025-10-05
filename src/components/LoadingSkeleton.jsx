const LoadingSkeleton = ({ width = "w-full", height = "h-6" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${width} ${height}`}></div>
);

export default LoadingSkeleton;
