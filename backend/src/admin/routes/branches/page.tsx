import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
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

type WorkingHours = {
  weekdays: { open: string; close: string } | null
  saturday: { open: string; close: string } | null
  sunday: { open: string; close: string } | null
}

type Coordinates = {
  lat: number | string
  lng: number | string
}

type Branch = {
  id: string
  name_ka: string
  name_en: string | null
  address_ka: string
  address_en: string | null
  phone: string | null
  working_hours: string | null
  delivery_info_ka: string | null
  delivery_info_en: string | null
  coordinates: string | null
  is_active: boolean
  sort_order: number
}

type BranchFormData = {
  name_ka: string
  name_en: string
  address_ka: string
  address_en: string
  phone: string
  working_hours: WorkingHours
  delivery_info_ka: string
  delivery_info_en: string
  coordinates: Coordinates
  is_active: boolean
  sort_order: number
}

const defaultWorkingHours: WorkingHours = {
  weekdays: { open: "09:00", close: "20:00" },
  saturday: { open: "10:00", close: "18:00" },
  sunday: null,
}

const emptyForm: BranchFormData = {
  name_ka: "",
  name_en: "",
  address_ka: "",
  address_en: "",
  phone: "",
  working_hours: defaultWorkingHours,
  delivery_info_ka: "",
  delivery_info_en: "",
  coordinates: { lat: "", lng: "" },
  is_active: true,
  sort_order: 0,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border-base, #e5e5e5)",
  fontSize: 14,
  background: "var(--bg-field, #fff)",
}

