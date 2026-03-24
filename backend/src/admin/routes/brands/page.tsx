import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"
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

type Brand = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
  country: string | null
  logo: string | null
  is_active: boolean
  sort_order: number
}

type BrandFormData = {
  name_ka: string
  name_en: string
  slug: string
  country: string
  logo: string
  is_active: boolean
  sort_order: number
}

const emptyForm: BrandFormData = {
  name_ka: "",
  name_en: "",
  slug: "",
  country: "",
  logo: "",
  is_active: true,
  sort_order: 0,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// --- Inline Form Modal ---
function BrandFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: BrandFormData) => Promise<void>
  initialData: BrandFormData
  isEditing: boolean
}) {
  const [form, setForm] = useState<BrandFormData>(initialData)
  const [saving, setSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)

  useEffect(() => {
    if (open) {
      setForm(initialData)
      setAutoSlug(!isEditing)
    }
  }, [open, initialData, isEditing])

  useEffect(() => {
    if (autoSlug && form.name_en) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name_en) }))
    }
  }, [form.name_en, autoSlug])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_ka.trim()) {
      toast.error("Georgian name is required")
      return
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required")
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
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level="h2" style={{ marginBottom: 16 }}>
          {isEditing ? "Edit Brand" : "Add Brand"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Name (Georgian) *
              </Text>
              <input
                type="text"
                value={form.name_ka}
                onChange={(e) =>
                  setForm({ ...form, name_ka: e.target.value })
                }
                placeholder="ბრენდის სახელი"
                required
                style={inputStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Name (English)
              </Text>
              <input
                type="text"
                value={form.name_en}
                onChange={(e) =>
                  setForm({ ...form, name_en: e.target.value })
                }
                placeholder="Brand name"
                style={inputStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Slug *
              </Text>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  setForm({ ...form, slug: e.target.value })
                }}
                placeholder="brand-slug"
                required
                style={inputStyle}
              />
              <Text
                size="xsmall"
                style={{ color: "var(--fg-subtle)", marginTop: 2 }}
              >
                URL-friendly identifier. Auto-generated from English name.
              </Text>
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Country
              </Text>
              <input
                type="text"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
                placeholder="e.g. Italy, Russia, Georgia"
                style={inputStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Logo URL
              </Text>
              <input
                type="text"
                value={form.logo}
                onChange={(e) =>
                  setForm({ ...form, logo: e.target.value })
                }
                placeholder="https://..."
                style={inputStyle}
              />
              {form.logo && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    style={{
                      maxHeight: 48,
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
            <label>
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
              {isEditing ? "Save Changes" : "Create Brand"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---
const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const prompt = usePrompt()

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/admin/brands?limit=100", {
        credentials: "include",
      })
      const data = await res.json()
      const sorted = (data.brands || []).sort(
        (a: Brand, b: Brand) => a.sort_order - b.sort_order
      )
      setBrands(sorted)
    } catch {
      toast.error("Failed to load brands")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const handleCreate = () => {
    setEditingBrand(null)
    setModalOpen(true)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setModalOpen(true)
  }

  const handleSave = async (formData: BrandFormData) => {
    try {
      if (editingBrand) {
        const res = await fetch(`/admin/brands/${editingBrand.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Brand updated")
      } else {
        const res = await fetch("/admin/brands", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Brand created")
      }
      setModalOpen(false)
      await fetchBrands()
    } catch {
      toast.error(
        editingBrand ? "Failed to update brand" : "Failed to create brand"
      )
    }
  }

  const handleDelete = async (brand: Brand) => {
    const confirmed = await prompt({
      title: "Delete Brand",
      description: `Are you sure you want to delete "${brand.name_ka}"? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/brands/${brand.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Brand deleted")
      await fetchBrands()
    } catch {
      toast.error("Failed to delete brand")
    }
  }

  const handleToggleActive = async (brand: Brand) => {
    try {
      const res = await fetch(`/admin/brands/${brand.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !brand.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(brand.is_active ? "Brand deactivated" : "Brand activated")
      await fetchBrands()
    } catch {
      toast.error("Failed to update brand status")
    }
  }

  const formInitialData: BrandFormData = editingBrand
    ? {
        name_ka: editingBrand.name_ka,
        name_en: editingBrand.name_en || "",
        slug: editingBrand.slug,
        country: editingBrand.country || "",
        logo: editingBrand.logo || "",
        is_active: editingBrand.is_active,
        sort_order: editingBrand.sort_order,
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
          <Heading level="h1">Brands</Heading>
          <Text
            size="small"
            style={{ color: "var(--fg-subtle)", marginTop: 4 }}
          >
            Manage product brands and manufacturers
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Brand
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : brands.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            No brands yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Brand
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: 56 }}>Logo</Table.HeaderCell>
              <Table.HeaderCell>Name (KA)</Table.HeaderCell>
              <Table.HeaderCell>Name (EN)</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {brands.map((brand) => (
              <Table.Row key={brand.id}>
                <Table.Cell>
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name_en || brand.name_ka}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "contain",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: "var(--bg-subtle, #f3f3f3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "var(--fg-subtle)",
                      }}
                    >
                      —
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text weight="plus">{brand.name_ka}</Text>
                </Table.Cell>
                <Table.Cell>{brand.name_en || "—"}</Table.Cell>
                <Table.Cell>
                  <Text
                    size="small"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {brand.slug}
                  </Text>
                </Table.Cell>
                <Table.Cell>{brand.country || "—"}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={brand.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(brand)}
                  >
                    {brand.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleEdit(brand)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(brand)}
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

      <BrandFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingBrand}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})

export default BrandsPage
