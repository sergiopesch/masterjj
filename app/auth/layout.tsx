export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md p-4 space-y-4">
        {children}
      </div>
    </div>
  )
}
