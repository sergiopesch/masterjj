export default function AuthCallbackLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-xl font-semibold">Verifying your login...</h2>
        <p className="text-muted-foreground">Please wait while we secure your session.</p>
      </div>
    </div>
  )
}
