import React, { useCallback, useEffect, useRef, useState } from 'react'

interface VisibleRange {
  startIndex: number
  endIndex: number
  offsetPx: number
}

interface UseVisibleRangeOptions {
  totalColumns: number
  columnWidthPx: number
  leadingOffsetPx?: number
}

export function useVisibleRange({
  totalColumns,
  columnWidthPx,
  leadingOffsetPx = 0,
}: UseVisibleRangeOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [containerWidth, setContainerWidth] = useState(
    leadingOffsetPx + totalColumns * columnWidthPx
  )

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const updateWidth = () => {
      setContainerWidth(node.clientWidth)
    }

    updateWidth()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft)
  }, [])

  const gridViewportWidth = Math.max(containerWidth - leadingOffsetPx, columnWidthPx)
  const visibleColumnCount = Math.max(
    1,
    Math.min(totalColumns, Math.ceil(gridViewportWidth / columnWidthPx))
  )
  const maxStartIndex = Math.max(0, totalColumns - visibleColumnCount)
  const startIndex = Math.min(maxStartIndex, Math.floor(scrollLeft / columnWidthPx))

  const visibleRange: VisibleRange = {
    startIndex,
    endIndex: Math.min(totalColumns - 1, startIndex + visibleColumnCount - 1),
    offsetPx: scrollLeft % columnWidthPx,
  }

  return { containerRef, visibleRange, handleScroll, scrollLeft }
}
