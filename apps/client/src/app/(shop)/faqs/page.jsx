// apps/client/src/app/(shop)/faqs/page.jsx

import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQsPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "You can easily place an order through our website. Simply browse our products, add your desired items to the cart, and proceed to checkout.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bKash, Visa, Mastercard, and Cash on Delivery (COD).",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer an 'on-the-spot' return policy. Please check your items while the delivery person is present. If you find any issues, you can return it immediately paying only the delivery charge. See our Exchange & Return Policy page for more details.",
    },
    {
      question: "Do you deliver outside Dhaka?",
      answer:
        "Yes, we deliver all across Bangladesh via our trusted delivery partners.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking number or link via SMS/Email to track your delivery status.",
    },
  ];

  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" className="font-bold mb-8 text-center">
        Frequently Asked Questions
      </Typography>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            elevation={0}
            className="border border-gray-200"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="font-semibold"
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails className="text-gray-600">
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Container>
  );
}
