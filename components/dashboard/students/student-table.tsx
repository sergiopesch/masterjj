"use client"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StudentRow } from "./student-row"

interface Student {
  id: number
  name: string
  belt: string
  stripes: number
  attendance: string
  lastClass: string
  progress: string
}

interface StudentTableProps {
  students: Student[]
  onViewDetails: (studentId: number) => void
}

export function StudentTable({ students, onViewDetails }: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Belt</TableHead>
          <TableHead>Attendance</TableHead>
          <TableHead>Last Class</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <StudentRow 
            key={student.id} 
            student={student} 
            onViewDetails={onViewDetails}
          />
        ))}
      </TableBody>
    </Table>
  )
}