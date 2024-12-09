import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface ClassItem {
  id: number
  name: string
  time: string
  duration: string
  attendees: number
  maxCapacity: number
}

interface ClassListProps {
  classes: ClassItem[]
}

export function ClassList({ classes }: ClassListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Attendance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((class_) => (
          <TableRow key={class_.id}>
            <TableCell className="font-medium">{class_.name}</TableCell>
            <TableCell>{class_.time}</TableCell>
            <TableCell>{class_.duration}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {class_.attendees}/{class_.maxCapacity}
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                Take Attendance
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}