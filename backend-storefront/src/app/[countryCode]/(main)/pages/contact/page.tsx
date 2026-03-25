"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

export default function ContactPage() {
  const locale = useLocale()
  const isKa = locale === "ka"

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="content-container py-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isKa ? "კონტაქტი" : "Contact Us"}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {isKa
              ? "დაგვიკავშირდით ნებისმიერ კითხვასთან დაკავშირებით"
              : "Get in touch with us for any questions"}
          </p>
        </div>
      </div>

      <div className="content-container py-10">
        <div className="grid grid-cols-1 medium:grid-cols-2 gap-10">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                {/* MapPin */}
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
                <h3 className="font-semibold text-gray-900">
                  {isKa ? "მისამართი" : "Address"}
                </h3>
                <p className="text-gray-600 mt-1">
                  {isKa
                    ? "თბილისი, საქართველო"
                    : "Tbilisi, Georgia"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                {/* Phone */}
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isKa ? "ტელეფონი" : "Phone"}
                </h3>
                <p className="text-gray-600 mt-1">+995 32 200 00 00</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                {/* Mail */}
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isKa ? "ელ. ფოსტა" : "Email"}
                </h3>
                <p className="text-gray-600 mt-1">info@medpharma.ge</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                {/* Clock */}
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isKa ? "სამუშაო საათები" : "Working Hours"}
                </h3>
                <div className="text-gray-600 mt-1 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">
                      {isKa ? "ოფისი:" : "Office:"}
                    </span>{" "}
                    {isKa
                      ? "ორშ-პარ 09:00 - 18:00"
                      : "Mon-Fri 09:00 - 18:00"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {isKa ? "აფთიაქი:" : "Pharmacy:"}
                    </span>{" "}
                    {isKa
                      ? "ორშ-პარ 09:00 - 20:00"
                      : "Mon-Fri 09:00 - 20:00"}
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

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {isKa ? "შეტყობინება გაიგზავნა!" : "Message Sent!"}
                </h3>
                <p className="text-gray-600 mt-2">
                  {isKa
                    ? "მადლობა დაკავშირებისთვის. ჩვენ მალე დაგიკავშირდებით."
                    : "Thank you for reaching out. We will get back to you soon."}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      subject: "",
                      message: "",
                    })
                  }}
                  className="mt-6 text-brand-red hover:underline font-medium"
                >
                  {isKa ? "ახალი შეტყობინების გაგზავნა" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {isKa ? "მოგვწერეთ" : "Send us a message"}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKa ? "სახელი" : "Name"} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder={isKa ? "თქვენი სახელი" : "Your name"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKa ? "ტელეფონი" : "Phone"} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder="+995 5XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKa ? "ელ. ფოსტა" : "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKa ? "თემა" : "Subject"} *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder={isKa ? "შეტყობინების თემა" : "Message subject"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKa ? "შეტყობინება" : "Message"} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                    placeholder={
                      isKa ? "დაწერეთ თქვენი შეტყობინება..." : "Write your message..."
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {/* Send */}
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
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                      </svg>
                      {isKa ? "გაგზავნა" : "Send Message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
