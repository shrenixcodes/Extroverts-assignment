interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-2" aria-hidden={false}>
      <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentStep} aria-label="Signup progress">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isComplete = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isFilled = isComplete || isCurrent
          return (
            <div key={step} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className={`h-full rounded-full bg-white transition-all ease-out ${
                  isFilled ? 'w-full duration-500' : 'w-0 duration-300'
                }`}
              />
            </div>
          )
        })}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">
        Step {currentStep} of {steps.length} &middot; {steps[currentStep - 1]}
      </p>
    </div>
  )
}
