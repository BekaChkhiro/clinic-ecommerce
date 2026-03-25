"use client"

import { useState } from "react"
import { useLocale } from "next-intl"

interface FAQItem {
  question: { ka: string; en: string }
  answer: { ka: string; en: string }
}

const faqItems: FAQItem[] = [
  {
    question: {
      ka: "როგორ შევუკვეთო პროდუქცია?",
      en: "How do I place an order?",
    },
    answer: {
      ka: "პროდუქციის შეკვეთა შეგიძლიათ ჩვენს ვებგვერდზე. აირჩიეთ სასურველი პროდუქტი, დაამატეთ კალათაში და გააფორმეთ შეკვეთა. ასევე შეგიძლიათ შეკვეთა ტელეფონით: +995 32 200 00 00.",
      en: "You can order products on our website. Select the desired product, add it to your cart, and complete the checkout. You can also order by phone: +995 32 200 00 00.",
    },
  },
  {
    question: {
      ka: "რა დრო სჭირდება მიტანას?",
      en: "How long does delivery take?",
    },
    answer: {
      ka: "თბილისში მიტანა ხდება 1-2 სამუშაო დღეში. რეგიონებში მიტანა ხდება 2-5 სამუშაო დღეში. ექსპრეს მიტანა თბილისში ხელმისაწვდომია იმავე დღეს შეკვეთისთვის 14:00 საათამდე.",
      en: "Delivery in Tbilisi takes 1-2 business days. Regional delivery takes 2-5 business days. Express delivery in Tbilisi is available same day for orders placed before 14:00.",
    },
  },
  {
    question: {
      ka: "რა ღირს მიტანის სერვისი?",
      en: "What is the delivery fee?",
    },
    answer: {
      ka: "თბილისში მიტანა უფასოა 50 ლარის ზემოთ შეკვეთებისთვის. 50 ლარამდე შეკვეთისთვის მიტანის ღირებულება შეადგენს 5 ლარს. რეგიონებში მიტანის ღირებულება განსხვავებულია.",
      en: "Delivery in Tbilisi is free for orders over 50 GEL. For orders under 50 GEL, the delivery fee is 5 GEL. Regional delivery fees vary.",
    },
  },
  {
    question: {
      ka: "შესაძლებელია პროდუქციის დაბრუნება?",
      en: "Can I return products?",
    },
    answer: {
      ka: "დიახ, პროდუქციის დაბრუნება შესაძლებელია მიღებიდან 14 დღის განმავლობაში, თუ პროდუქტი არ არის გახსნილი და შენარჩუნებულია ორიგინალი შეფუთვა. დაბრუნებისთვის დაგვიკავშირდით ტელეფონით ან ელ. ფოსტით.",
      en: "Yes, products can be returned within 14 days of receipt if the product is unopened and the original packaging is intact. Contact us by phone or email for returns.",
    },
  },
  {
    question: {
      ka: "საჭიროა თუ არა რეცეპტი?",
      en: "Do I need a prescription?",
    },
    answer: {
      ka: "ჩვენი პროდუქციის უმეტესობა სპეციალური დიეტური საკვები პროდუქტებია და არ საჭიროებს რეცეპტს. თუმცა, ზოგიერთ პროდუქტს შეიძლება ექიმის რეკომენდაცია დასჭირდეს. პროდუქტის გვერდზე მითითებულია სრული ინფორმაცია.",
      en: "Most of our products are specialty dietary food products and do not require a prescription. However, some products may need a doctor's recommendation. Full information is provided on the product page.",
    },
  },
  {
    question: {
      ka: "როგორ გავიგო შეკვეთის სტატუსი?",
      en: "How can I check my order status?",
    },
    answer: {
      ka: "შეკვეთის გაფორმების შემდეგ მიიღებთ დასტურის SMS-ს და ელ. წერილს. შეკვეთის სტატუსის შეცვლისას ასევე მიიღებთ შეტყობინებას. ანგარიშის გვერდიდანაც შეგიძლიათ შეკვეთის სტატუსის ნახვა.",
      en: "After placing your order, you will receive a confirmation SMS and email. You will also be notified when the order status changes. You can also check the order status from your account page.",
    },
  },
  {
    question: {
      ka: "რა გადახდის მეთოდებია ხელმისაწვდომი?",
      en: "What payment methods are available?",
    },
    answer: {
      ka: "ხელმისაწვდომია ონლაინ გადახდა ბარათით (Visa, MasterCard), საბანკო გადარიცხვა, და ადგილზე ნაღდი ანგარიშსწორება მიტანისას.",
      en: "Available payment methods include online card payment (Visa, MasterCard), bank transfer, and cash on delivery.",
    },
  },
  {
    question: {
      ka: "როგორ დაგვიკავშირდეთ?",
      en: "How can I contact customer support?",
    },
    answer: {
      ka: "შეგიძლიათ დაგვიკავშირდეთ ტელეფონით: +995 32 200 00 00 (ორშ-პარ 09:00-18:00), ელ. ფოსტით: info@medpharma.ge, ან კონტაქტის ფორმის მეშვეობით ჩვენს ვებგვერდზე.",
      en: "You can reach us by phone: +995 32 200 00 00 (Mon-Fri 09:00-18:00), email: info@medpharma.ge, or through the contact form on our website.",
    },
  },
]

function FAQAccordion({
  item,
  isKa,
}: {
  item: FAQItem
  isKa: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">
          {isKa ? item.question.ka : item.question.en}
        </span>
        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {isKa ? item.answer.ka : item.answer.en}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const locale = useLocale()
  const isKa = locale === "ka"

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container py-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isKa ? "ხშირად დასმული კითხვები" : "Frequently Asked Questions"}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {isKa
              ? "იპოვეთ პასუხები ყველაზე ხშირად დასმულ კითხვებზე"
              : "Find answers to the most commonly asked questions"}
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="content-container py-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <FAQAccordion key={index} item={item} isKa={isKa} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {isKa ? "ვერ იპოვეთ პასუხი?" : "Didn't find your answer?"}
          </h2>
          <p className="text-gray-600 mt-2 mb-6">
            {isKa
              ? "დაგვიკავშირდით და ჩვენ დაგეხმარებით"
              : "Contact us and we will help you"}
          </p>
          <div className="flex flex-col small:flex-row items-center justify-center gap-4">
            <a
              href="tel:+995322000000"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-red/90 transition-colors"
            >
              {/* Phone */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              +995 32 200 00 00
            </a>
            <a
              href="mailto:info@medpharma.ge"
              className="inline-flex items-center gap-2 bg-white text-brand-red border-2 border-brand-red px-6 py-3 rounded-lg font-medium hover:bg-brand-red/10 transition-colors"
            >
              {/* Mail */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              info@medpharma.ge
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
