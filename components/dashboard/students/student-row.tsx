"use client"

import { Award } from "lucide-react" // Changed from Belt to Award since Belt isn't available in lucide-react
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

interface StudentRowProps {
  student: {
    id: number
    name: string
    belt: string
    stripes: number
    attendance: string
    lastClass: string
    progress: string
  }
  onViewDetails: (id: number) => void
}

export function StudentRow({ student, onViewDetails }: StudentRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          {student.belt} ({student.stripes} stripes)
        </div>
      </TableCell>
      <TableCell>{student.attendance}</TableCell>
      <TableCell>{student.lastClass}</TableCell>
      <TableCell>{student.progress}</TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewDetails(student.id)}
        >
          View Details
        </Button>
      </TableCell>
    </TableRow>
  )
}