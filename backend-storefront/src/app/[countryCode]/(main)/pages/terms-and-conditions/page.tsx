import { Metadata } from "next"
import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"
  return {
    title: isKa ? "მომსახურების პირობები | მედფარმა პლუსი" : "Terms of Service | MedPharma Plus",
    description: isKa
      ? "შპს მედფარმა პლუსის მომსახურების პირობები"
      : "MedPharma Plus LLC Terms of Service",
  }
}

export default async function TermsPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  const sections = [
    {
      title: isKa ? "ზოგადი დებულებები" : "General Provisions",
      content: isKa
        ? `წინამდებარე მომსახურების პირობები არეგულირებს შპს მედფარმა პლუსის ვებ-გვერდის გამოყენებასა და მომსახურებას. ვებ-გვერდით სარგებლობით თქვენ ეთანხმებით ამ პირობებს.`
        : `These Terms of Service govern the use of the MedPharma Plus LLC website and services. By using the website, you agree to these terms.`,
    },
    {
      title: isKa ? "მომსახურების აღწერა" : "Service Description",
      content: isKa
        ? `მედფარმა პლუსი არის ონლაინ აფთიაქი, რომელიც უზრუნველყოფს ფარმაცევტული პროდუქციის, სამედიცინო მოწყობილობების, საკვები დანამატებისა და სხვა ჯანმრთელობასთან დაკავშირებული პროდუქციის გაყიდვას.`
        : `MedPharma Plus is an online pharmacy providing pharmaceutical products, medical devices, supplements, and other health-related products.`,
    },
    {
      title: isKa ? "შეკვეთა და გადახდა" : "Orders and Payment",
      content: isKa
        ? `შეკვეთა ითვლება დადასტურებულად გადახდის მიღების შემდეგ. ფასები მითითებულია ქართულ ლარში და მოიცავს დღგ-ს. კომპანია იტოვებს უფლებას შეცვალოს ფასები წინასწარი შეტყობინების გარეშე.`
        : `An order is considered confirmed after payment is received. Prices are listed in Georgian Lari and include VAT. The company reserves the right to change prices without prior notice.`,
    },
    {
      title: isKa ? "მიწოდება" : "Delivery",
      content: isKa
        ? `მიწოდება ხორციელდება სამუშაო საათებში თბილისის მასშტაბით. მიწოდების ვადა შეკვეთიდან 2 საათია სამუშაო საათებში. არასამუშაო საათებში განთავსებული შეკვეთები მიეწოდება მომდევნო სამუშაო დღეს.`
        : `Delivery is available throughout Tbilisi during business hours. Delivery time is within 2 hours during business hours. Orders placed outside business hours will be delivered the next business day.`,
    },
    {
      title: isKa ? "რეცეპტით გასაცემი მედიკამენტები" : "Prescription Medications",
      content: isKa
        ? `რეცეპტით გასაცემი მედიკამენტების შეძენისთვის აუცილებელია ექიმის რეცეპტის წარდგენა. კომპანია იტოვებს უფლებას უარი თქვას რეცეპტის გარეშე ასეთი პროდუქციის მიყიდვაზე.`
        : `For purchasing prescription medications, a doctor's prescription must be presented. The company reserves the right to refuse sale of such products without a prescription.`,
    },
    {
      title: isKa ? "დაბრუნება და გაცვლა" : "Returns and Exchange",
      content: isKa
        ? `პროდუქციის დაბრუნება შესაძლებელია მიღებიდან 14 დღის განმავლობაში დაბრუნების პოლიტიკის შესაბამისად. მედიკამენტების დაბრუნება შეზღუდულია კანონმდებლობის მოთხოვნების შესაბამისად.`
        : `Products can be returned within 14 days of receipt according to the return policy. Medication returns are restricted according to legal requirements.`,
    },
    {
      title: isKa ? "პასუხისმგებლობის შეზღუდვა" : "Limitation of Liability",
      content: isKa
        ? `კომპანია არ არის პასუხისმგებელი პროდუქციის არასწორი გამოყენებით გამოწვეულ ზიანზე. გამოყენებამდე გაეცანით ინსტრუქციას და მიმართეთ ექიმს ან ფარმაცევტს.`
        : `The company is not liable for damage caused by improper use of products. Read the instructions and consult a doctor or pharmacist before use.`,
    },
    {
      title: isKa ? "ინტელექტუალური საკუთრება" : "Intellectual Property",
      content: isKa
        ? `ვებ-გვერდზე განთავსებული ყველა მასალა, მათ შორის ლოგო, ტექსტები, სურათები და დიზაინი, წარმოადგენს კომპანიის ინტელექტუალურ საკუთრებას.`
        : `All materials on the website, including logos, texts, images, and design, are the intellectual property of the company.`,
    },
    {
      title: isKa ? "მარეგულირებელი კანონმდებლობა" : "Governing Law",
      content: isKa
        ? `ეს პირობები რეგულირდება საქართველოს კანონმდებლობით. ნებისმიერი დავა განიხილება საქართველოს სასამართლოების მიერ.`
        : `These terms are governed by the laws of Georgia. Any disputes will be resolved by Georgian courts.`,
    },
    {
      title: isKa ? "პირობების ცვლილება" : "Changes to Terms",
      content: isKa
        ? `კომპანია იტოვებს უფლებას შეცვალოს ეს პირობები ნებისმიერ დროს. ცვლილებები ძალაში შედის ვებ-გვერდზე გამოქვეყნებისთანავე.`
        : `The company reserves the right to change these terms at any time. Changes become effective upon publication on the website.`,
    },
    {
      title: isKa ? "კონტაქტი" : "Contact",
      content: isKa
        ? `კითხვების შემთხვევაში დაგვიკავშირდით: შპს მედფარმა პლუსი, თბილისი, საქართველო. ელ-ფოსტა: info@medpharma.ge, ტელეფონი: +995 32 200 00 00`
        : `For questions, contact us: MedPharma Plus LLC, Tbilisi, Georgia. Email: info@medpharma.ge, Phone: +995 32 200 00 00`,
    },
  ]

  return (
    <div className="py-12">
      <div className="content-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isKa ? "მომსახურების პირობები" : "Terms of Service"}
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
