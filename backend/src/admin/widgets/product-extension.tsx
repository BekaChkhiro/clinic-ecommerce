import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { useEffect, useState, useCallback } from "react"
import {
  Container,
  Heading,
  Button,
  Badge,
  Text,
  toast,
} from "@medusajs/ui"

type ProductExtensionData = {
  id: string
  name_ka: string
  name_en: string | null
  description_ka: string | null
  description_en: string | null
  is_sugar_free: boolean
  is_low_protein: boolean
  is_diabetic_friendly: boolean
  is_gluten_free: boolean
  product_type: string
  manufacturer_country: string | null
  weight: string | null
  unit: string | null
  apex_id: string | null
  meta_title_ka: string | null
  meta_title_en: string | null
  meta_description_ka: string | null
  meta_description_en: string | null
}

type FormData = {
  name_ka: string
  name_en: string
  description_ka: string
  description_en: string
  is_sugar_free: boolean
  is_low_protein: boolean
  is_diabetic_friendly: boolean
  is_gluten_free: boolean
  product_type: string
  manufacturer_country: string
  weight: string
  unit: string
  apex_id: string
  meta_title_ka: string
  meta_title_en: string
  meta_description_ka: string
  meta_description_en: string
}

const emptyForm: FormData = {
  name_ka: "",
  name_en: "",
  description_ka: "",
  description_en: "",
  is_sugar_free: false,
  is_low_protein: false,
  is_diabetic_friendly: false,
  is_gluten_free: false,
  product_type: "OTHER",
  manufacturer_country: "",
  weight: "",
  unit: "",
  apex_id: "",
  meta_title_ka: "",
  meta_title_en: "",
  meta_description_ka: "",
  meta_description_en: "",
}

const PRODUCT_TYPES = [
  { value: "SUPPLEMENT", label: "Supplement (საკვები დანამატი)" },
  { value: "SPECIAL_FOOD", label: "Special Food (სპეც. სამედიცინო საკვები)" },
  { value: "MEDICATION", label: "Medication (მედიკამენტი)" },
  { value: "COSMETIC", label: "Cosmetic (კოსმეტიკა)" },
  { value: "DEVICE", label: "Device (სამედიცინო მოწყობილობა)" },
  { value: "OTHER", label: "Other (სხვა)" },
]

const UNIT_OPTIONS = [
  { value: "", label: "— Select —" },
  { value: "გ", label: "გ (grams)" },
  { value: "მლ", label: "მლ (ml)" },
  { value: "ცალი", label: "ცალი (pcs)" },
  { value: "კგ", label: "კგ (kg)" },
  { value: "ლ", label: "ლ (liters)" },
]

const COUNTRY_OPTIONS = [
  "",
  "საქართველო",
  "რუსეთი",
  "იტალია",
  "გერმანია",
  "თურქეთი",
  "შვედეთი",
  "დიდი ბრიტანეთი",
  "აშშ",
  "ჩინეთი",
  "ინდოეთი",
]

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border-base, #e5e5e5)",
  fontSize: 14,
  background: "var(--bg-field, #fff)",
  boxSizing: "border-box",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "auto",
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 80,
  resize: "vertical",
  fontFamily: "inherit",
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
  paddingBottom: 16,
  borderBottom: "1px solid var(--border-base, #e5e5e5)",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
}

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  padding: "4px 0",
}

