"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Plus, CheckCircle2, Circle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TaskManagerProps {
  tasks: Task[]
  onAddTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export function TaskManager({ tasks, onAddTask, onUpdateTask }: TaskManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    status: 'pending',
    priority: 'medium',
    date: ''
  })
  const { toast } = useToast()

  const handleAddTask = () => {
    if (!newTask.title || !newTask.date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      date: newTask.date,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority || 'medium'
    }

    onAddTask(task)
    setIsDialogOpen(false)
    setNewTask({
      status: 'pending',
      priority: 'medium',
      date: ''
    })

    toast({
      title: "Success",
      description: "Task added successfully",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateTask(task.id, {
                  status: task.status === 'completed' ? 'pending' : 'completed'
                })}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </Button>
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(task.date)} • <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateTask(task.id, { status: 'cancelled' })}
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 