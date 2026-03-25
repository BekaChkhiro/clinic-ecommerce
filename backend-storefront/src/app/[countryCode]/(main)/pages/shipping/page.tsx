import { Metadata } from "next"

import { getLocale } from "@lib/data/locale-actions"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return {
    title: isKa
      ? "მიწოდება | MedPharma Plus"
      : "Shipping & Delivery | MedPharma Plus",
    description: isKa
      ? "ინფორმაცია მიწოდების პირობების, დროის და გადახდის მეთოდების შესახებ"
      : "Information about delivery terms, timing, and payment methods",
  }
}

export default async function ShippingPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {isKa ? "მიწოდება" : "Shipping & Delivery"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isKa
            ? "ჩვენ ვზრუნავთ თქვენი შეკვეთის სწრაფ და უსაფრთხო მიწოდებაზე"
            : "We take care of fast and safe delivery of your order"}
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Fast Delivery */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-brand-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {isKa ? "სწრაფი მიწოდება" : "Fast Delivery"}
          </h3>
          <p className="text-sm text-gray-600">
            {isKa
              ? "შეკვეთის მიწოდება 2 საათში სამუშაო საათებში"
              : "Order delivery within 2 hours during business hours"}
          </p>
        </div>

        {/* Convenient Locations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-brand-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {isKa ? "მოხერხებული ლოკაციები" : "Convenient Locations"}
          </h3>
          <p className="text-sm text-gray-600">
            {isKa
              ? "მიწოდება თბილისის მასშტაბით"
              : "Delivery throughout Tbilisi"}
          </p>
        </div>

        {/* Safe Packaging */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-brand-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {isKa ? "უსაფრთხო შეფუთვა" : "Safe Packaging"}
          </h3>
          <p className="text-sm text-gray-600">
            {isKa
              ? "პროდუქტები იფუთება სპეციალური სტანდარტებით"
              : "Products are packed according to special standards"}
          </p>
        </div>

        {/* Flexible Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-brand-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {isKa ? "მოქნილი გადახდა" : "Flexible Payment"}
          </h3>
          <p className="text-sm text-gray-600">
            {isKa
              ? "გადაიხადეთ ბარათით ან ნაღდი ანგარიშსწორებით"
              : "Pay by card or cash on delivery"}
          </p>
        </div>
      </div>

      {/* Delivery Terms */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isKa ? "მიწოდების პირობები" : "Delivery Terms"}
        </h2>

        <div className="space-y-6">
          {/* During Business Hours */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-brand-red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {isKa ? "სამუშაო საათებში" : "During Business Hours"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {isKa
                  ? "ორშაბათი - პარასკევი: 09:00 - 20:00, შაბათი: 10:00 - 18:00"
                  : "Monday - Friday: 09:00 - 20:00, Saturday: 10:00 - 18:00"}
              </p>
              <p className="text-sm font-medium text-brand-red">
                {isKa ? "მიწოდება 2 საათში" : "Delivery within 2 hours"}
              </p>
            </div>
          </div>

          {/* Outside Business Hours */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-brand-red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {isKa
                  ? "არასამუშაო საათებში"
                  : "Outside Business Hours"}
              </h3>
              <p className="text-sm text-gray-600">
                {isKa
                  ? "შეკვეთა მიწოდებული იქნება მომდევნო სამუშაო დღეს"
                  : "Order will be delivered on the next business day"}
              </p>
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-brand-red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {isKa ? "მიწოდების ზონები" : "Delivery Zones"}
              </h3>
              <p className="text-sm text-gray-600">
                {isKa
                  ? "მიწოდება ხორციელდება თბილისის მასშტაბით"
                  : "Delivery is available throughout Tbilisi"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isKa ? "გადახდის მეთოდები" : "Payment Methods"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Bank Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {isKa ? "საბანკო ბარათი" : "Bank Card"}
                </h3>
                <p className="text-sm text-gray-600">
                  Visa, Mastercard
                </p>
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {isKa ? "ნაღდი ანგარიშსწორება" : "Cash on Delivery"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isKa
                    ? "გადაიხადეთ მიწოდებისას"
                    : "Pay upon delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
