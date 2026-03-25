import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"
  return {
    title: isKa ? "ჩვენ შესახებ | მედფარმა პლუსი" : "About Us | MedPharma Plus",
    description: isKa
      ? "შპს მედფარმა პლუსი - პერსონალიზებული ფარმაცევტული ზრუნვა"
      : "MedPharma Plus LLC - Personalized Pharmaceutical Care",
  }
}

export default async function AboutPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  const values = [
    {
      icon: (
        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      title: isKa ? "ხარისხი" : "Quality",
      description: isKa ? "საერთაშორისო სტანდარტების შესაბამისი პროდუქცია" : "Products meeting international standards",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
      title: isKa ? "პროფესიონალიზმი" : "Professionalism",
      description: isKa ? "გამოცდილი ფარმაცევტების გუნდი" : "Team of experienced pharmacists",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: isKa ? "სწრაფი მიწოდება" : "Fast Delivery",
      description: isKa ? "შეკვეთიდან 2 საათში მიწოდება" : "Delivery within 2 hours of order",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.024 6.024 0 0 1-2.77.898" />
        </svg>
      ),
      title: isKa ? "სერტიფიცირება" : "Certification",
      description: isKa ? "ხარისხის საერთაშორისო სერტიფიკატები" : "International quality certifications",
    },
  ]

  const exclusiveBrands = ["Becton Dickinson", "VITAFLO™", "Mevalia", "Swedish Nutra", "Novaproduct", "Embecta", "Mayali Hane"]

  return (
    <div className="py-12">
      <div className="content-container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isKa ? "შპს მედფარმა პლუსი" : "MedPharma Plus LLC"}
          </h1>
          <p className="text-xl text-brand-red font-medium mb-6">
            {isKa ? "პერსონალიზებული ფარმაცევტული ზრუნვა" : "Personalized Pharmaceutical Care"}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {isKa
              ? "ინოვაცია, ხარისხი, ზრუნვა — ნდობის ახალი სტანდარტი მედიცინაში. სანდო პარტნიორი თქვენი ჯანმრთელობისა და სილამაზის სამსახურში."
              : "Innovation, Quality, Care — A New Standard of Trust in Medicine. Your trusted partner for health and beauty."}
          </p>
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isKa ? "ჩვენს შესახებ" : "About Us"}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                {isKa
                  ? "მედფარმა პლუსი არის ფარმაცევტული კომპანია, რომელიც სპეციალიზირებულია დიაბეტისა და იშვიათი დაავადებების სამკურნალო საშუალებებსა და კვებაზე, ესთეტიკასა და სილამაზეზე, მედიკამენტების ახალ ფორმულებსა და სამკურნალწამლო ფორმებზე."
                  : "MedPharma Plus is a pharmaceutical company specializing in diabetes and rare disease treatments and nutrition, aesthetics and beauty, new medication formulas and pharmaceutical forms."}
              </p>
              <p>
                {isKa
                  ? "ჩვენ ვთავაზობთ ჰიგიენისა და კოსმეტიკის საშუალებებს, ევროპული ხარისხის საკვებ დანამატებსა და სამედიცინო მოწყობილობებს, ქირურგიულ და სახარჯ მასალებს."
                  : "We offer hygiene and cosmetic products, European quality supplements and medical devices, surgical and consumable materials."}
              </p>
              <p>
                {isKa
                  ? "ჩვენი გუნდი ფლობს ხარისხის საერთაშორისო სტანდარტების არაერთ სერტიფიკატს და მუდმივად ნერგავს ახალ სტანდარტებს პაციენტებისა და მომხმარებლების მაქსიმალური კმაყოფილებისთვის."
                  : "Our team holds multiple international quality standard certifications and continuously implements new standards for maximum patient and customer satisfaction."}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {isKa ? "ექსკლუზიური ბრენდები" : "Exclusive Brands"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {exclusiveBrands.map((brand) => (
                <span key={brand} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {isKa ? "ჩვენი ღირებულებები" : "Our Values"}
          </h2>
          <div className="grid sm:grid-cols-2 small:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-brand-red/5 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isKa ? "ჩვენი სპეციალიზაცია" : "Our Specializations"}
          </h2>
          <div className="grid sm:grid-cols-2 small:grid-cols-3 gap-4">
            {[
              isKa ? "დიაბეტისა და იშვიათი დაავადებების მკურნალობა" : "Diabetes and Rare Disease Treatment",
              isKa ? "დიაბეტური და სპეციალური კვება" : "Diabetic and Special Nutrition",
              isKa ? "ესთეტიკა და სილამაზე" : "Aesthetics and Beauty",
              isKa ? "სამედიცინო მოწყობილობები" : "Medical Devices",
              isKa ? "ევროპული საკვები დანამატები" : "European Supplements",
              isKa ? "ქირურგიული მასალები" : "Surgical Materials",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4">
                <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
