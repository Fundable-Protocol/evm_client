import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FaqAccordion from "@/components/molecules/FaqAccordion";

export const FaqGradientButton = ({ text }: { text: string }) => {
  return (
    <div className="faq-wrapper">
      <span className="faq-top-grad" />
      <span className="faq-bottom-grad">{text}</span>
    </div>
  );
};

const FaqAccordionSection = () => {
  const tabLists = [
    { label: "Getting Started", key: "faq-getting-started" },
    { label: "Security & Privacy", key: "faq-security-privacy" },
    { label: "Transactions", key: "faq-transactions" },
    { label: "Support", key: "faq-support" },
  ];

  const faqs = [
    {
      question: "How do I get started with Fundable?",
      answer: 
        "To use Fundable, you'll need a Starknet-compatible wallet like ArgentX or Braavos. Once installed, connect your wallet to our platform by clicking the 'Launch App' button in the top right corner. You'll then have access to all our distribution and funding features.",
    },
    {
      question: "What tokens can I distribute on the platform?",
      answer:
        "Currently, we support distributions of STRK (Starknet's native token) ETH, USDC, and USDT on both Starknet mainnet and testnet. We're actively working on adding support for more tokens to give you more flexibility in your distributions.",
    },
    {
      question: "How do distributions work on Fundable?",
      answer:
        "Fundable offers two main types of distributions: Equal and Weighted. Equal distributions split tokens evenly among recipients, while Weighted distributions let you specify different amounts for each address. You can upload recipient lists via CSV or input them manually, and execute the distribution in a single transaction.",
    },
    {
      question: "What are the fees for using Fundable?",
      answer:
        "Fundable charges a small protocol fee on distributions to maintain and improve the platform. The exact fee is displayed before you confirm any transaction. You'll also need to pay the standard Starknet network fees for your transactions. All fees are transparent and shown upfront.",
    },
    {
      question: "How can I track my distributions?",
      answer:
        "Every distribution you make is recorded on-chain and tracked in your distribution history. You can view detailed information about past distributions, including recipient addresses, amounts, transaction hashes, and timestamps. This provides complete transparency and makes it easy to audit and verify all your token distributions.",
    },
    {
      question: "How does token streaming work?",
      answer: 
        "Token streaming allows you to automate continuous token payments over time - perfect for salaries, subscriptions, or vesting schedules. Simply specify the recipient, total amount, duration, and token type. The tokens are then streamed linearly, meaning the recipient can claim their earned portion at any time. All streams are fully transparent and managed by smart contracts.",
    },
  ];

  return (
    <Tabs defaultValue="faq-getting-started" className="my-4 isolate">
      <TabsList className="flex items-start flex-col md:flex-row w-full p-4 h-auto bg-transparent">
        <div className="md:w-[80%] space-y-4 space-x-4">
          {tabLists.map((tab) => (
            <TabsTrigger
              value={tab.key}
              className="faq-trigger p-0 rounded-full"
              key={tab.key}
            >
              <FaqGradientButton text={tab.label} />
            </TabsTrigger>
          ))}
        </div>

        <TabsTrigger
          value="missing-faq"
          className="faq-trigger faq-trigger p-0 rounded-full"
        >
          <FaqGradientButton text="Couldn't find what you were looking for?" />
        </TabsTrigger>
      </TabsList>
      <>
        {tabLists.map((tab) => (
          <TabsContent key={`tab-content-${tab.key}`} value={tab.key}>
            {faqs.map((faq, i) => (
              <FaqAccordion key={`Faq-Key-${i}`} {...faq} index={i + 1} />
            ))}
          </TabsContent>
        ))}
        <TabsContent value="missing-faq">
          {faqs.map((faq, i) => (
            <FaqAccordion key={`Faq-Key-${i}`} {...faq} index={5} />
          ))}
        </TabsContent>
      </>
    </Tabs>
  );
};

export default FaqAccordionSection;
