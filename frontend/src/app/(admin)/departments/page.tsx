'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DEPARTMENTS } from '@/types/departments'
import { Plus, Building2, Trash2, AlertTriangle, Search } from 'lucide-react'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<string[]>([...DEPARTMENTS])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDept, setNewDept] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = departments.filter(d =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    const trimmed = newDept.trim().toUpperCase()
    if (!trimmed) return
    if (departments.includes(trimmed)) {
      alert('Department already exists')
      return
    }
    setDepartments(prev => [...prev, trimmed])
    setNewDept('')
    setIsAddOpen(false)
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    setDepartments(prev => prev.filter(d => d !== confirmDelete))
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-6">

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Remove Department?</h3>
                <p className="text-sm text-muted-foreground">This will remove it from the list.</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-6">
              Are you sure you want to remove <span className="font-medium">{confirmDelete}</span>?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Departments</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Manage company departments</p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Department Name</Label>
                <Input
                  placeholder="e.g. LOGISTICS DEPARTMENT"
                  className="mt-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90">
                Add Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="bg-card border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Departments Table */}
      <Card className="bg-card border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 w-16">#</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Department Name</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, index) => (
                <tr
                  key={dept}
                  className="border-b border-border last:border-b-0 hover:bg-secondary/10 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground">{dept}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-transparent! rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setConfirmDelete(dept)}
                      title="Remove department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-border bg-secondary/10">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {departments.length} department{departments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card>
    </div>
  )
}
