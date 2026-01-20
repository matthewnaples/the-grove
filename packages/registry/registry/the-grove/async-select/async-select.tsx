"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/registry/the-grove/ui/select"

/**
 * AsyncSelect - A select component that handles async state updates (e.g., Convex mutations)
 *
 * ## Data Flow Pattern
 *
 * This is a **controlled component** where state is external (e.g., Convex DB), not internal:
 *
 * 1. **Initial Render**: `value` prop displays current external state (from DB)
 * 2. **User Selection**: User picks a new value from dropdown
 * 3. **Optimistic UI**: Immediately shows `pendingValue` while async action runs
 * 4. **Async Action**: Calls `onAsyncChange` (e.g., Convex mutation to update DB)
 * 5. **DB Updates**: External state source updates (e.g., Convex backend)
 * 6. **Reactive Update**: Parent component receives new value via reactive query
 * 7. **Re-render**: Component receives updated `value` prop from parent
 * 8. **Cleanup**: Clears loading state and `pendingValue`
 *
 * ## Example Usage with Convex
 *
 * ```tsx
 * const tasks = useQuery(api.tasks.get)  // Fetch from Convex
 * const updateTask = useMutation(api.tasks.update)
 *
 * const task = tasks?.find(t => t.id === 1)
 *
 * const handleChange = async (newValue: string) => {
 *     await updateTask({ taskId: task._id, field: newValue })  // Updates DB
 * }
 *
 * <AsyncSelect
 *     value={task.field}  // Convex DB value (single source of truth)
 *     onAsyncChange={handleChange}  // Async mutation
 *     placeholder="Select option"
 * >
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 * </AsyncSelect>
 * ```
 *
 * ## Key Features
 * - **Optimistic UI**: Shows selected value immediately while DB updates
 * - **Spinner Delay**: Only shows loading spinner after delay (default 250ms) to avoid flicker
 * - **Error Handling**: Reverts to previous value on failure
 * - **Single Source of Truth**: External state (DB) always wins, component state is temporary
 * - **Prevents Concurrent Changes**: Disables select while async action is in progress
 */
interface AsyncSelectProps {
    value: string
    onAsyncChange: (newValue: string) => Promise<void>
    children: React.ReactNode
    placeholder?: string
    disabled?: boolean
    className?: string
    triggerClassName?: string
    size?: "sm" | "default"
    /** Delay in ms before showing spinner (default: 250) */
    spinnerDelay?: number
}

function AsyncSelect({
    value,
    onAsyncChange,
    children,
    placeholder,
    disabled = false,
    className,
    triggerClassName,
    size = "default",
    spinnerDelay = 250,
}: AsyncSelectProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [showSpinner, setShowSpinner] = React.useState(false)
    const [pendingValue, setPendingValue] = React.useState<string | null>(null)
    const spinnerTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Convert empty string to undefined so Radix Select shows placeholder
    const normalizedValue = value === "" ? undefined : value
    const displayValue = pendingValue ?? normalizedValue

    const handleValueChange = async (newValue: string) => {
        if (newValue === value || newValue === normalizedValue || isLoading) return

        // Disable immediately
        setIsLoading(true)
        setPendingValue(newValue)

        // Only show spinner after delay
        spinnerTimeoutRef.current = setTimeout(() => {
            setShowSpinner(true)
        }, spinnerDelay)

        try {
            await onAsyncChange(newValue)
            // Success - the parent should update the value prop
        } catch (error) {
            // Revert to previous value on failure
            console.error("AsyncSelect: Failed to update value", error)
        } finally {
            // Clear the timeout if action completed before delay
            if (spinnerTimeoutRef.current) {
                clearTimeout(spinnerTimeoutRef.current)
                spinnerTimeoutRef.current = null
            }
            setIsLoading(false)
            setShowSpinner(false)
            setPendingValue(null)
        }
    }

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (spinnerTimeoutRef.current) {
                clearTimeout(spinnerTimeoutRef.current)
            }
        }
    }, [])

    return (
        <Select
            value={displayValue}
            onValueChange={handleValueChange}
            disabled={disabled || isLoading}
        >
            <div className={cn("relative", className)}>
                <SelectTrigger
                    size={size}
                    className={cn(
                        isLoading && "opacity-70",
                        triggerClassName
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                {showSpinner && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/50">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
            <SelectContent>
                {children}
            </SelectContent>
        </Select>
    )
}

export { AsyncSelect }
export type { AsyncSelectProps }

