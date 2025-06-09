import FeatureCard from "./FeatureCard";

const FeatureCards = () => {
  const airDrop =
    "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.";

  // const payment =
  //   "Streamline your payment workflows with automated solutions for recurring payments, salaries, subscriptions, and more, reducing administrative burdens and minimizing errors.";

  const stream =
    "Reduce administrative burdens and minimize errors with automated solutions for recurring payments, salaries, subscriptions, and more.";

  const distribution =
    "Recognize past achievements to motivate contributors while amplifying small efforts and ensuring inclusivity, so every voice matters.";

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] gap-4 md:gap-8">
      <FeatureCard
        title="Distribution"
        linkText="Create Distribution"
        description={distribution}
        imgType="airdrop"
      />
      <FeatureCard
        title="Airdrops"
        linkText="Create Campaign"
        description={airDrop}
        imgType="airdrop"
      />
      <FeatureCard
        title="Payment Stream"
        linkText="Create Stream"
        description={stream}
        imgType="stream"
      />
    </div>
  );
};

export default FeatureCards;
