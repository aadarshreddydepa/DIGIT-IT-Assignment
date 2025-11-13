const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white p-4 rounded-lg shadow">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default SkeletonCard;
