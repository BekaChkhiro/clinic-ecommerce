import { getLocale } from "@lib/data/locale-actions"

export default async function BranchesPage() {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container py-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isKa ? "აფთიაქი" : "Pharmacy"}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {isKa
              ? "ეწვიეთ ჩვენს აფთიაქს ან შეუკვეთეთ ონლაინ"
              : "Visit our pharmacy or order online"}
          </p>
        </div>
      </div>

      <div className="content-container py-10">
        {/* Map Placeholder */}
        <div className="w-full h-72 small:h-96 bg-gray-200 rounded-2xl flex items-center justify-center mb-10">
          {/* MapPin icon */}
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
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
            <span className="text-sm font-medium">
              {isKa ? "რუკა მალე დაემატება" : "Map coming soon"}
            </span>
          </div>
        </div>

        {/* Pharmacy Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-brand-red px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {isKa ? "მედფარმა პლუსი" : "MedPharma Plus"}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
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
                  <h3 className="text-sm font-semibold text-gray-900">
                    {isKa ? "მისამართი" : "Address"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {isKa ? "თბილისი, საქართველო" : "Tbilisi, Georgia"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-red"
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
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {isKa ? "ტელეფონი" : "Phone"}
                  </h3>
                  <a
                    href="tel:+995322000000"
                    className="text-brand-red text-sm mt-0.5 hover:underline"
                  >
                    +995 32 200 00 00
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-red"
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
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {isKa ? "ელ. ფოსტა" : "Email"}
                  </h3>
                  <a
                    href="mailto:info@medpharma.ge"
                    className="text-brand-red text-sm mt-0.5 hover:underline"
                  >
                    info@medpharma.ge
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {isKa ? "სამუშაო საათები" : "Working Hours"}
                  </h3>
                  <div className="text-gray-600 text-sm mt-1 space-y-1">
                    <p>
                      <span className="font-medium">
                        {isKa ? "ორშ-პარ:" : "Mon-Fri:"}
                      </span>{" "}
                      09:00 - 20:00
                    </p>
                    <p>
                      <span className="font-medium">
                        {isKa ? "შაბათი:" : "Saturday:"}
                      </span>{" "}
                      10:00 - 18:00
                    </p>
                    <p>
                      <span className="font-medium">
                        {isKa ? "კვირა:" : "Sunday:"}
                      </span>{" "}
                      {isKa ? "დაკეტილია" : "Closed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info Section */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                {/* Truck icon */}
                <svg
                  className="w-6 h-6 text-brand-red"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isKa ? "მიტანის სერვისი" : "Delivery Service"}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {isKa
                    ? "თბილისში მიტანა ხდება 1-2 სამუშაო დღეში. 50 ლარის ზემოთ შეკვეთებისთვის მიტანა უფასოა. ექსპრეს მიტანა ხელმისაწვდომია იმავე დღეს 14:00 საათამდე შეკვეთისთვის."
                    : "Delivery in Tbilisi takes 1-2 business days. Free delivery for orders over 50 GEL. Express delivery is available same day for orders placed before 14:00."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
