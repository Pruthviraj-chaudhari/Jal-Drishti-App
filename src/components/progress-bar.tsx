import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <p className="text-center text-sm text-muted-foreground mt-1">{progress}% uploaded</p>
    </div>
  )
}

