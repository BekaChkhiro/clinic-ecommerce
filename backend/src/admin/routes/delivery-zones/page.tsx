import { defineRouteConfig } from "@medusajs/admin-sdk"
import { MapPin } from "@medusajs/icons"
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

type DeliveryZone = {
  id: string
  name_ka: string
  name_en: string | null
  fee: number
  is_active: boolean
  sort_order: number
}

type DeliveryZoneFormData = {
  name_ka: string
  name_en: string
  fee: number
  is_active: boolean
  sort_order: number
}

const emptyForm: DeliveryZoneFormData = {
  name_ka: "",
  name_en: "",
  fee: 0,
  is_active: true,
  sort_order: 0,
}

// --- Inline Form Modal ---
function DeliveryZoneFormModal({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: DeliveryZoneFormData) => Promise<void>
  initialData: DeliveryZoneFormData
  isEditing: boolean
}) {
  const [form, setForm] = useState<DeliveryZoneFormData>(initialData)
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
          maxWidth: 480,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level="h2" style={{ marginBottom: 16 }}>
          {isEditing ? "Edit Delivery Zone" : "Add Delivery Zone"}
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
                placeholder="მიწოდების ზონა"
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-base, #e5e5e5)",
                  fontSize: 14,
                  background: "var(--bg-field, #fff)",
                }}
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
                placeholder="Delivery zone name"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-base, #e5e5e5)",
                  fontSize: 14,
                  background: "var(--bg-field, #fff)",
                }}
              />
            </label>
            <label>
              <Text size="small" weight="plus" style={{ marginBottom: 4 }}>
                Fee (GEL)
              </Text>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.fee}
                onChange={(e) =>
                  setForm({ ...form, fee: parseFloat(e.target.value) || 0 })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-base, #e5e5e5)",
                  fontSize: 14,
                  background: "var(--bg-field, #fff)",
                }}
              />
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
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-base, #e5e5e5)",
                  fontSize: 14,
                  background: "var(--bg-field, #fff)",
                }}
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
              {isEditing ? "Save Changes" : "Create Zone"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---
const DeliveryZonesPage = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null)
  const prompt = usePrompt()

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch("/admin/delivery-zones?limit=100", {
        credentials: "include",
      })
      const data = await res.json()
      const sorted = (data.delivery_zones || []).sort(
        (a: DeliveryZone, b: DeliveryZone) => a.sort_order - b.sort_order
      )
      setZones(sorted)
    } catch {
      toast.error("Failed to load delivery zones")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchZones()
  }, [fetchZones])

  const handleCreate = () => {
    setEditingZone(null)
    setModalOpen(true)
  }

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone)
    setModalOpen(true)
  }

  const handleSave = async (formData: DeliveryZoneFormData) => {
    try {
      if (editingZone) {
        const res = await fetch(
          `/admin/delivery-zones/${editingZone.id}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        )
        if (!res.ok) throw new Error("Update failed")
        toast.success("Delivery zone updated")
      } else {
        const res = await fetch("/admin/delivery-zones", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Delivery zone created")
      }
      setModalOpen(false)
      await fetchZones()
    } catch {
      toast.error(
        editingZone
          ? "Failed to update delivery zone"
          : "Failed to create delivery zone"
      )
    }
  }

  const handleDelete = async (zone: DeliveryZone) => {
    const confirmed = await prompt({
      title: "Delete Delivery Zone",
      description: `Are you sure you want to delete "${zone.name_ka}"? This action cannot be undone.`,
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/admin/delivery-zones/${zone.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Delivery zone deleted")
      await fetchZones()
    } catch {
      toast.error("Failed to delete delivery zone")
    }
  }

  const handleToggleActive = async (zone: DeliveryZone) => {
    try {
      const res = await fetch(`/admin/delivery-zones/${zone.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !zone.is_active }),
      })
      if (!res.ok) throw new Error("Toggle failed")
      toast.success(
        zone.is_active ? "Zone deactivated" : "Zone activated"
      )
      await fetchZones()
    } catch {
      toast.error("Failed to update zone status")
    }
  }

  const formInitialData: DeliveryZoneFormData = editingZone
    ? {
        name_ka: editingZone.name_ka,
        name_en: editingZone.name_en || "",
        fee: Number(editingZone.fee),
        is_active: editingZone.is_active,
        sort_order: editingZone.sort_order,
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
          <Heading level="h1">Delivery Zones</Heading>
          <Text size="small" style={{ color: "var(--fg-subtle)", marginTop: 4 }}>
            Manage delivery zones and their fees
          </Text>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Add Zone
        </Button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : zones.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          <Text style={{ color: "var(--fg-subtle)" }}>
            No delivery zones yet. Create your first one.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={handleCreate}>
              Add Zone
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Name (KA)</Table.HeaderCell>
              <Table.HeaderCell>Name (EN)</Table.HeaderCell>
              <Table.HeaderCell>Fee (GEL)</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {zones.map((zone) => (
              <Table.Row key={zone.id}>
                <Table.Cell>{zone.sort_order}</Table.Cell>
                <Table.Cell>
                  <Text weight="plus">{zone.name_ka}</Text>
                </Table.Cell>
                <Table.Cell>{zone.name_en || "—"}</Table.Cell>
                <Table.Cell>
                  {Number(zone.fee).toFixed(2)} ₾
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={zone.is_active ? "green" : "grey"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleActive(zone)}
                  >
                    {zone.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleEdit(zone)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(zone)}
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

      <DeliveryZoneFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formInitialData}
        isEditing={!!editingZone}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Delivery Zones",
  icon: MapPin,
})

export default DeliveryZonesPage
