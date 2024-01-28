import { useState } from 'react';
import FAQ from '../../../components/FAQ';

const ServiceFAQs = () => {

    const [currentFaqOpen, setCurrentFaqOpen] = useState<string>("What methods of payments are supported?");

    const faqs: { question: string; answer: string }[] = [
        {
            question: "What methods of payments are supported?",
            answer: "Credit cards, e.g. Visa, Mastercard, American Express, Discover.."
        },
        {
            question: "Can i cancel at anytime?",
            answer: "Yes, you can cancel at anytime after you order the service. If you are not happy with the work you can cancel at anytime"
        },
        {
            question: "Is this service refundable?",
            answer: "Yes, every service on Lets Freelance is refundable. If you are not satisfied with the work, you can request a refund and get your paid amount"
        },
        {
            question: "Am i going to receive  my order?",
            answer: "Definitely, every order is protected by Lets Freelance. We set as middle man between the freelancer and the employer, we only send the paid amount to the freelancer when the work is done. Otherwise you can request a refund and get your paid amount"
        }
    ];

    const openFaqHandler = (faq: string) => {
        setCurrentFaqOpen(faq);
    }

    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xl font-medium">Frequently asked questions</h3>
            {faqs.map(faq => (
                <FAQ key={faq.question} question={faq.question} answer={faq.answer} isOpen={currentFaqOpen === faq.question} onClick={openFaqHandler} />
            ))}
        </section>
    )
}

export default ServiceFAQs