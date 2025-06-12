import TransactionCardSkeleton from "./TransactionCardSkeleton";

const TransactionSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
      <TransactionCardSkeleton />
      <TransactionCardSkeleton />
      <TransactionCardSkeleton />
    </div>
  );
};

export default TransactionSkeletonLoader;
