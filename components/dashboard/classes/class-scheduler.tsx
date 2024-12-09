"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClassSchedulerProps {
  onSchedule?: (data: {
    date: Date
    type: string
    time: string
    duration: string
  }) => void
}

export function ClassScheduler({ onSchedule }: ClassSchedulerProps) {
  const [date, setDate] = useState<Date>()
  const [type, setType] = useState<string>("")
  const [time, setTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Input
              type="date"
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Class Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select class type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fundamentals">Fundamentals</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="competition">Competition Prep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Time</Label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="1.5h">1.5 hours</SelectItem>
            <SelectItem value="2h">2 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        onClick={() => {
          if (date && type && time && duration && onSchedule) {
            onSchedule({ date, type, time, duration })
          }
        }}
      >
        Schedule Class
      </Button>
    </div>
  )
}