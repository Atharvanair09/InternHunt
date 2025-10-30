import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'What is InternHunt?',
    answer: 'InternHunt is a modern internship offering platform designed to connect students and recent graduates with valuable internship opportunities across diverse fields. It features AI-powered tools for smart internship recommendations, resume validation, an in-built resume builder, and skill insights to help users bridge the gap between academics and career success.',
  },
  {
    question: 'Who is eligible to apply for these internships?',
    answer: 'Both students and recent graduates can apply for any type of internship. Individual listings may specify additional requirements such as field of study or skill set.',
  },
  {
    question: 'Are all internships paid?',
    answer: 'The payment policy varies by internship provider and program duration. Please check individual internship details for stipend or compensation information.',
  },
  {
    question: 'Can I apply for more than one type of internship?',
    answer: 'No. Applicants may not apply to multiple openings, including different durations, one internship must be complete before applying for another.',
  },
  {
    question: 'How is progress evaluated during the internship?',
    answer: 'Mentors and supervisors regularly track goals and achievements, providing feedback throughout the program. Extended internships may have additional reviews.',
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <span className="arrow">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="faq-section" id='faq-section'>
      <h1>Frequently Asked <span>Questions</span></h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