const ProductExtensionWidget = ({ data }: DetailWidgetProps<any>) => {
  const productId = data.id
  const [extension, setExtension] = useState<ProductExtensionData | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showSeo, setShowSeo] = useState(false)

  const fetchExtension = useCallback(async () => {
    try {
      const res = await fetch(`/admin/products/${productId}/extension`, {
        credentials: "include",
      })
      const json = await res.json()
      const ext = json.product_extension
      setExtension(ext)
      if (ext) {
        setForm({
          name_ka: ext.name_ka || "",
          name_en: ext.name_en || "",
          description_ka: ext.description_ka || "",
          description_en: ext.description_en || "",
          is_sugar_free: ext.is_sugar_free ?? false,
          is_low_protein: ext.is_low_protein ?? false,
          is_diabetic_friendly: ext.is_diabetic_friendly ?? false,
          is_gluten_free: ext.is_gluten_free ?? false,
          product_type: ext.product_type || "OTHER",
          manufacturer_country: ext.manufacturer_country || "",
          weight: ext.weight || "",
          unit: ext.unit || "",
          apex_id: ext.apex_id || "",
          meta_title_ka: ext.meta_title_ka || "",
          meta_title_en: ext.meta_title_en || "",
          meta_description_ka: ext.meta_description_ka || "",
          meta_description_en: ext.meta_description_en || "",
        })
      }
    } catch {
      // Extension might not exist yet
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchExtension()
  }, [fetchExtension])

  const handleSave = async () => {
    if (!form.name_ka.trim()) {
      toast.error("Georgian name is required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/admin/products/${productId}/extension`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success(extension ? "Extension updated" : "Extension created")
      setEditing(false)
      await fetchExtension()
    } catch {
      toast.error("Failed to save extension")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (extension) {
      setForm({
        name_ka: extension.name_ka || "",
        name_en: extension.name_en || "",
        description_ka: extension.description_ka || "",
        description_en: extension.description_en || "",
        is_sugar_free: extension.is_sugar_free ?? false,
        is_low_protein: extension.is_low_protein ?? false,
        is_diabetic_friendly: extension.is_diabetic_friendly ?? false,
        is_gluten_free: extension.is_gluten_free ?? false,
        product_type: extension.product_type || "OTHER",
        manufacturer_country: extension.manufacturer_country || "",
        weight: extension.weight || "",
        unit: extension.unit || "",
        apex_id: extension.apex_id || "",
        meta_title_ka: extension.meta_title_ka || "",
        meta_title_en: extension.meta_title_en || "",
        meta_description_ka: extension.meta_description_ka || "",
        meta_description_en: extension.meta_description_en || "",
      })
    } else {
      setForm(emptyForm)
    }
  }

  if (loading) {
    return (
      <Container>
        <Heading level="h2">Product Extension</Heading>
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </Container>
    )
  }

  // View mode (not editing)
  if (!editing) {
    return (
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Heading level="h2">Product Extension</Heading>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setEditing(true)}
          >
            {extension ? "Edit" : "Add Extension"}
          </Button>
        </div>

        {!extension ? (
          <Text style={{ color: "var(--fg-subtle)" }}>
            No extension data yet. Click "Add Extension" to add bilingual names, dietary tags, and more.
          </Text>
        ) : (
          <div>
            {/* Bilingual Names */}
            <div style={sectionStyle}>
              <Text size="small" weight="plus" style={{ marginBottom: 8, color: "var(--fg-subtle)" }}>
                Bilingual Names
              </Text>
              <div style={gridStyle}>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Georgian</Text>
                  <Text weight="plus">{extension.name_ka || "—"}</Text>
                </div>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>English</Text>
                  <Text>{extension.name_en || "—"}</Text>
                </div>
              </div>
            </div>

            {/* Dietary Tags */}
            <div style={sectionStyle}>
              <Text size="small" weight="plus" style={{ marginBottom: 8, color: "var(--fg-subtle)" }}>
                Dietary Tags
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {extension.is_sugar_free && <Badge color="green">Sugar Free</Badge>}
                {extension.is_low_protein && <Badge color="blue">Low Protein (PKU)</Badge>}
                {extension.is_diabetic_friendly && <Badge color="purple">Diabetic Friendly</Badge>}
                {extension.is_gluten_free && <Badge color="orange">Gluten Free</Badge>}
                {!extension.is_sugar_free && !extension.is_low_protein && !extension.is_diabetic_friendly && !extension.is_gluten_free && (
                  <Text size="small" style={{ color: "var(--fg-muted)" }}>No dietary tags</Text>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div style={sectionStyle}>
              <Text size="small" weight="plus" style={{ marginBottom: 8, color: "var(--fg-subtle)" }}>
                Product Info
              </Text>
              <div style={gridStyle}>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Type</Text>
                  <Badge color="grey">{extension.product_type}</Badge>
                </div>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Country</Text>
                  <Text>{extension.manufacturer_country || "—"}</Text>
                </div>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Weight</Text>
                  <Text>{extension.weight ? `${extension.weight} ${extension.unit || ""}`.trim() : "—"}</Text>
                </div>
                <div>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>APEX ID</Text>
                  <Text style={{ fontFamily: "monospace" }}>{extension.apex_id || "—"}</Text>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            {(extension.description_ka || extension.description_en) && (
              <div style={sectionStyle}>
                <Text size="small" weight="plus" style={{ marginBottom: 8, color: "var(--fg-subtle)" }}>
                  Descriptions
                </Text>
                {extension.description_ka && (
                  <div style={{ marginBottom: 8 }}>
                    <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Georgian</Text>
                    <Text size="small">{extension.description_ka}</Text>
                  </div>
                )}
                {extension.description_en && (
                  <div>
                    <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>English</Text>
                    <Text size="small">{extension.description_en}</Text>
                  </div>
                )}
              </div>
            )}

            {/* SEO */}
            {(extension.meta_title_ka || extension.meta_title_en) && (
              <div>
                <Text size="small" weight="plus" style={{ marginBottom: 8, color: "var(--fg-subtle)" }}>
                  SEO
                </Text>
                <div style={gridStyle}>
                  <div>
                    <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Meta Title (KA)</Text>
                    <Text size="small">{extension.meta_title_ka || "—"}</Text>
                  </div>
                  <div>
                    <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Meta Title (EN)</Text>
                    <Text size="small">{extension.meta_title_en || "—"}</Text>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    )
  }

  // Edit mode
  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Heading level="h2">
          {extension ? "Edit Product Extension" : "Add Product Extension"}
        </Heading>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="small" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="small" onClick={handleSave} isLoading={saving}>
            Save
          </Button>
        </div>
      </div>

      {/* Bilingual Names */}
      <div style={sectionStyle}>
        <Text size="small" weight="plus" style={{ marginBottom: 10, color: "var(--fg-subtle)" }}>
          Bilingual Names
        </Text>
        <div style={gridStyle}>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Name (Georgian) *</Text>
            <input
              type="text"
              value={form.name_ka}
              onChange={(e) => setForm({ ...form, name_ka: e.target.value })}
              placeholder="პროდუქტის სახელი"
              required
              style={inputStyle}
            />
          </label>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Name (English)</Text>
            <input
              type="text"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              placeholder="Product name"
              style={inputStyle}
            />
          </label>
        </div>
      </div>

      {/* Bilingual Descriptions */}
      <div style={sectionStyle}>
        <Text size="small" weight="plus" style={{ marginBottom: 10, color: "var(--fg-subtle)" }}>
          Descriptions
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Description (Georgian)</Text>
            <textarea
              value={form.description_ka}
              onChange={(e) => setForm({ ...form, description_ka: e.target.value })}
              placeholder="პროდუქტის აღწერა ქართულად"
              style={textareaStyle}
            />
          </label>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Description (English)</Text>
            <textarea
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              placeholder="Product description in English"
              style={textareaStyle}
            />
          </label>
        </div>
      </div>

      {/* Dietary Tags */}
      <div style={sectionStyle}>
        <Text size="small" weight="plus" style={{ marginBottom: 10, color: "var(--fg-subtle)" }}>
          Dietary Tags
        </Text>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.is_sugar_free}
              onChange={(e) => setForm({ ...form, is_sugar_free: e.target.checked })}
            />
            <Text size="small">Sugar Free (უშაქრო)</Text>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.is_low_protein}
              onChange={(e) => setForm({ ...form, is_low_protein: e.target.checked })}
            />
            <Text size="small">Low Protein / PKU (დაბალცილებიანი)</Text>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.is_diabetic_friendly}
              onChange={(e) => setForm({ ...form, is_diabetic_friendly: e.target.checked })}
            />
            <Text size="small">Diabetic Friendly (დიაბეტისთვის)</Text>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={form.is_gluten_free}
              onChange={(e) => setForm({ ...form, is_gluten_free: e.target.checked })}
            />
            <Text size="small">Gluten Free (უგლუტენო)</Text>
          </label>
        </div>
      </div>

      {/* Product Type & Manufacturer */}
      <div style={sectionStyle}>
        <Text size="small" weight="plus" style={{ marginBottom: 10, color: "var(--fg-subtle)" }}>
          Product Info
        </Text>
        <div style={gridStyle}>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Product Type</Text>
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              style={selectStyle}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Manufacturer Country</Text>
            <select
              value={form.manufacturer_country}
              onChange={(e) => setForm({ ...form, manufacturer_country: e.target.value })}
              style={selectStyle}
            >
              <option value="">— Select —</option>
              {COUNTRY_OPTIONS.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={COUNTRY_OPTIONS.includes(form.manufacturer_country) ? "" : form.manufacturer_country}
              onChange={(e) => setForm({ ...form, manufacturer_country: e.target.value })}
              placeholder="Or type custom country"
              style={{ ...inputStyle, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ ...gridStyle, marginTop: 12 }}>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Weight</Text>
            <input
              type="text"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 100, 500, N150"
              style={inputStyle}
            />
          </label>
          <label>
            <Text size="xsmall" style={{ marginBottom: 4 }}>Unit</Text>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              style={selectStyle}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* APEX ID */}
      <div style={sectionStyle}>
        <Text size="small" weight="plus" style={{ marginBottom: 10, color: "var(--fg-subtle)" }}>
          ERP Integration
        </Text>
        <label>
          <Text size="xsmall" style={{ marginBottom: 4 }}>APEX ID</Text>
          <input
            type="text"
            value={form.apex_id}
            onChange={(e) => setForm({ ...form, apex_id: e.target.value })}
            placeholder="APEX ERP product identifier"
            style={{ ...inputStyle, fontFamily: "monospace" }}
          />
          <Text size="xsmall" style={{ color: "var(--fg-muted)", marginTop: 2 }}>
            Links this product to the APEX ERP system for inventory sync.
          </Text>
        </label>
      </div>

      {/* SEO (collapsible) */}
      <div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 10 }}
          onClick={() => setShowSeo(!showSeo)}
        >
          <Text size="small" weight="plus" style={{ color: "var(--fg-subtle)" }}>
            SEO Fields {showSeo ? "▾" : "▸"}
          </Text>
        </div>
        {showSeo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={gridStyle}>
              <label>
                <Text size="xsmall" style={{ marginBottom: 4 }}>Meta Title (Georgian)</Text>
                <input
                  type="text"
                  value={form.meta_title_ka}
                  onChange={(e) => setForm({ ...form, meta_title_ka: e.target.value })}
                  placeholder="SEO სათაური"
                  style={inputStyle}
                />
              </label>
              <label>
                <Text size="xsmall" style={{ marginBottom: 4 }}>Meta Title (English)</Text>
                <input
                  type="text"
                  value={form.meta_title_en}
                  onChange={(e) => setForm({ ...form, meta_title_en: e.target.value })}
                  placeholder="SEO title"
                  style={inputStyle}
                />
              </label>
            </div>
            <div style={gridStyle}>
              <label>
                <Text size="xsmall" style={{ marginBottom: 4 }}>Meta Description (Georgian)</Text>
                <textarea
                  value={form.meta_description_ka}
                  onChange={(e) => setForm({ ...form, meta_description_ka: e.target.value })}
                  placeholder="SEO აღწერა"
                  style={{ ...textareaStyle, minHeight: 60 }}
                />
              </label>
              <label>
                <Text size="xsmall" style={{ marginBottom: 4 }}>Meta Description (English)</Text>
                <textarea
                  value={form.meta_description_en}
                  onChange={(e) => setForm({ ...form, meta_description_en: e.target.value })}
                  placeholder="SEO description"
                  style={{ ...textareaStyle, minHeight: 60 }}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductExtensionWidget
