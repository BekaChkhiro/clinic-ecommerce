import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import { useEffect, useState, useCallback } from "react"
import {
  Container,
  Heading,
  Table,
  Button,
  Badge,
  Text,
  usePrompt,
  toast,
} from "@medusajs/ui"

type Banner = {
  id: string
  title_ka: string | null
  title_en: string | null
  subtitle_ka: string | null
  subtitle_en: string | null
  image: string
  image_mobile: string | null
  link: string | null
  button_text_ka: string | null
  button_text_en: string | null
  position: "homepage" | "category" | "product"
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  sort_order: number
}

type BannerFormData = {
  title_ka: string
  title_en: string
  subtitle_ka: string
  subtitle_en: string
  image: string
  image_mobile: string
  link: string
  button_text_ka: string
  button_text_en: string
  position: "homepage" | "category" | "product"
  starts_at: string
  ends_at: string
  is_active: boolean
  sort_order: number
}

const emptyForm: BannerFormData = {
  title_ka: "",
  title_en: "",
  subtitle_ka: "",
  subtitle_en: "",
  image: "",
  image_mobile: "",
  link: "",
  button_text_ka: "",
  button_text_en: "",
  position: "homepage",
  starts_at: "",
  ends_at: "",
  is_active: true,
  sort_order: 0,
}

const positionLabels: Record<string, string> = {
  homepage: "Homepage",
  category: "Category",
  product: "Product",
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

function toDatetimeLocal(dateStr: string | null): string {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  } catch {
    return ""
  }
}

// --- Inline Form Modal ---
function BannerFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: BannerFormData) => Promise<void>
  initialData: BannerFormData
  isEditing: boolean
}) {
  const [form, setForm] = useState<BannerFormData>(initialData)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialData)
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image.trim()) {
      toast.error("Image URL is required")
      return
    }
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-base, #e5e5e5)",
    fontSize: 14,
    background: "var(--bg-field, #fff)",
  }

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer" as const,
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-base, #fff)",
          borderRadius: 12,
          padding: 24,
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level="h2" style={{ marginBottom: 16 }}>
          {isEditing ? "Edit Banner" : "Add Banner"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Bilingual titles */}
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Title (Georgian)
                </Text>
                <input
                  type="text"
                  value={form.title_ka}
                  onChange={(e) =>
                    setForm({ ...form, title_ka: e.target.value })
                  }
                  placeholder="ბანერის სათაური"
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Title (English)
                </Text>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) =>
                    setForm({ ...form, title_en: e.target.value })
                  }
                  placeholder="Banner title"
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Bilingual subtitles */}
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Subtitle (Georgian)
                </Text>
                <input
                  type="text"
                  value={form.subtitle_ka}
                  onChange={(e) =>
                    setForm({ ...form, subtitle_ka: e.target.value })
                  }
                  placeholder="ქვესათაური"
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Subtitle (English)
                </Text>
                <input
                  type="text"
                  value={form.subtitle_en}
                  onChange={(e) =>
                    setForm({ ...form, subtitle_en: e.target.value })
                  }
                  placeholder="Subtitle"
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Images */}
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Image URL (Desktop) *
              </Text>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                required
                style={inputStyle}
              />
              {form.image && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={form.image}
                    alt="Desktop preview"
                    style={{
                      maxHeight: 80,
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid var(--border-base, #e5e5e5)",
                      padding: 4,
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>
              )}
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Image URL (Mobile)
              </Text>
              <input
                type="text"
                value={form.image_mobile}
                onChange={(e) =>
                  setForm({ ...form, image_mobile: e.target.value })
                }
                placeholder="https://... (optional, falls back to desktop)"
                style={inputStyle}
              />
              {form.image_mobile && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={form.image_mobile}
                    alt="Mobile preview"
                    style={{
                      maxHeight: 60,
                      maxWidth: 120,
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid var(--border-base, #e5e5e5)",
                      padding: 4,
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>
              )}
            </label>

            {/* Link and CTA */}
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Link URL
              </Text>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/store or https://..."
                style={inputStyle}
              />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Button Text (Georgian)
                </Text>
                <input
                  type="text"
                  value={form.button_text_ka}
                  onChange={(e) =>
                    setForm({ ...form, button_text_ka: e.target.value })
                  }
                  placeholder="იყიდე ახლა"
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Button Text (English)
                </Text>
                <input
                  type="text"
                  value={form.button_text_en}
                  onChange={(e) =>
                    setForm({ ...form, button_text_en: e.target.value })
                  }
                  placeholder="Shop Now"
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Position */}
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Position
              </Text>
              <select
                value={form.position}
                onChange={(e) =>
                  setForm({
                    ...form,
                    position: e.target.value as BannerFormData["position"],
                  })
                }
                style={selectStyle}
              >
                <option value="homepage">Homepage</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
              </select>
            </label>

            {/* Scheduling */}
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Starts At
                </Text>
                <input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) =>
                    setForm({ ...form, starts_at: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Ends At
                </Text>
                <input
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) =>
                    setForm({ ...form, ends_at: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
            </div>
            <Text
              size="xsmall"
              style={{ color: "var(--fg-subtle)", marginTop: -8 }}
            >
              Leave empty for always-active banners. Set dates to schedule
              campaigns.
            </Text>

            {/* Sort order and active */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Sort Order
                </Text>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  style={inputStyle}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  paddingBottom: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                <Text size="small">Active</Text>
              </label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 20,
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {isEditing ? "Save Changes" : "Create Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---
const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const prompt = usePrompt()

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/admin/banners?limit=100", {
        credentials: "include",
      })
      const data = await res.json()
      const sorted = (data.banners || []).sort(
        (a: Banner, b: Banner) => a.sort_order - b.sort_order
      )
      setBanners(sorted)
    } catch {
      toast.error("Failed to load banners")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleCreate = () => {
    setEditingBanner(null)
    setModalOpen(true)
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setModalOpen(true)
  }

  const serializeForm = (formData: BannerFormData): Record<string, unknown> => {
    return {
      title_ka: formData.title_ka || null,
      title_en: formData.title_en || null,
      subtitle_ka: formData.subtitle_ka || null,
      subtitle_en: formData.subtitle_en || null,
      image: formData.image,
      image_mobile: formData.image_mobile || null,
      link: formData.link || null,
      button_text_ka: formData.button_text_ka || null,
      button_text_en: formData.button_text_en || null,
      position: formData.position,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      is_active: formData.is_active,
      sort_order: formData.sort_order,
    }
  }

  const handleSave = async (formData: BannerFormData) => {
    try {
      const payload = serializeForm(formData)
      if (editingBanner) {
        const res = await fetch(`/admin/banners/${editingBanner.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Banner updated")
      } else {
        const res = await fetch("/admin/banners", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Banner created")
      }
      setModalOpen(false)
      await fetchBanners()
    } catch {
      toast.error(
        editingBanner ? "Failed to update banner" : "Failed to create banner"
      )
    }
  }

  const handleDelete = async (banner: Banner) => {
    const confirmed = await prompt({
      title: "Delete Banner",
      description: `Are you sure you want to delete this banner${banner.title_ka ? ` "${banner.title_ka}"` : ""}? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/banners/${banner.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Banner deleted")
      await fetchBanners()
    } catch {
      toast.error("Failed to delete banner")
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/admin/banners/${banner.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !banner.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(
        banner.is_active ? "Banner deactivated" : "Banner activated"
      )
      await fetchBanners()
    } catch {
      toast.error("Failed to update banner status")
    }
  }

  const formInitialData: BannerFormData = editingBanner
    ? {
        title_ka: editingBanner.title_ka || "",
        title_en: editingBanner.title_en || "",
        subtitle_ka: editingBanner.subtitle_ka || "",
        subtitle_en: editingBanner.subtitle_en || "",
        image: editingBanner.image,
        image_mobile: editingBanner.image_mobile || "",
        link: editingBanner.link || "",
        button_text_ka: editingBanner.button_text_ka || "",
        button_text_en: editingBanner.button_text_en || "",
        position: editingBanner.position,
        starts_at: toDatetimeLocal(editingBanner.starts_at),
        ends_at: toDatetimeLocal(editingBanner.ends_at),
        is_active: editingBanner.is_active,
        sort_order: editingBanner.sort_order,
      }
    : emptyForm

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <Heading level="h1">Banners</Heading>
          <Text
            size="small"
            style={{ color: "var(--fg-subtle)", marginTop: 4 }}
          >
            Manage promotional banners for homepage, categories, and products
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Banner
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : banners.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            No banners yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Banner
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: 80 }}>Preview</Table.HeaderCell>
              <Table.HeaderCell>Title (KA)</Table.HeaderCell>
              <Table.HeaderCell>Position</Table.HeaderCell>
              <Table.HeaderCell>Schedule</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {banners.map((banner) => (
              <Table.Row key={banner.id}>
                <Table.Cell>
                  <img
                    src={banner.image}
                    alt={banner.title_en || banner.title_ka || "Banner"}
                    style={{
                      width: 64,
                      height: 36,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid var(--border-base, #e5e5e5)",
                    }}
                    onError={(e) => {
                      const el = e.target as HTMLImageElement
                      el.style.display = "none"
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Text weight="plus">
                    {banner.title_ka || banner.title_en || "—"}
                  </Text>
                  {banner.link && (
                    <Text
                      size="xsmall"
                      style={{ color: "var(--fg-subtle)", marginTop: 2 }}
                    >
                      {banner.link}
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge color="blue">
                    {positionLabels[banner.position] || banner.position}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {banner.starts_at || banner.ends_at ? (
                    <Text size="small">
                      {formatDate(banner.starts_at)} –{" "}
                      {formatDate(banner.ends_at)}
                    </Text>
                  ) : (
                    <Text
                      size="small"
                      style={{ color: "var(--fg-subtle)" }}
                    >
                      Always
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={banner.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(banner)}
                  >
                    {banner.is_active ? "Active" : "Inactive"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEdit(banner)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(banner)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <BannerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingBanner}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banners",
  icon: PhotoSolid,
})

export default BannersPage
