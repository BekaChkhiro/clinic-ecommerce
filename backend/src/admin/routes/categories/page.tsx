import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SquaresPlus } from "@medusajs/icons"
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

type Category = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
  description_ka: string | null
  description_en: string | null
  image: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
}

type CategoryFormData = {
  name_ka: string
  name_en: string
  slug: string
  description_ka: string
  description_en: string
  image: string
  parent_id: string
  sort_order: number
  is_active: boolean
}

const emptyForm: CategoryFormData = {
  name_ka: "",
  name_en: "",
  slug: "",
  description_ka: "",
  description_en: "",
  image: "",
  parent_id: "",
  sort_order: 0,
  is_active: true,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function buildCategoryTree(categories: Category[]): (Category & { depth: number })[] {
  const map = new Map<string, Category>()
  for (const cat of categories) {
    map.set(cat.id, cat)
  }

  const result: (Category & { depth: number })[] = []

  function addChildren(parentId: string | null, depth: number) {
    const children = categories
      .filter((c) => (c.parent_id || null) === parentId)
      .sort((a, b) => a.sort_order - b.sort_order)
    for (const child of children) {
      result.push({ ...child, depth })
      addChildren(child.id, depth + 1)
    }
  }

  addChildren(null, 0)
  return result
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
  minHeight: 72,
  resize: "vertical" as const,
  fontFamily: "inherit",
}

// --- Inline Form Modal ---
function CategoryFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
  categories,
  editingId,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: CategoryFormData) => Promise<void>
  initialData: CategoryFormData
  isEditing: boolean
  categories: Category[]
  editingId: string | null
}) {
  const [form, setForm] = useState<CategoryFormData>(initialData)
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

  // Filter out the current category and its descendants from parent options
  const getDescendantIds = (parentId: string): string[] => {
    const ids: string[] = []
    const children = categories.filter((c) => c.parent_id === parentId)
    for (const child of children) {
      ids.push(child.id)
      ids.push(...getDescendantIds(child.id))
    }
    return ids
  }

  const excludeIds = editingId
    ? [editingId, ...getDescendantIds(editingId)]
    : []

  const parentOptions = categories.filter((c) => !excludeIds.includes(c.id))
  const treeOptions = buildCategoryTree(parentOptions)

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
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level="h2" style={{ marginBottom: 16 }}>
          {isEditing ? "Edit Category" : "Add Category"}
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
                placeholder="კატეგორიის სახელი"
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
                placeholder="Category name"
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
                placeholder="category-slug"
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
                Parent Category
              </Text>
              <select
                value={form.parent_id}
                onChange={(e) =>
                  setForm({ ...form, parent_id: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">— None (Top Level) —</option>
                {treeOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {"─".repeat(cat.depth)} {cat.name_ka}
                    {cat.name_en ? ` / ${cat.name_en}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Description (Georgian)
              </Text>
              <textarea
                value={form.description_ka}
                onChange={(e) =>
                  setForm({ ...form, description_ka: e.target.value })
                }
                placeholder="კატეგორიის აღწერა"
                style={textareaStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Description (English)
              </Text>
              <textarea
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
                placeholder="Category description"
                style={textareaStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Image URL
              </Text>
              <input
                type="text"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                placeholder="https://..."
                style={inputStyle}
              />
              {form.image && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={form.image}
                    alt="Category preview"
                    style={{
                      maxHeight: 64,
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
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---
const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const prompt = usePrompt()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/admin/categories?limit=200", {
        credentials: "include",
      })
      const data = await res.json()
      setCategories(data.categories || [])
    } catch {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleSave = async (formData: CategoryFormData) => {
    const payload: Record<string, unknown> = {
      name_ka: formData.name_ka,
      name_en: formData.name_en || null,
      slug: formData.slug,
      description_ka: formData.description_ka || null,
      description_en: formData.description_en || null,
      image: formData.image || null,
      parent_id: formData.parent_id || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
    }

    try {
      if (editingCategory) {
        const res = await fetch(`/admin/categories/${editingCategory.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Category updated")
      } else {
        const res = await fetch("/admin/categories", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Category created")
      }
      setModalOpen(false)
      await fetchCategories()
    } catch {
      toast.error(
        editingCategory
          ? "Failed to update category"
          : "Failed to create category"
      )
    }
  }

  const handleDelete = async (category: Category) => {
    const hasChildren = categories.some((c) => c.parent_id === category.id)

    const confirmed = await prompt({
      title: "Delete Category",
      description: hasChildren
        ? `"${category.name_ka}" has subcategories. Deleting it will orphan them. Are you sure?`
        : `Are you sure you want to delete "${category.name_ka}"? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/categories/${category.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Category deleted")
      await fetchCategories()
    } catch {
      toast.error("Failed to delete category")
    }
  }

  const handleToggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/admin/categories/${category.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !category.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(
        category.is_active ? "Category deactivated" : "Category activated"
      )
      await fetchCategories()
    } catch {
      toast.error("Failed to update category status")
    }
  }

  const tree = buildCategoryTree(categories)

  const parentNameMap = new Map<string, string>()
  for (const cat of categories) {
    parentNameMap.set(cat.id, cat.name_ka)
  }

  const formInitialData: CategoryFormData = editingCategory
    ? {
        name_ka: editingCategory.name_ka,
        name_en: editingCategory.name_en || "",
        slug: editingCategory.slug,
        description_ka: editingCategory.description_ka || "",
        description_en: editingCategory.description_en || "",
        image: editingCategory.image || "",
        parent_id: editingCategory.parent_id || "",
        sort_order: editingCategory.sort_order,
        is_active: editingCategory.is_active,
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
          <Heading level="h1">Categories</Heading>
          <Text
            size="small"
            style={{ color: "var(--fg-subtle)", marginTop: 4 }}
          >
            Manage product categories with hierarchy
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            No categories yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Category
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name (KA)</Table.HeaderCell>
              <Table.HeaderCell>Name (EN)</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Parent</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tree.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell>
                  <Text weight="plus">
                    {category.depth > 0 && (
                      <span
                        style={{
                          color: "var(--fg-subtle)",
                          marginRight: 4,
                        }}
                      >
                        {"│ ".repeat(category.depth - 1)}└─{" "}
                      </span>
                    )}
                    {category.name_ka}
                  </Text>
                </Table.Cell>
                <Table.Cell>{category.name_en || "—"}</Table.Cell>
                <Table.Cell>
                  <Text
                    size="small"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {category.slug}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {category.parent_id
                    ? parentNameMap.get(category.parent_id) || "—"
                    : "—"}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={category.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(category)}
                  >
                    {category.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(category)}
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

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingCategory}
        categories={categories}
        editingId={editingCategory?.id || null}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Categories",
  icon: SquaresPlus,
})

export default CategoriesPage
