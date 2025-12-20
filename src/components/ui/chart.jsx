import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

// Chart container component
const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartContext.Provider value={{ config, chartId }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </ChartContext.Provider>
      </div>
    )
  }
)
ChartContainer.displayName = "Chart"

// Chart context
const ChartContext = React.createContext({
  config: {},
  chartId: undefined,
})

// Chart tooltip
const ChartTooltip = RechartsPrimitive.Tooltip

// Chart tooltip content
const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      label,
      indicator = "dot",
      nameKey,
      labelKey,
      labelFormatter,
      valueFormatter,
      className,
    },
    ref
  ) => {
    const { config } = React.useContext(ChartContext)

    const tooltipLabel = React.useMemo(() => {
      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      if (typeof label !== "string" && typeof label !== "number") {
        return null
      }

      if (labelKey && payload?.[0]?.payload?.[labelKey] !== undefined) {
        return payload[0].payload[labelKey]
      }

      return label
    }, [label, labelFormatter, labelKey, payload])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "line"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-md",
          className
        )}
      >
        {!nestLabel ? (
          <div className="font-medium text-gray-900">{tooltipLabel}</div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${item.dataKey || item.name || index}`
            const itemConfig = config?.[item.dataKey || ""] ?? {}
            const indicatorColor = item.payload?.fill || item.color || itemConfig.fill || `hsl(var(--chart-${(index % 5) + 1}))`

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-gray-700",
                  nestLabel ? "items-center" : "items-start"
                )}
              >
                {indicator === "dot" && (
                  <div
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: indicatorColor,
                    }}
                  />
                )}
                {indicator === "line" && (
                  <div
                    className="h-0.5 w-4 shrink-0 self-center"
                    style={{
                      backgroundColor: indicatorColor,
                    }}
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-center" : "items-start gap-2"
                  )}
                >
                  <div className="grid gap-1.5">
                    {!nestLabel ? (
                      <span className="text-gray-600">
                        {itemConfig.label || item.name || item.dataKey}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {tooltipLabel}
                      </span>
                    )}
                  </div>
                  {item.value !== undefined && item.value !== null && (
                    <span className="font-mono font-medium tabular-nums text-gray-900">
                      {valueFormatter
                        ? valueFormatter(item.value, item.name || item.dataKey, item.dataKey)
                        : item.value}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// Chart legend
const ChartLegend = React.forwardRef(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
      ...props
    },
    ref
  ) => {
    const { config } = React.useContext(ChartContext)

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4 flex-wrap",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...props}
      >
        {payload.map((item, index) => {
          const key = `${item.dataKey || item.value || index}`
          const itemConfig = config?.[item.dataKey || ""] ?? {}
          const indicatorColor = item.color || itemConfig.fill || item.stroke || `hsl(var(--chart-${(index % 5) + 1}))`

          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-gray-700"
              )}
            >
              {!hideIcon && (
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: indicatorColor,
                  }}
                />
              )}
              <span className="text-xs text-gray-600">
                {itemConfig.label || item.name || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartContext,
}

