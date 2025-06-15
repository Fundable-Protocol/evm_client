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
      question: "How do I create an account on the platform?",
      answer:
        "To create an account, visit the Sign Up page, enter your email and password, verify your email through the link sent to you, and complete your profile setup. Once done, you can start using the platform.",
    },
    {
      question: "What is the first step to set up my crypto wallet?",
      answer:
        "To create an account, visit the Sign Up page, enter your email and password, verify your email through the link sent to you, and complete your profile setup. Once done, you can start using the platform.",
    },
    {
      question: "How can I connect my existing wallet to the platform?",
      answer:
        "To create an account, visit the Sign Up page, enter your email and password, verify your email through the link sent to you, and complete your profile setup. Once done, you can start using the platform.",
    },
    {
      question: "What are the requirements to start using the platform?",
      answer:
        "To create an account, visit the Sign Up page, enter your email and password, verify your email through the link sent to you, and complete your profile setup. Once done, you can start using the platform.",
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
