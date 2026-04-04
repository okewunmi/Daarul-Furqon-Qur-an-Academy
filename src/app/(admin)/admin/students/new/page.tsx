// page.tsx
import { Suspense } from 'react'
import NewStudentPage from './NewStudentPage' // rename your current file to this

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    }>
      <NewStudentPage />
    </Suspense>
  )
}