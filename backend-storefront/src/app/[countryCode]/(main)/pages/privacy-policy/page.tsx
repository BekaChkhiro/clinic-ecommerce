import { Metadata } from &#8220;next&#8220;

import { getLocale } from &#8220;@lib/data/locale-actions&#8220;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || &#8220;ka&#8220;
  const isKa = locale === &#8220;ka&#8220;

  return {
    title: isKa
      ? &#8220;კონფიდენციალურობის პოლიტიკა | MedPharma Plus&#8220;
      : &#8220;Privacy Policy | MedPharma Plus&#8220;,
    description: isKa
      ? &#8220;ინფორმაცია თქვენი პერსონალური მონაცემების დაცვისა და გამოყენების შესახებ&#8220;
      : &#8220;Information about the protection and use of your personal data&#8220;,
  }
}

export default async function PrivacyPolicyPage() {
  const locale = (await getLocale()) || &#8220;ka&#8220;
  const isKa = locale === &#8220;ka&#8220;

  const sections = [
    {
      number: 1,
      title: isKa ? &#8220;შესავალი&#8220; : &#8220;Introduction&#8220;,
      content: isKa
        ? &#8220;MedPharma Plus (შემდგომში &#8222;ჩვენ&#8220;, &#8222;ჩვენი&#8220; ან &#8222;კომპანია&#8220;) პატივს სცემს თქვენი კონფიდენციალურობის უფლებას. ეს კონფიდენციალურობის პოლიტიკა აღწერს, თუ როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს პერსონალურ ინფორმაციას, როდესაც სარგებლობთ ჩვენი ვებგვერდით და მომსახურებით.&#8220;
        : 'MedPharma Plus (hereinafter &#8220;we&#8220;, &#8220;our&#8220; or &#8220;the Company&#8220;) respects your right to privacy. This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services.',
    },
    {
      number: 2,
      title: isKa ? &#8220;რა ინფორმაციას ვაგროვებთ&#8220; : &#8220;What Information We Collect&#8220;,
      content: isKa
        ? &#8220;ჩვენ შეიძლება შევაგროვოთ შემდეგი ინფორმაცია: სახელი და გვარი, ელექტრონული ფოსტის მისამართი, ტელეფონის ნომერი, მიწოდების მისამართი, გადახდის ინფორმაცია (ბარათის ბოლო 4 ციფრი), შეკვეთების ისტორია, IP მისამართი და ბრაუზერის ინფორმაცია.&#8220;
        : &#8220;We may collect the following information: first and last name, email address, phone number, delivery address, payment information (last 4 digits of card), order history, IP address and browser information.&#8220;,
    },
    {
      number: 3,
      title: isKa
        ? &#8220;როგორ ვიყენებთ ინფორმაციას&#8220;
        : &#8220;How We Use Information&#8220;,
      content: isKa
        ? &#8220;თქვენი ინფორმაცია გამოიყენება: შეკვეთების დამუშავებისა და მიწოდებისთვის, ანგარიშის მართვისთვის, მომხმარებელთა მხარდაჭერისთვის, მარკეტინგული შეტყობინებებისთვის (თქვენი თანხმობით), ვებგვერდის გაუმჯობესებისთვის, კანონმდებლობის მოთხოვნების შესასრულებლად.&#8220;
        : &#8220;Your information is used for: processing and delivering orders, account management, customer support, marketing communications (with your consent), website improvement, compliance with legal requirements.&#8220;,
    },
    {
      number: 4,
      title: isKa ? &#8220;ინფორმაციის გაზიარება&#8220; : &#8220;Information Sharing&#8220;,
      content: isKa
        ? &#8220;ჩვენ არ ვყიდით და არ ვაზიარებთ თქვენს პერსონალურ ინფორმაციას მესამე მხარეებთან, გარდა შემდეგი შემთხვევებისა: მიწოდების სერვისის პროვაიდერებთან (შეკვეთის მიწოდებისთვის), გადახდის პროვაიდერებთან (ტრანზაქციის დამუშავებისთვის), კანონმდებლობის მოთხოვნით.&#8220;
        : &#8220;We do not sell or share your personal information with third parties, except in the following cases: with delivery service providers (for order delivery), with payment providers (for transaction processing), as required by law.&#8220;,
    },
    {
      number: 5,
      title: isKa ? &#8220;მონაცემთა უსაფრთხოება&#8220; : &#8220;Data Security&#8220;,
      content: isKa
        ? &#8220;ჩვენ ვიყენებთ ინდუსტრიის სტანდარტის უსაფრთხოების ზომებს თქვენი პერსონალური ინფორმაციის დასაცავად, მათ შორის SSL დაშიფვრას, უსაფრთხო სერვერებს და წვდომის კონტროლის მექანიზმებს. თუმცა, ინტერნეტით მონაცემთა გადაცემის არცერთი მეთოდი არ არის 100% უსაფრთხო.&#8220;
        : &#8220;We use industry-standard security measures to protect your personal information, including SSL encryption, secure servers, and access control mechanisms. However, no method of data transmission over the Internet is 100% secure.&#8220;,
    },
    {
      number: 6,
      title: isKa ? &#8220;თქვენი უფლებები&#8220; : &#8220;Your Rights&#8220;,
      content: isKa
        ? &#8220;თქვენ გაქვთ უფლება: მოითხოვოთ თქვენი პერსონალური მონაცემების ასლი, მოითხოვოთ თქვენი მონაცემების შესწორება ან წაშლა, უარი თქვათ მარკეტინგულ შეტყობინებებზე, მოითხოვოთ თქვენი მონაცემების დამუშავების შეზღუდვა.&#8220;
        : &#8220;You have the right to: request a copy of your personal data, request correction or deletion of your data, opt out of marketing communications, request restriction of processing of your data.&#8220;,
    },
    {
      number: 7,
      title: isKa ? &#8220;ქუქი-ფაილები&#8220; : &#8220;Cookies&#8220;,
      content: isKa
        ? &#8220;ჩვენი ვებგვერდი იყენებს ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად. ქუქი-ფაილები არის მცირე ტექსტური ფაილები, რომლებიც ინახება თქვენს მოწყობილობაზე. ისინი გვეხმარება: ვებგვერდის ფუნქციონირებაში, თქვენი პრეფერენციების დამახსოვრებაში, ტრაფიკის ანალიზში.&#8220;
        : &#8220;Our website uses cookies to improve your experience. Cookies are small text files stored on your device. They help us with: website functionality, remembering your preferences, traffic analysis.&#8220;,
    },
    {
      number: 8,
      title: isKa ? &#8220;პოლიტიკის ცვლილებები&#8220; : &#8220;Policy Changes&#8220;,
      content: isKa
        ? &#8220;ჩვენ შეიძლება დროდადრო განვაახლოთ ეს კონფიდენციალურობის პოლიტიკა. ნებისმიერი ცვლილება გამოქვეყნდება ამ გვერდზე განახლებული თარიღით. გირჩევთ პერიოდულად გადახედოთ ამ პოლიტიკას.&#8220;
        : &#8220;We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.&#8220;,
    },
    {
      number: 9,
      title: isKa ? &#8220;კონტაქტი&#8220; : &#8220;Contact&#8220;,
      content: isKa
        ? &#8220;თუ გაქვთ შეკითხვები ამ კონფიდენციალურობის პოლიტიკასთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ: ელ-ფოსტა: info@medpharmaplus.ge, ტელეფონი: +995 32 200 00 00, მისამართი: თბილისი, საქართველო.&#8220;
        : &#8220;If you have questions about this Privacy Policy, please contact us: Email: info@medpharmaplus.ge, Phone: +995 32 200 00 00, Address: Tbilisi, Georgia.&#8220;,
    },
  ]

  return (
    <div className=&#8220;content-container py-12&#8220;>
      {/* Header */}
      <div className=&#8220;mb-10 text-center&#8220;>
        <h1 className=&#8220;text-3xl font-bold text-gray-900 mb-3&#8220;>
          {isKa ? &#8220;კონფიდენციალურობის პოლიტიკა&#8220; : &#8220;Privacy Policy&#8220;}
        </h1>
        <p className=&#8220;text-gray-500 text-sm&#8220;>
          {isKa
            ? &#8220;ბოლო განახლება: იანვარი 2024&#8220;
            : &#8220;Last updated: January 2024&#8220;}
        </p>
      </div>

      {/* Sections */}
      <div className=&#8220;bg-white rounded-xl border border-gray-200 divide-y divide-gray-100&#8220;>
        {sections.map((section) => (
          <div key={section.number} className=&#8220;p-6 sm:p-8&#8220;>
            <h2 className=&#8220;text-lg font-bold text-gray-900 mb-3&#8220;>
              {section.number}. {section.title}
            </h2>
            <p className=&#8220;text-gray-600 leading-relaxed&#8220;>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
