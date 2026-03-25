import { Metadata } from "next"

import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return {
    title: isKa
      ? "მომსახურების პირობები | MedPharma Plus"
      : "Terms of Service | MedPharma Plus",
    description: isKa
      ? "MedPharma Plus-ის მომსახურების პირობები და წესები"
      : "MedPharma Plus terms of service and conditions",
  }
}

export default async function TermsAndConditionsPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  const sections = [
    {
      number: 1,
      title: isKa ? "ზოგადი დებულებები" : "General Provisions",
      content: isKa
        ? "წინამდებარე მომსახურების პირობები (შემდგომში „პირობები") არეგულირებს MedPharma Plus-ის ვებგვერდის (შემდგომში „ვებგვერდი") გამოყენებას. ვებგვერდზე წვდომით ან მომსახურებით სარგებლობით, თქვენ ეთანხმებით ამ პირობებს. თუ არ ეთანხმებით რომელიმე პირობას, გთხოვთ არ გამოიყენოთ ვებგვერდი."
        : 'These Terms of Service (hereinafter "Terms") govern the use of the MedPharma Plus website (hereinafter "Website"). By accessing the Website or using the services, you agree to these Terms. If you do not agree with any of the Terms, please do not use the Website.',
    },
    {
      number: 2,
      title: isKa ? "მომსახურების აღწერა" : "Service Description",
      content: isKa
        ? "MedPharma Plus არის ონლაინ აფთიაქი, რომელიც უზრუნველყოფს მედიკამენტების, ჯანმრთელობისა და მოვლის პროდუქტების ონლაინ შეძენას და მიწოდებას თბილისის მასშტაბით. ჩვენ ვთავაზობთ რეცეპტით და ურეცეპტოდ გასაცემ მედიკამენტებს, საკვებ დანამატებს, კოსმეტიკურ და ჰიგიენურ საშუალებებს."
        : "MedPharma Plus is an online pharmacy that provides online purchase and delivery of medications, health and care products throughout Tbilisi. We offer prescription and non-prescription medications, supplements, cosmetic and hygiene products.",
    },
    {
      number: 3,
      title: isKa ? "შეკვეთა და გადახდა" : "Orders and Payment",
      content: isKa
        ? "შეკვეთის განთავსებით თქვენ ადასტურებთ, რომ მოწოდებული ინფორმაცია არის ზუსტი და სრული. ჩვენ ვიტოვებთ უფლებას უარი ვთქვათ ან გავაუქმოთ შეკვეთა, თუ პროდუქტი არ არის მარაგში, ფასი არასწორია, ან არსებობს თაღლითობის ეჭვი. გადახდა შესაძლებელია საბანკო ბარათით (Visa, Mastercard) ან ნაღდი ანგარიშსწორებით მიწოდებისას."
        : "By placing an order, you confirm that the information provided is accurate and complete. We reserve the right to refuse or cancel an order if the product is out of stock, the price is incorrect, or there is suspicion of fraud. Payment can be made by bank card (Visa, Mastercard) or cash on delivery.",
    },
    {
      number: 4,
      title: isKa ? "მიწოდება" : "Delivery",
      content: isKa
        ? "მიწოდება ხორციელდება თბილისის მასშტაბით. სამუშაო საათებში (ორშაბათი-პარასკევი 09:00-20:00, შაბათი 10:00-18:00) შეკვეთა მიწოდებული იქნება 2 საათის განმავლობაში. არასამუშაო საათებში განთავსებული შეკვეთა მიწოდებული იქნება მომდევნო სამუშაო დღეს. მიწოდების ზუსტი ვადა შეიძლება განსხვავდებოდეს მოთხოვნის მიხედვით."
        : "Delivery is available throughout Tbilisi. During business hours (Monday-Friday 09:00-20:00, Saturday 10:00-18:00) orders will be delivered within 2 hours. Orders placed outside business hours will be delivered on the next business day. Exact delivery times may vary depending on demand.",
    },
    {
      number: 5,
      title: isKa ? "რეცეპტიანი მედიკამენტები" : "Prescription Medications",
      content: isKa
        ? "რეცეპტით გასაცემი მედიკამენტების შეძენისთვის აუცილებელია ექიმის მიერ გამოწერილი რეცეპტის წარდგენა. რეცეპტი შეიძლება წარდგენილი იქნას ელექტრონულად ან მიწოდებისას. ჩვენ ვიტოვებთ უფლებას უარი ვთქვათ რეცეპტიანი მედიკამენტების გაყიდვაზე, თუ რეცეპტი არ არის ვალიდური."
        : "A doctor's prescription is required to purchase prescription medications. The prescription can be submitted electronically or upon delivery. We reserve the right to refuse the sale of prescription medications if the prescription is not valid.",
    },
    {
      number: 6,
      title: isKa ? "დაბრუნება და გაცვლა" : "Returns and Exchange",
      content: isKa
        ? "პროდუქტის დაბრუნება შესაძლებელია შეძენიდან 14 კალენდარული დღის განმავლობაში, თუ პროდუქტი არის ორიგინალ შეფუთვაში, არ არის გახსნილი ან გამოყენებული. საქართველოს კანონმდებლობის შესაბამისად, მედიკამენტების დაბრუნება შესაძლებელია მხოლოდ დეფექტის, არასწორი მიწოდების ან ვადაგასული პროდუქტის შემთხვევაში."
        : "Products can be returned within 14 calendar days of purchase if the product is in its original packaging and has not been opened or used. In accordance with Georgian law, medication returns are only possible in cases of defect, incorrect delivery, or expired product.",
    },
    {
      number: 7,
      title: isKa
        ? "პასუხისმგებლობის შეზღუდვა"
        : "Limitation of Liability",
      content: isKa
        ? "MedPharma Plus არ არის პასუხისმგებელი: პროდუქტის არასწორად გამოყენებით გამოწვეულ ზიანზე, მესამე მხარის ვებგვერდების შინაარსზე, ფორს-მაჟორული გარემოებებით გამოწვეულ მიწოდების შეფერხებებზე, ინტერნეტ კავშირის პრობლემებზე."
        : "MedPharma Plus is not responsible for: damage caused by improper use of products, content of third-party websites, delivery delays caused by force majeure, internet connection issues.",
    },
    {
      number: 8,
      title: isKa ? "ინტელექტუალური საკუთრება" : "Intellectual Property",
      content: isKa
        ? "ვებგვერდზე განთავსებული ყველა მასალა, მათ შორის ტექსტი, გრაფიკა, ლოგო, სურათები და პროგრამული უზრუნველყოფა, არის MedPharma Plus-ის ან მისი ლიცენზიარების საკუთრება და დაცულია საქართველოს და საერთაშორისო საავტორო უფლებების კანონმდებლობით."
        : "All materials on the Website, including text, graphics, logos, images and software, are the property of MedPharma Plus or its licensors and are protected by Georgian and international copyright law.",
    },
    {
      number: 9,
      title: isKa ? "მოქმედი კანონმდებლობა" : "Governing Law",
      content: isKa
        ? "ეს პირობები რეგულირდება საქართველოს კანონმდებლობით. ნებისმიერი დავა, რომელიც წარმოიშვება ამ პირობებთან დაკავშირებით, განიხილება საქართველოს სასამართლოების მიერ."
        : "These Terms are governed by the laws of Georgia. Any disputes arising in connection with these Terms shall be resolved by the courts of Georgia.",
    },
    {
      number: 10,
      title: isKa ? "პირობების ცვლილება" : "Changes to Terms",
      content: isKa
        ? "ჩვენ ვიტოვებთ უფლებას ნებისმიერ დროს შევცვალოთ ეს პირობები. ცვლილებები ძალაში შედის ვებგვერდზე გამოქვეყნებისთანავე. ვებგვერდის გამოყენების გაგრძელებით თქვენ ეთანხმებით განახლებულ პირობებს."
        : "We reserve the right to modify these Terms at any time. Changes take effect immediately upon publication on the Website. By continuing to use the Website, you agree to the updated Terms.",
    },
    {
      number: 11,
      title: isKa ? "კონტაქტი" : "Contact",
      content: isKa
        ? "თუ გაქვთ შეკითხვები ამ პირობებთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ: ელ-ფოსტა: info@medpharmaplus.ge, ტელეფონი: +995 32 200 00 00, მისამართი: თბილისი, საქართველო."
        : "If you have questions about these Terms, please contact us: Email: info@medpharmaplus.ge, Phone: +995 32 200 00 00, Address: Tbilisi, Georgia.",
    },
  ]

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {isKa ? "მომსახურების პირობები" : "Terms of Service"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isKa
            ? "ბოლო განახლება: იანვარი 2024"
            : "Last updated: January 2024"}
        </p>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.number} className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {section.number}. {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
