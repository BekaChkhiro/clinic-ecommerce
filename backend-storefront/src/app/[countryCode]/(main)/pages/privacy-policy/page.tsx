import { Metadata } from "next"
import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"
  return {
    title: isKa ? "კონფიდენციალურობის პოლიტიკა | მედფარმა პლუსი" : "Privacy Policy | MedPharma Plus",
    description: isKa
      ? "შპს მედფარმა პლუსის კონფიდენციალურობის პოლიტიკა"
      : "MedPharma Plus LLC Privacy Policy",
  }
}

export default async function PrivacyPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  const sections = [
    {
      title: isKa ? "შესავალი" : "Introduction",
      content: isKa
        ? `შპს მედფარმა პლუსი პატივს სცემს თქვენს კონფიდენციალურობას და იღებს ვალდებულებას დაიცვას თქვენი პერსონალური მონაცემები. ეს კონფიდენციალურობის პოლიტიკა განმარტავს, თუ როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს ინფორმაციას.`
        : `MedPharma Plus LLC respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.`,
    },
    {
      title: isKa ? "რა ინფორმაციას ვაგროვებთ" : "What Information We Collect",
      content: isKa
        ? `ჩვენ ვაგროვებთ შემდეგ ინფორმაციას: პირადი ინფორმაცია (სახელი, გვარი, ელ-ფოსტა, ტელეფონის ნომერი, მიწოდების მისამართი); შეკვეთის ინფორმაცია; გადახდის ინფორმაცია; ვებ-გვერდის გამოყენების მონაცემები.`
        : `We collect the following information: Personal information (name, email, phone number, delivery address); Order information; Payment information; Website usage data.`,
    },
    {
      title: isKa ? "როგორ ვიყენებთ ინფორმაციას" : "How We Use Information",
      content: isKa
        ? `თქვენი ინფორმაცია გამოიყენება: შეკვეთების დამუშავებისა და მიწოდებისთვის; მომხმარებელთა მომსახურებისთვის; პროდუქციისა და სერვისების გაუმჯობესებისთვის; მარკეტინგული კომუნიკაციისთვის (თქვენი თანხმობით); სამართლებრივი ვალდებულებების შესასრულებლად.`
        : `Your information is used for: Processing and delivering orders; Customer service; Improving products and services; Marketing communications (with your consent); Fulfilling legal obligations.`,
    },
    {
      title: isKa ? "ინფორმაციის გაზიარება" : "Information Sharing",
      content: isKa
        ? `ჩვენ არ ვყიდით თქვენს პერსონალურ მონაცემებს მესამე პირებზე. ინფორმაციის გაზიარება ხდება მხოლოდ: მიწოდების სერვისის პროვაიდერებთან; გადახდის პროცესორებთან; კანონმდებლობით გათვალისწინებულ შემთხვევებში.`
        : `We do not sell your personal data to third parties. Information is shared only with: Delivery service providers; Payment processors; When required by law.`,
    },
    {
      title: isKa ? "მონაცემთა უსაფრთხოება" : "Data Security",
      content: isKa
        ? `ჩვენ ვიყენებთ ტექნიკურ და ორგანიზაციულ ზომებს თქვენი პერსონალური მონაცემების დასაცავად, მათ შორის: SSL დაშიფვრა; უსაფრთხო სერვერები; წვდომის კონტროლი.`
        : `We use technical and organizational measures to protect your personal data, including: SSL encryption; Secure servers; Access controls.`,
    },
    {
      title: isKa ? "თქვენი უფლებები" : "Your Rights",
      content: isKa
        ? `თქვენ გაქვთ უფლება: მოითხოვოთ წვდომა თქვენს პერსონალურ მონაცემებზე; მოითხოვოთ მონაცემების გასწორება ან წაშლა; გააუქმოთ თანხმობა მარკეტინგულ კომუნიკაციაზე; შეიტანოთ საჩივარი პერსონალურ მონაცემთა დაცვის ინსპექტორთან.`
        : `You have the right to: Request access to your personal data; Request correction or deletion of data; Withdraw consent for marketing communications; File a complaint with the Personal Data Protection Inspector.`,
    },
    {
      title: isKa ? "ქუქი-ფაილები" : "Cookies",
      content: isKa
        ? `ჩვენი ვებ-გვერდი იყენებს ქუქი-ფაილებს ვებ-გვერდის ფუნქციონირებისა და გამოცდილების გაუმჯობესებისთვის. თქვენ შეგიძლიათ მართოთ ქუქი-ფაილების პარამეტრები თქვენს ბრაუზერში.`
        : `Our website uses cookies to improve website functionality and experience. You can manage cookie settings in your browser.`,
    },
    {
      title: isKa ? "პოლიტიკის ცვლილებები" : "Policy Changes",
      content: isKa
        ? `ჩვენ შეიძლება განვაახლოთ ეს კონფიდენციალურობის პოლიტიკა დროდადრო. ცვლილებების შესახებ შეტყობინება განთავსდება ჩვენს ვებ-გვერდზე.`
        : `We may update this privacy policy from time to time. Notice of changes will be posted on our website.`,
    },
    {
      title: isKa ? "კონტაქტი" : "Contact",
      content: isKa
        ? `კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის დაგვიკავშირდით: ელ-ფოსტა: info@medpharma.ge, ტელეფონი: +995 32 200 00 00`
        : `For privacy-related questions, contact us: Email: info@medpharma.ge, Phone: +995 32 200 00 00`,
    },
  ]

  return (
    <div className="py-12">
      <div className="content-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isKa ? "კონფიდენციალურობის პოლიტიკა" : "Privacy Policy"}
            </h1>
            <p className="text-gray-600">
              {isKa ? "ბოლო განახლება: 2024 წლის იანვარი" : "Last updated: January 2024"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
            {sections.map((section, index) => (
              <div key={index} className={index < sections.length - 1 ? "mb-8 pb-8 border-b border-gray-100" : ""}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {index + 1}. {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
