import FeatureCard from "./FeatureCard";

const FeatureCards = () => {
  const airDrop =
    "Launch your token distribution in seconds. Gas-optimized airdrops with smart eligibility rules. Start distributing now.";

  const stream =
    "Set up automated crypto payments once, run forever. Handle subscriptions, salaries, and recurring transfers automatically. Deploy your first stream.";

  const distribution =
    "Distribute tokens to thousands instantly. One transaction, multiple recipients. Equal or weighted splits with real-time tracking. Execute distribution.";

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] gap-4 md:gap-8">
      <FeatureCard
        title="Distribution"
        linkText="Create Distribution"
        description={distribution}
        imgType="airdrop"
        link="/distribution"
      />
      <FeatureCard
        title="Airdrops"
        linkText="Create Campaign"
        description={airDrop}
        imgType="airdrop"
        link="/airdrop"
      />
      <FeatureCard
        title="Payment Stream"
        linkText="Create Stream"
        description={stream}
        imgType="stream"
        link="/payment-stream"
      />
    </div>
  );
};

export default FeatureCards;
