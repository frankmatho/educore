export const initStudents = [
  { id: 'STU001', name: 'Amara Osei',      age: 15, class: 'Form 3A', gender: 'Female', email: 'amara@school.edu',   status: 'Active'   },
  { id: 'STU002', name: 'Brian Kamau',     age: 16, class: 'Form 4B', gender: 'Male',   email: 'brian@school.edu',   status: 'Active'   },
  { id: 'STU003', name: 'Cynthia Mwangi',  age: 14, class: 'Form 2A', gender: 'Female', email: 'cynthia@school.edu', status: 'Active'   },
  { id: 'STU004', name: 'David Otieno',    age: 17, class: 'Form 4B', gender: 'Male',   email: 'david@school.edu',   status: 'Inactive' },
  { id: 'STU005', name: 'Esther Njeri',    age: 15, class: 'Form 3A', gender: 'Female', email: 'esther@school.edu',  status: 'Active'   },
]

export const initTeachers = [
  { id: 'TCH001', name: 'Mr. Samuel Kariuki', subject: 'Mathematics', classes: 'Form 3A, Form 4B', email: 's.kariuki@school.edu', status: 'Active'   },
  { id: 'TCH002', name: 'Ms. Grace Akinyi',   subject: 'English',     classes: 'Form 2A, Form 3A', email: 'g.akinyi@school.edu',  status: 'Active'   },
  { id: 'TCH003', name: 'Dr. Peter Wangari',  subject: 'Biology',     classes: 'Form 4B',          email: 'p.wangari@school.edu', status: 'Active'   },
  { id: 'TCH004', name: 'Mrs. Faith Mutua',   subject: 'History',     classes: 'Form 2A',          email: 'f.mutua@school.edu',   status: 'On Leave' },
]

export const initClasses = [
  { id: 'CLS001', name: 'Form 2A', subject: 'English',     teacher: 'Ms. Grace Akinyi',   students: 28, room: 'Room 12', time: 'Mon–Fri 8:00–9:00 AM'   },
  { id: 'CLS002', name: 'Form 3A', subject: 'Mathematics', teacher: 'Mr. Samuel Kariuki', students: 32, room: 'Room 7',  time: 'Mon–Fri 9:00–10:00 AM'  },
  { id: 'CLS003', name: 'Form 4B', subject: 'Biology',     teacher: 'Dr. Peter Wangari',  students: 30, room: 'Lab 2',   time: 'Mon–Fri 10:00–11:00 AM' },
  { id: 'CLS004', name: 'Form 2A', subject: 'History',     teacher: 'Mrs. Faith Mutua',   students: 28, room: 'Room 15', time: 'Tue/Thu 2:00–3:00 PM'   },
]

export const initGrades = [
  { id: 'GRD001', student: 'Amara Osei',     studentId: 'STU001', subject: 'Mathematics', score: 88, grade: 'A', term: 'Term 1', teacher: 'Mr. Samuel Kariuki' },
  { id: 'GRD002', student: 'Amara Osei',     studentId: 'STU001', subject: 'English',     score: 75, grade: 'B', term: 'Term 1', teacher: 'Ms. Grace Akinyi'   },
  { id: 'GRD003', student: 'Brian Kamau',    studentId: 'STU002', subject: 'Biology',     score: 92, grade: 'A', term: 'Term 1', teacher: 'Dr. Peter Wangari'  },
  { id: 'GRD004', student: 'Cynthia Mwangi', studentId: 'STU003', subject: 'English',     score: 60, grade: 'C', term: 'Term 1', teacher: 'Ms. Grace Akinyi'   },
  { id: 'GRD005', student: 'David Otieno',   studentId: 'STU004', subject: 'Mathematics', score: 45, grade: 'D', term: 'Term 1', teacher: 'Mr. Samuel Kariuki' },
  { id: 'GRD006', student: 'Esther Njeri',   studentId: 'STU005', subject: 'Biology',     score: 81, grade: 'B', term: 'Term 1', teacher: 'Dr. Peter Wangari'  },
]