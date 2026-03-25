import { Metadata } from "next"

import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return {
    title: isKa
      ? "დაბრუნების პოლიტიკა | MedPharma Plus"
      : "Return Policy | MedPharma Plus",
    description: isKa
      ? "ინფორმაცია პროდუქტის დაბრუნების პირობების და პროცესის შესახებ"
      : "Information about product return conditions and process",
  }
}

export default async function ReturnsPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {isKa ? "დაბრუნების პოლიტიკა" : "Return Policy"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isKa
            ? "გაეცანით პროდუქტის დაბრუნების პირობებს და პროცედურას"
            : "Learn about our product return conditions and procedures"}
        </p>
      </div>

      {/* General Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isKa ? "ზოგადი პირობები" : "General Conditions"}
        </h2>
        <p className="text-gray-600 mb-4">
          {isKa
            ? "თქვენ შეგიძლიათ პროდუქტის დაბრუნება შეძენიდან 14 კალენდარული დღის განმავლობაში, შემდეგი პირობების დაცვით:"
            : "You can return a product within 14 calendar days of purchase, subject to the following conditions:"}
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "პროდუქტი უნდა იყოს ორიგინალ შეფუთვაში"
                : "Product must be in its original packaging"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "პროდუქტი არ უნდა იყოს გახსნილი ან გამოყენებული"
                : "Product must not be opened or used"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "უნდა წარმოადგინოთ შეკვეთის დადასტურება"
                : "You must present order confirmation"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "პროდუქტი არ უნდა იყოს დაზიანებული"
                : "Product must not be damaged"}
            </span>
          </li>
        </ul>
      </div>

      {/* Medication Returns Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-amber-500"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-800 mb-3">
              {isKa
                ? "მედიკამენტების დაბრუნება"
                : "Medication Returns"}
            </h2>
            <p className="text-amber-700 mb-4">
              {isKa
                ? "საქართველოს კანონმდებლობის შესაბამისად, მედიკამენტების დაბრუნება შესაძლებელია მხოლოდ შემდეგ შემთხვევებში:"
                : "In accordance with Georgian law, medication returns are only possible in the following cases:"}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">-</span>
                <span className="text-amber-700">
                  {isKa
                    ? "პროდუქტი დაზიანებული ან დეფექტურია"
                    : "Product is damaged or defective"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">-</span>
                <span className="text-amber-700">
                  {isKa
                    ? "მიწოდებული იქნა არასწორი პროდუქტი"
                    : "Wrong product was delivered"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">-</span>
                <span className="text-amber-700">
                  {isKa
                    ? "პროდუქტს გასდის ვადა"
                    : "Product is expired"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Non-Returnable Products */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold text-red-800 mb-4">
          {isKa
            ? "დაბრუნებას არ ექვემდებარება"
            : "Non-Returnable Products"}
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700">
              {isKa
                ? "გახსნილი მედიკამენტები"
                : "Opened medications"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700">
              {isKa
                ? "ჰიგიენური პროდუქტები"
                : "Hygiene products"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700">
              {isKa
                ? "სამედიცინო მოწყობილობები"
                : "Medical devices"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700">
              {isKa
                ? "საკვები დანამატები"
                : "Supplements"}
            </span>
          </li>
        </ul>
      </div>

      {/* Refund Process */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isKa ? "თანხის დაბრუნების პროცესი" : "Refund Process"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "თანხის დაბრუნება ხდება 5-7 სამუშაო დღის განმავლობაში"
                : "Refund is processed within 5-7 business days"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "თანხა უბრუნდება იმავე გადახდის მეთოდით"
                : "Refund is returned via the same payment method"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">
              {isKa
                ? "ნაღდი ანგარიშსწორებით შეძენილი პროდუქტის თანხა ბრუნდება საბანკო გადარიცხვით"
                : "Cash purchases are refunded via bank transfer"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-brand-red/5 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {isKa ? "გაქვთ შეკითხვა?" : "Have a Question?"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isKa
            ? "დაგვიკავშირდით და ჩვენი გუნდი დაგეხმარებათ"
            : "Contact us and our team will help you"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+995322000000"
            className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-brand-red/90 transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            {isKa ? "დარეკვა" : "Call Us"}
          </a>
          <a
            href="mailto:info@medpharmaplus.ge"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            {isKa ? "ელ-ფოსტა" : "Email Us"}
          </a>
        </div>
      </div>
    </div>
  )
}
