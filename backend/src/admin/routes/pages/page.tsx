import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentTextSolid } from "@medusajs/icons"
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

type Page = {
  id: string
  slug: string
  title_ka: string
  title_en: string | null
  content_ka: string
  content_en: string | null
  meta_title_ka: string | null
  meta_title_en: string | null
  meta_description_ka: string | null
  meta_description_en: string | null
  is_active: boolean
  sort_order: number
}

type PageFormData = {
  slug: string
  title_ka: string
  title_en: string
  content_ka: string
  content_en: string
  meta_title_ka: string
  meta_title_en: string
  meta_description_ka: string
  meta_description_en: string
  is_active: boolean
  sort_order: number
}

const emptyForm: PageFormData = {
  slug: "",
  title_ka: "",
  title_en: "",
  content_ka: "",
  content_en: "",
  meta_title_ka: "",
  meta_title_en: "",
  meta_description_ka: "",
  meta_description_en: "",
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
function PageFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: PageFormData) => Promise<void>
  initialData: PageFormData
  isEditing: boolean
}) {
  const [form, setForm] = useState<PageFormData>(initialData)
  const [saving, setSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [showSeo, setShowSeo] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialData)
      setAutoSlug(!isEditing)
      setShowSeo(
        !!(
          initialData.meta_title_ka ||
          initialData.meta_title_en ||
          initialData.meta_description_ka ||
          initialData.meta_description_en
        )
      )
    }
  }, [open, initialData, isEditing])

  useEffect(() => {
    if (autoSlug && form.title_en) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title_en) }))
    }
  }, [form.title_en, autoSlug])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title_ka.trim()) {
      toast.error("Georgian title is required")
      return
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required")
      return
    }
    if (!form.content_ka.trim()) {
      toast.error("Georgian content is required")
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: 120,
    resize: "vertical" as const,
    fontFamily: "inherit",
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
          {isEditing ? "Edit Page" : "Add Page"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Title (Georgian) *
              </Text>
              <input
                type="text"
                value={form.title_ka}
                onChange={(e) =>
                  setForm({ ...form, title_ka: e.target.value })
                }
                placeholder="გვერდის სათაური"
                required
                style={inputStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Title (English)
              </Text>
              <input
                type="text"
                value={form.title_en}
                onChange={(e) =>
                  setForm({ ...form, title_en: e.target.value })
                }
                placeholder="Page title"
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
                placeholder="page-slug"
                required
                style={inputStyle}
              />
              <Text
                size="xsmall"
                style={{ color: "var(--fg-subtle)", marginTop: 2 }}
              >
                URL-friendly identifier. Auto-generated from English title.
              </Text>
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Content (Georgian) *
              </Text>
              <textarea
                value={form.content_ka}
                onChange={(e) =>
                  setForm({ ...form, content_ka: e.target.value })
                }
                placeholder="გვერდის შინაარსი (HTML ან ტექსტი)"
                required
                style={textareaStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Content (English)
              </Text>
              <textarea
                value={form.content_en}
                onChange={(e) =>
                  setForm({ ...form, content_en: e.target.value })
                }
                placeholder="Page content (HTML or text)"
                style={textareaStyle}
              />
            </label>

            {/* SEO Section */}
            <div style={{ marginTop: 4 }}>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setShowSeo(!showSeo)}
              >
                {showSeo ? "Hide SEO Fields" : "Show SEO Fields"}
              </Button>
            </div>

            {showSeo && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid var(--border-base, #e5e5e5)",
                  background: "var(--bg-subtle, #fafafa)",
                }}
              >
                <Text size="small" weight="plus" style={{ color: "var(--fg-subtle)" }}>
                  SEO Metadata
                </Text>
                <label>
                  <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                    Meta Title (Georgian)
                  </Text>
                  <input
                    type="text"
                    value={form.meta_title_ka}
                    onChange={(e) =>
                      setForm({ ...form, meta_title_ka: e.target.value })
                    }
                    placeholder="SEO სათაური"
                    style={inputStyle}
                  />
                </label>
                <label>
                  <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                    Meta Title (English)
                  </Text>
                  <input
                    type="text"
                    value={form.meta_title_en}
                    onChange={(e) =>
                      setForm({ ...form, meta_title_en: e.target.value })
                    }
                    placeholder="SEO title"
                    style={inputStyle}
                  />
                </label>
                <label>
                  <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                    Meta Description (Georgian)
                  </Text>
                  <textarea
                    value={form.meta_description_ka}
                    onChange={(e) =>
                      setForm({ ...form, meta_description_ka: e.target.value })
                    }
                    placeholder="SEO აღწერა"
                    style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const, fontFamily: "inherit" }}
                  />
                </label>
                <label>
                  <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                    Meta Description (English)
                  </Text>
                  <textarea
                    value={form.meta_description_en}
                    onChange={(e) =>
                      setForm({ ...form, meta_description_en: e.target.value })
                    }
                    placeholder="SEO description"
                    style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const, fontFamily: "inherit" }}
                  />
                </label>
              </div>
            )}

            <div style={{ display: "flex", gap: 16 }}>
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
                  style={{ ...inputStyle, width: 100 }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  paddingTop: 20,
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
              {isEditing ? "Save Changes" : "Create Page"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---
const PagesPage = () => {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const prompt = usePrompt()

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/admin/pages?limit=100", {
        credentials: "include",
      })
      const data = await res.json()
      const sorted = (data.pages || []).sort(
        (a: Page, b: Page) => a.sort_order - b.sort_order
      )
      setPages(sorted)
    } catch {
      toast.error("Failed to load pages")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  const handleCreate = () => {
    setEditingPage(null)
    setModalOpen(true)
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setModalOpen(true)
  }

  const handleSave = async (formData: PageFormData) => {
    try {
      if (editingPage) {
        const res = await fetch(`/admin/pages/${editingPage.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Page updated")
      } else {
        const res = await fetch("/admin/pages", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Page created")
      }
      setModalOpen(false)
      await fetchPages()
    } catch {
      toast.error(
        editingPage ? "Failed to update page" : "Failed to create page"
      )
    }
  }

  const handleDelete = async (page: Page) => {
    const confirmed = await prompt({
      title: "Delete Page",
      description: `Are you sure you want to delete "${page.title_ka}"? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/pages/${page.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Page deleted")
      await fetchPages()
    } catch {
      toast.error("Failed to delete page")
    }
  }

  const handleToggleActive = async (page: Page) => {
    try {
      const res = await fetch(`/admin/pages/${page.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !page.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(page.is_active ? "Page deactivated" : "Page activated")
      await fetchPages()
    } catch {
      toast.error("Failed to update page status")
    }
  }

  const truncate = (text: string | null, maxLen: number) => {
    if (!text) return "—"
    return text.length > maxLen ? text.substring(0, maxLen) + "..." : text
  }

  const formInitialData: PageFormData = editingPage
    ? {
        slug: editingPage.slug,
        title_ka: editingPage.title_ka,
        title_en: editingPage.title_en || "",
        content_ka: editingPage.content_ka,
        content_en: editingPage.content_en || "",
        meta_title_ka: editingPage.meta_title_ka || "",
        meta_title_en: editingPage.meta_title_en || "",
        meta_description_ka: editingPage.meta_description_ka || "",
        meta_description_en: editingPage.meta_description_en || "",
        is_active: editingPage.is_active,
        sort_order: editingPage.sort_order,
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
          <Heading level="h1">Pages</Heading>
          <Text
            size="small"
            style={{ color: "var(--fg-subtle)", marginTop: 4 }}
          >
            Manage static content pages (About, FAQ, Privacy Policy, etc.)
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Page
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : pages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            No pages yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Page
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title (KA)</Table.HeaderCell>
              <Table.HeaderCell>Title (EN)</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Content Preview</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pages.map((page) => (
              <Table.Row key={page.id}>
                <Table.Cell>
                  <Text weight="plus">{page.title_ka}</Text>
                </Table.Cell>
                <Table.Cell>{page.title_en || "—"}</Table.Cell>
                <Table.Cell>
                  <Text
                    size="small"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {page.slug}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text
                    size="small"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {truncate(page.content_ka, 50)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={page.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(page)}
                  >
                    {page.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleEdit(page)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(page)}
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

      <PageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingPage}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Pages",
  icon: DocumentTextSolid,
})

export default PagesPage
