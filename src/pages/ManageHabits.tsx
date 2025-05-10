
import React, { useState } from "react";
import { useHabits } from "@/contexts/HabitContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const ManageHabits = () => {
  const { habits, addHabit, deleteHabit, updateHabit } = useHabits();
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabit, setEditingHabit] = useState<null | {
    id: string;
    name: string;
    goal: number;
  }>(null);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName("");
      toast({
        title: "Habit Added",
        description: `${newHabitName} has been added to your habits.`,
      });
    }
  };

  const handleOpenEdit = (habit: { id: string; name: string; goal: number }) => {
    setEditingHabit({
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
    });
  };

  const handleSaveEdit = () => {
    if (editingHabit) {
      updateHabit(
        editingHabit.id,
        editingHabit.name,
        editingHabit.goal
      );
      setEditingHabit(null);
      toast({
        title: "Habit Updated",
        description: "Your habit has been updated successfully.",
      });
    }
  };

  const handleDeleteHabit = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteHabit(id);
      toast({
        title: "Habit Deleted",
        description: `${name} has been removed from your habits.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Habits</h1>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHabit} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter habit name..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={!newHabitName.trim()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Habits</h2>
        {habits.length === 0 ? (
          <p className="text-muted-foreground">You don't have any habits yet. Add one above to get started!</p>
        ) : (
          habits.map((habit) => (
            <Card key={habit.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{habit.name}</h3>
                    <p className="text-muted-foreground">Goal: {habit.goal} per day</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(habit)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHabit(habit.id, habit.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={editingHabit !== null} onOpenChange={(open) => !open && setEditingHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Make changes to your habit below.
            </DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Habit Name
                </label>
                <Input
                  id="name"
                  value={editingHabit.name}
                  onChange={(e) =>
                    setEditingHabit({ ...editingHabit, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="goal" className="text-sm font-medium">
                  Daily Goal
                </label>
                <Input
                  id="goal"
                  type="number"
                  min="1"
                  value={editingHabit.goal}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      goal: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHabit(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageHabits;