const halfInputWrap: React.CSSProperties = {
  display: "flex",
  gap: 12,
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

// --- Working Hours Editor ---
function WorkingHoursEditor({
  value,
  onChange,
}: {
  value: WorkingHours
  onChange: (wh: WorkingHours) => void
}) {
  const days = [
    { key: "weekdays" as const, label: "Mon–Fri" },
    { key: "saturday" as const, label: "Saturday" },
    { key: "sunday" as const, label: "Sunday" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Text size="small" weight="plus">
        Working Hours
      </Text>
      {days.map(({ key, label }) => {
        const slot = value[key]
        const isClosed = slot === null

        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              size="small"
              style={{ width: 70, flexShrink: 0 }}
            >
              {label}
            </Text>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <input
                type="checkbox"
                checked={isClosed}
                onChange={() => {
                  onChange({
                    ...value,
                    [key]: isClosed
                      ? { open: "09:00", close: "18:00" }
                      : null,
                  })
                }}
              />
              <Text size="xsmall">Closed</Text>
            </label>
            {!isClosed && (
              <>
                <input
                  type="time"
                  value={slot.open}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [key]: { ...slot, open: e.target.value },
                    })
                  }
                  style={{ ...inputStyle, width: 120 }}
                />
                <Text size="xsmall">–</Text>
                <input
                  type="time"
                  value={slot.close}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [key]: { ...slot, close: e.target.value },
                    })
                  }
                  style={{ ...inputStyle, width: 120 }}
                />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Form Modal ---
function BranchFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: BranchFormData) => Promise<void>
  initialData: BranchFormData
  isEditing: boolean
}) {
  const [form, setForm] = useState<BranchFormData>(initialData)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialData)
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_ka.trim()) {
      toast.error("Georgian name is required")
      return
    }
    if (!form.address_ka.trim()) {
      toast.error("Georgian address is required")
      return
    }
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
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
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level="h2" style={{ marginBottom: 16 }}>
          {isEditing ? "Edit Branch" : "Add Branch"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Names */}
            <div style={halfInputWrap}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Name (Georgian) *
                </Text>
                <input
                  type="text"
                  value={form.name_ka}
                  onChange={(e) =>
                    setForm({ ...form, name_ka: e.target.value })
                  }
                  placeholder="ფილიალის სახელი"
                  required
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Name (English)
                </Text>
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) =>
                    setForm({ ...form, name_en: e.target.value })
                  }
                  placeholder="Branch name"
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Addresses */}
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Address (Georgian) *
              </Text>
              <input
                type="text"
                value={form.address_ka}
                onChange={(e) =>
                  setForm({ ...form, address_ka: e.target.value })
                }
                placeholder="მისამართი"
                required
                style={inputStyle}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Address (English)
              </Text>
              <input
                type="text"
                value={form.address_en}
                onChange={(e) =>
                  setForm({ ...form, address_en: e.target.value })
                }
                placeholder="Address"
                style={inputStyle}
              />
            </label>

            {/* Phone */}
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Phone
              </Text>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="+995 XXX XXX XXX"
                style={inputStyle}
              />
            </label>

            {/* Working Hours */}
            <WorkingHoursEditor
              value={form.working_hours}
              onChange={(wh) => setForm({ ...form, working_hours: wh })}
            />

            {/* Delivery Info */}
            <div style={halfInputWrap}>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Delivery Info (KA)
                </Text>
                <input
                  type="text"
                  value={form.delivery_info_ka}
                  onChange={(e) =>
                    setForm({ ...form, delivery_info_ka: e.target.value })
                  }
                  placeholder="შეკვეთიდან 2 საათში"
                  style={inputStyle}
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                  Delivery Info (EN)
                </Text>
                <input
                  type="text"
                  value={form.delivery_info_en}
                  onChange={(e) =>
                    setForm({ ...form, delivery_info_en: e.target.value })
                  }
                  placeholder="Within 2 hours"
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Coordinates */}
            <div>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Coordinates
              </Text>
              <div style={halfInputWrap}>
                <label style={{ flex: 1 }}>
                  <Text size="xsmall" style={{ marginBottom: 2, color: "var(--fg-subtle)" }}>
                    Latitude
                  </Text>
                  <input
                    type="number"
                    step="any"
                    value={form.coordinates.lat}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        coordinates: { ...form.coordinates, lat: e.target.value },
                      })
                    }
                    placeholder="41.7151"
                    style={inputStyle}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  <Text size="xsmall" style={{ marginBottom: 2, color: "var(--fg-subtle)" }}>
                    Longitude
                  </Text>
                  <input
                    type="number"
                    step="any"
                    value={form.coordinates.lng}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        coordinates: { ...form.coordinates, lng: e.target.value },
                      })
                    }
                    placeholder="44.8271"
                    style={inputStyle}
                  />
                </label>
              </div>
            </div>

            {/* Sort Order & Active */}
            <div style={halfInputWrap}>
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
                  flex: 1,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  cursor: "pointer",
                  paddingBottom: 10,
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
              {isEditing ? "Save Changes" : "Create Branch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Helpers ---
function formatWorkingHours(raw: string | null): string {
  const wh = parseJson<WorkingHours | null>(raw, null)
  if (!wh) return "—"

  const parts: string[] = []
  if (wh.weekdays) parts.push(`Mon–Fri ${wh.weekdays.open}–${wh.weekdays.close}`)
  if (wh.saturday) parts.push(`Sat ${wh.saturday.open}–${wh.saturday.close}`)
  if (wh.sunday) parts.push(`Sun ${wh.sunday.open}–${wh.sunday.close}`)
  else parts.push("Sun: Closed")

  return parts.join(", ")
}

// --- Main Page ---
const BranchesPage = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const prompt = usePrompt()

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch("/admin/branches?limit=100", {
        credentials: "include",
      })
      const data = await res.json()
      const sorted = (data.branches || []).sort(
        (a: Branch, b: Branch) => a.sort_order - b.sort_order
      )
      setBranches(sorted)
    } catch {
      toast.error("Failed to load branches")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const handleCreate = () => {
    setEditingBranch(null)
    setModalOpen(true)
  }

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setModalOpen(true)
  }

  const serializeForm = (formData: BranchFormData): Record<string, unknown> => {
    const hasCoords =
      formData.coordinates.lat !== "" && formData.coordinates.lng !== ""

    return {
      name_ka: formData.name_ka,
      name_en: formData.name_en || null,
      address_ka: formData.address_ka,
      address_en: formData.address_en || null,
      phone: formData.phone || null,
      working_hours: JSON.stringify(formData.working_hours),
      delivery_info_ka: formData.delivery_info_ka || null,
      delivery_info_en: formData.delivery_info_en || null,
      coordinates: hasCoords
        ? JSON.stringify({
            lat: Number(formData.coordinates.lat),
            lng: Number(formData.coordinates.lng),
          })
        : null,
      is_active: formData.is_active,
      sort_order: formData.sort_order,
    }
  }

  const handleSave = async (formData: BranchFormData) => {
    try {
      const body = serializeForm(formData)

      if (editingBranch) {
        const res = await fetch(`/admin/branches/${editingBranch.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Branch updated")
      } else {
        const res = await fetch("/admin/branches", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Branch created")
      }
      setModalOpen(false)
      await fetchBranches()
    } catch {
      toast.error(
        editingBranch
          ? "Failed to update branch"
          : "Failed to create branch"
      )
    }
  }

  const handleDelete = async (branch: Branch) => {
    const confirmed = await prompt({
      title: "Delete Branch",
      description: `Are you sure you want to delete "${branch.name_ka}"? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/branches/${branch.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Branch deleted")
      await fetchBranches()
    } catch {
      toast.error("Failed to delete branch")
    }
  }

  const handleToggleActive = async (branch: Branch) => {
    try {
      const res = await fetch(`/admin/branches/${branch.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !branch.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(
        branch.is_active ? "Branch deactivated" : "Branch activated"
      )
      await fetchBranches()
    } catch {
      toast.error("Failed to update branch status")
    }
  }

  const formInitialData: BranchFormData = editingBranch
    ? {
        name_ka: editingBranch.name_ka,
        name_en: editingBranch.name_en || "",
        address_ka: editingBranch.address_ka,
        address_en: editingBranch.address_en || "",
        phone: editingBranch.phone || "",
        working_hours: parseJson<WorkingHours>(
          editingBranch.working_hours,
          defaultWorkingHours
        ),
        delivery_info_ka: editingBranch.delivery_info_ka || "",
        delivery_info_en: editingBranch.delivery_info_en || "",
        coordinates: parseJson<Coordinates>(
          editingBranch.coordinates,
          { lat: "", lng: "" }
        ),
        is_active: editingBranch.is_active,
        sort_order: editingBranch.sort_order,
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
          <Heading level="h1">Branches</Heading>
          <Text size="small" style={{ color: "var(--fg-subtle)", marginTop: 4 }}>
            Manage store branches and pickup locations
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Branch
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : branches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            No branches yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Branch
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Name (KA)</Table.HeaderCell>
              <Table.HeaderCell>Address (KA)</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Working Hours</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {branches.map((branch) => (
              <Table.Row key={branch.id}>
                <Table.Cell>{branch.sort_order}</Table.Cell>
                <Table.Cell>
                  <Text weight="plus">{branch.name_ka}</Text>
                  {branch.name_en && (
                    <Text size="xsmall" style={{ color: "var(--fg-subtle)" }}>
                      {branch.name_en}
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{branch.address_ka}</Text>
                </Table.Cell>
                <Table.Cell>{branch.phone || "—"}</Table.Cell>
                <Table.Cell>
                  <Text size="xsmall">
                    {formatWorkingHours(branch.working_hours)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={branch.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(branch)}
                  >
                    {branch.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleEdit(branch)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(branch)}
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

      <BranchFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingBranch}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Branches",
  icon: BuildingStorefront,
})

export default BranchesPage
