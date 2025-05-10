import * as React from "react";
import { useHabits } from "@/contexts/HabitContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit2, Trash2, RotateCcw, Trophy, Droplet, Activity, Book, Flame, Sprout, Moon, Utensils, GraduationCap, Brush, Footprints } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import CryptoJS from "crypto-js";

const ManageHabits = () => {
  const { habits, addHabit, deleteHabit, updateHabit, resetHabitCount, resetAllStreaks, updateHabitReminder } = useHabits();
  const { user, logout, signup } = useUser();
  const [newHabitName, setNewHabitName] = React.useState("");
  const [newHabitIcon, setNewHabitIcon] = React.useState("droplet");
  const [editingHabit, setEditingHabit] = React.useState<null | {
    id: string;
    name: string;
    goal: number;
    unit: string;
  }>(null);
  const [importError, setImportError] = React.useState("");
  const [showImportAuth, setShowImportAuth] = React.useState(false);
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [importUsername, setImportUsername] = React.useState("");
  const [importPin, setImportPin] = React.useState("");
  const [changeUsername, setChangeUsername] = React.useState(user?.username || "");
  const [changePin, setChangePin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [changeMsg, setChangeMsg] = React.useState("");

  const unitOptions = [
    { value: "times", label: "Times" },
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "km", label: "Kilometers" },
    { value: "miles", label: "Miles" },
    { value: "steps", label: "Steps" },
    { value: "glasses", label: "Glasses" },
    { value: "liters", label: "Liters" },
    { value: "pages", label: "Pages" },
    { value: "sessions", label: "Sessions" },
    { value: "calories", label: "Calories" },
  ];

  const templateIcons = [
    { value: "droplet", label: "Water", icon: <Droplet className="h-6 w-6" /> },
    { value: "activity", label: "Exercise", icon: <Activity className="h-6 w-6" /> },
    { value: "book", label: "Read", icon: <Book className="h-6 w-6" /> },
    { value: "flame", label: "Run", icon: <Flame className="h-6 w-6" /> },
    { value: "sprout", label: "Meditate", icon: <Sprout className="h-6 w-6" /> },
    { value: "moon", label: "Sleep", icon: <Moon className="h-6 w-6" /> },
    { value: "utensils", label: "Eat", icon: <Utensils className="h-6 w-6" /> },
    { value: "graduation-cap", label: "Study", icon: <GraduationCap className="h-6 w-6" /> },
    { value: "brush", label: "Clean", icon: <Brush className="h-6 w-6" /> },
    { value: "footprints", label: "Walk", icon: <Footprints className="h-6 w-6" /> },
  ];

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitIcon);
      setNewHabitName("");
      setNewHabitIcon(templateIcons[0].value);
      toast({
        title: "Habit Added",
        description: `${newHabitName} has been added to your habits.`,
      });
    }
  };

  const handleOpenEdit = (habit: { id: string; name: string; goal: number; unit: string }) => {
    setEditingHabit({
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
      unit: habit.unit || "times"
    });
  };

  const handleSaveEdit = () => {
    if (editingHabit) {
      updateHabit(
        editingHabit.id,
        editingHabit.name,
        editingHabit.goal,
        editingHabit.unit
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

  const handleResetCount = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to reset the count for "${name}"?`)) {
      resetHabitCount(id);
      toast({
        title: "Count Reset",
        description: `The count for ${name} has been reset to 0.`,
      });
    }
  };

  const handleResetAllStreaks = () => {
    if (window.confirm("Are you sure you want to reset all streaks to zero? This action cannot be undone.")) {
      resetAllStreaks();
      toast({
        title: "All Streaks Reset",
        description: "All habit streaks have been reset to zero.",
        variant: "destructive",
      });
    }
  };

  function UserSettingsSection() {
    const { habits, resetAllStreaks } = useHabits();
    const { user, logout, signup } = useUser();
    const [importError, setImportError] = React.useState("");
    const [showImportAuth, setShowImportAuth] = React.useState(false);
    const [importFile, setImportFile] = React.useState<File | null>(null);
    const [importUsername, setImportUsername] = React.useState("");
    const [importPin, setImportPin] = React.useState("");
    const [changeUsername, setChangeUsername] = React.useState(user?.username || "");
    const [changePin, setChangePin] = React.useState("");
    const [confirmPin, setConfirmPin] = React.useState("");
    const [changeMsg, setChangeMsg] = React.useState("");

    // Export habits log as encrypted JSON
    const handleExport = () => {
      const data = JSON.stringify(habits, null, 2);
      const pin = localStorage.getItem("streaknest_pin") || "";
      const encrypted = CryptoJS.AES.encrypt(data, pin).toString();
      const blob = new Blob([encrypted], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `streaknest-habits-log-${new Date().toISOString().slice(0, 10)}.streaknest`;
      a.click();
      URL.revokeObjectURL(url);
    };

    // Import habits log from encrypted file
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImportError("");
      const file = e.target.files?.[0];
      if (!file) return;
      setImportFile(file);
      setShowImportAuth(true);
    };

    // Decrypt and import after auth
    const handleImportAuth = () => {
      setImportError("");
      if (!importFile) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const encrypted = event.target?.result as string;
          const decrypted = CryptoJS.AES.decrypt(encrypted, importPin).toString(CryptoJS.enc.Utf8);
          if (!decrypted) throw new Error("Wrong PIN or corrupt file");
          const imported = JSON.parse(decrypted);
          if (!Array.isArray(imported)) throw new Error("Invalid format");
          for (const habit of imported) {
            if (!habit.id || !habit.name || !Array.isArray(habit.trackingData)) throw new Error("Invalid habit format");
          }
          if (importUsername !== user?.username) throw new Error("Username does not match");
          localStorage.setItem("habits", JSON.stringify(imported));
          window.location.reload();
        } catch (err: any) {
          setImportError("Invalid file, wrong PIN, or username. Please try again.");
        }
      };
      reader.readAsText(importFile);
    };

    // Change username and PIN
    const handleChangeUser = (e: React.FormEvent) => {
      e.preventDefault();
      setChangeMsg("");
      if (changePin && (!/^[0-9]{4,6}$/.test(changePin) || changePin !== confirmPin)) {
        setChangeMsg("PINs must match and be 4-6 digits");
        return;
      }
      if (!changeUsername) {
        setChangeMsg("Username cannot be empty");
        return;
      }
      signup(changeUsername, changePin || (localStorage.getItem("streaknest_pin") || ""));
      setChangeMsg("User info updated!");
    };

    return (
      <div className="mt-10 border-t pt-8">
        <div className="max-w-xl w-full mx-auto bg-white/80 dark:bg-card rounded-xl shadow p-4 sm:p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold mb-2 text-center sm:text-left text-primary">User Settings</h2>
          <form onSubmit={handleChangeUser} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                className="border border-primary/30 focus:border-primary rounded px-3 py-2 text-base flex-1 bg-background dark:bg-background/80 transition w-full"
                placeholder="Change Username"
                value={changeUsername}
                onChange={e => setChangeUsername(e.target.value)}
              />
              <input
                className="border border-primary/30 focus:border-primary rounded px-3 py-2 text-base flex-1 bg-background dark:bg-background/80 transition w-full"
                placeholder="New PIN (optional)"
                value={changePin}
                onChange={e => setChangePin(e.target.value.replace(/\D/g, ""))}
                type="password"
                maxLength={6}
                minLength={4}
              />
              <input
                className="border border-primary/30 focus:border-primary rounded px-3 py-2 text-base flex-1 bg-background dark:bg-background/80 transition w-full"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                type="password"
                maxLength={6}
                minLength={4}
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded py-2 font-semibold text-base mt-2 hover:brightness-110 transition w-full sm:w-auto">Update Username / PIN</button>
            {changeMsg && <div className="text-center text-sm mt-1 text-green-600">{changeMsg}</div>}
          </form>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <button
              onClick={handleExport}
              className="rounded px-4 py-2 font-semibold w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
            >
              Export Backup
            </button>
            <label
              className="rounded px-4 py-2 font-semibold w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition cursor-pointer text-center"
            >
              Import Backup
              <input
                type="file"
                accept=".streaknest,application/octet-stream"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Export your full habit log (encrypted with your PIN) or import a backup (requires correct username and PIN).</p>
          {importError && <div className="text-red-500 text-center mt-2 text-sm">{importError}</div>}
          {showImportAuth && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg flex flex-col gap-4 w-[90%] max-w-md mx-4">
                <h3 className="text-lg font-bold mb-2 text-primary text-center">Authenticate to Import</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    className="w-full border border-primary/30 focus:border-primary rounded px-3 py-2 text-base bg-background dark:bg-background/80 transition"
                    placeholder="Enter username"
                    value={importUsername}
                    onChange={e => setImportUsername(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">PIN</label>
                  <input
                    className="w-full border border-primary/30 focus:border-primary rounded px-3 py-2 text-base bg-background dark:bg-background/80 transition"
                    placeholder="Enter PIN"
                    value={importPin}
                    onChange={e => setImportPin(e.target.value.replace(/\D/g, ""))}
                    type="password"
                    maxLength={6}
                    minLength={4}
                  />
                </div>
                <div className="flex gap-4 mt-2 w-full">
                  <button 
                    onClick={handleImportAuth} 
                    className="flex-1 rounded py-2 font-semibold text-base bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
                  >
                    Import
                  </button>
                  <button 
                    onClick={() => setShowImportAuth(false)} 
                    className="flex-1 text-primary border border-primary rounded py-2 font-semibold text-base hover:bg-primary/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Log Out Button */}
          <button
            onClick={() => {
              // Remove all cookies
              document.cookie.split(';').forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
              });
              logout();
              window.location.href = '/login';
            }}
            className="mt-4 w-full rounded py-2 font-semibold text-base bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-white/70 backdrop-blur dark:bg-background rounded-xl overflow-x-hidden min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Manage Habits</h1>
        <Button
          onClick={handleResetAllStreaks}
          className="flex items-center gap-2 w-full sm:w-auto min-h-[44px] min-w-[44px] text-base sm:text-lg bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
        >
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
          Reset All Streaks
        </Button>
      </div>

      <Card className="bg-white/70 backdrop-blur dark:bg-card w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddHabit} className="flex flex-col gap-2 sm:gap-4 w-full">
            <Input
              type="text"
              placeholder="Enter habit name..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="min-h-[44px] text-base mb-2 sm:mb-0"
            />
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
              <div className="flex flex-row gap-2 flex-wrap justify-center flex-1">
                {templateIcons.map((icon) => (
                  <button
                    type="button"
                    key={icon.value}
                    className={`rounded-full p-1 border-2 transition-colors ${newHabitIcon === icon.value ? 'border-primary bg-primary/10' : 'border-muted'}`}
                    onClick={() => setNewHabitIcon(icon.value)}
                    aria-label={icon.label}
                  >
                    {icon.icon}
                  </button>
                ))}
              </div>
              <Button type="submit" disabled={!newHabitName.trim()} className="w-full sm:w-auto min-h-[44px] min-w-[44px] text-base sm:text-lg ml-0 sm:ml-2 mt-2 sm:mt-0">
                <PlusCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Add Habit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Your Habits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {habits.length === 0 ? (
          <p className="text-muted-foreground">You don't have any habits yet. Add one above to get started!</p>
        ) : (
          habits.map((habit) => (
            <Card key={habit.id} className="mb-4 bg-white/70 backdrop-blur dark:bg-card w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                  <div className="w-full sm:w-auto">
                    <h3 className="font-medium text-lg text-center sm:text-left">{habit.name}</h3>
                    <p className="text-muted-foreground text-center sm:text-left">
                      Goal: {habit.goal} {habit.unit || "times"} per day
                    </p>
                  </div>
                  <div className="flex flex-row flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(habit)}
                      className="min-h-[40px] min-w-[40px] bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCount(habit.id, habit.name)}
                      className="min-h-[40px] min-w-[40px] bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" /> Reset Count
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteHabit(habit.id, habit.name)}
                      className="min-h-[40px] min-w-[40px] bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
                {/* Reminder Controls */}
                <div className="flex items-center gap-2 mb-2 mt-4">
                  <Switch
                    checked={!!habit.reminderEnabled}
                    onCheckedChange={checked => updateHabitReminder(habit.id, { reminderEnabled: checked })}
                    id={`reminder-switch-${habit.id}`}
                    className={habit.reminderEnabled ? 'ring-2 ring-offset-2 ring-blue-500 ring-inset transition' : ''}
                  />
                  <label htmlFor={`reminder-switch-${habit.id}`} className="font-medium">Enable Reminders</label>
                </div>
                {habit.reminderEnabled && (
                  <div className="flex flex-wrap gap-4 items-center">
                    <div>
                      <label className="block text-sm mb-1">Start Time</label>
                      <Input
                        type="time"
                        value={habit.reminderStart || '07:00'}
                        onChange={e => updateHabitReminder(habit.id, { reminderStart: e.target.value })}
                        className="w-28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">End Time</label>
                      <Input
                        type="time"
                        value={habit.reminderEnd || '20:00'}
                        onChange={e => updateHabitReminder(habit.id, { reminderEnd: e.target.value })}
                        className="w-28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Interval</label>
                      <Select
                        value={String(habit.reminderInterval || 60)}
                        onValueChange={val => updateHabitReminder(habit.id, { reminderInterval: Number(val) })}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">Every hour</SelectItem>
                          <SelectItem value="120">Every 2 hours</SelectItem>
                          <SelectItem value="180">Every 3 hours</SelectItem>
                          <SelectItem value="240">Every 4 hours</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingHabit} onOpenChange={open => !open && setEditingHabit(null)}>
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 flex-1">
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
                <div className="space-y-2 flex-1">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Select
                    value={editingHabit.unit}
                    onValueChange={(value) => 
                      setEditingHabit({
                        ...editingHabit,
                        unit: value
                      })
                    }
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHabit(null)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-green-400 text-white border-0 shadow-lg hover:brightness-110 transition" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserSettingsSection />
    </div>
  );
};

export default ManageHabits;
