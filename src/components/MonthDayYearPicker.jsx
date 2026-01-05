import { useEffect, useRef, useState, useMemo, memo } from 'react';

const ITEM_HEIGHT = 40;
const ROWS = 5;
const LOOP_COPIES = 30; // Reduced from 50 to 30 for faster initialization

/**
 * A scroll-based date picker with Month, Day, Year order (US format)
 * Month and Day columns have infinite looping scroll
 */
function MonthDayYearPicker({
  itemHeight = ITEM_HEIGHT,
  visibleRows = ROWS,
  startYear = 2000,
  endYear = null,
  dateTimeFormatOptions = { month: 'long' },
  defaultYear = new Date().getFullYear(),
  defaultDay = new Date().getDate(),
  defaultMonth = new Date().getMonth(),
  highlightOverlayStyle,
  onDateChange,
  disabled = false,
}) {
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString('default', dateTimeFormatOptions)
      ),
    [dateTimeFormatOptions]
  );
  const yearRange = endYear ? endYear - startYear + 1 : 100;
  // Reverse years array to show newest to oldest
  const years = Array.from({ length: yearRange }, (_, i) => 
    endYear ? endYear - i : startYear + (yearRange - 1 - i)
  );

  // Create looping arrays for months and days
  const loopingMonths = useMemo(
    () => Array.from({ length: LOOP_COPIES }, () => months).flat(),
    [months]
  );

  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(defaultYear, defaultMonth + 1, 0).getDate()
  );

  // Sync state when default props change (e.g., when navigating back to this step)
  useEffect(() => {
    if (defaultYear !== selectedYear || defaultMonth !== selectedMonth || defaultDay !== selectedDay) {
      setSelectedYear(defaultYear);
      setSelectedMonth(defaultMonth);
      setSelectedDay(defaultDay);
      setDaysInMonth(new Date(defaultYear, defaultMonth + 1, 0).getDate());
      // Reset initialization flag so it re-initializes with new values
      isInitializedRef.current = false;
    }
  }, [defaultYear, defaultMonth, defaultDay]);

  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const isScrollingRef = useRef({ month: false, day: false });
  const isInitializedRef = useRef(false);
  const onDateChangeRef = useRef(onDateChange);
  const lastDateRef = useRef(null);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Update ref when onDateChange changes
  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  const rawRows = visibleRows ?? 5;
  const rows = rawRows % 2 === 0 ? rawRows + 1 : rawRows;

  const scrollToIndex = (ref, index) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Only call onDateChange after initialization and if date actually changed
    if (!isInitializedRef.current || disabled || !onDateChangeRef.current) {
      return;
    }

    // Validate the date before calling onDateChange
    const maxDay = getDaysInMonth(selectedMonth, selectedYear);
    const validDay = Math.min(selectedDay, maxDay);
    
    // Format date string directly from selected values (no Date object conversion to avoid timezone issues)
    const year = selectedYear;
    const month = String(selectedMonth + 1).padStart(2, '0');
    const day = String(validDay).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Compare with last date string using stored string value (not Date object)
    const lastDateStr = lastDateRef.current?._dateStr || '';
    
    // Only update if date actually changed
    if (dateStr !== lastDateStr) {
      // Create date object at noon local time to avoid timezone conversion issues
      const date = new Date(selectedYear, selectedMonth, validDay, 12, 0, 0);
      
      // Verify the date is valid
      if (!isNaN(date.getTime())) {
        // Store both the date object and the date string
        lastDateRef.current = date;
        lastDateRef.current._dateStr = dateStr; // Store the exact date string
        
        // Log selected date to console (using exact selected values)
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const formattedDate = `${monthNames[selectedMonth]} ${validDay}, ${selectedYear}`;
        console.log('📅 Selected Date:', {
          date: dateStr, // This is the exact date string from picker - matches what you selected
          formatted: formattedDate,
          day: validDay,
          month: selectedMonth + 1,
          monthName: monthNames[selectedMonth],
          year: selectedYear,
          // Show what was actually selected in picker (exact values)
          pickerSelection: {
            day: validDay,
            month: selectedMonth + 1,
            year: selectedYear
          },
          // Verify: show what the Date object represents (should match)
          dateObjectLocal: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        });
        
        // Call immediately for faster response (no requestAnimationFrame delay)
        // Pass both the date object and the exact date string to avoid timezone issues
        if (onDateChangeRef.current) {
          onDateChangeRef.current(date, dateStr);
        }
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, disabled]);

  // Optimized 3D effect update - only update visible items
  const update3DEffect = (ref) => {
    if (!ref.current) return;

    // Cancel any pending update
    if (ref.current._effectRafId) {
      cancelAnimationFrame(ref.current._effectRafId);
    }

    // Schedule 3D effect update
    ref.current._effectRafId = requestAnimationFrame(() => {
      if (!ref.current) return;

      const items = ref.current.children;
      const itemCount = items.length;
      const center =
        ref.current.scrollTop +
        itemHeight * Math.floor(rows / 2) +
        itemHeight / 2;

      // Only update items near the visible area for better performance
      const visibleRange = rows + 4; // Update a bit more than visible for smooth effect
      const startIndex = Math.max(0, Math.floor((center - itemHeight * visibleRange) / itemHeight));
      const endIndex = Math.min(itemCount - 1, Math.floor((center + itemHeight * visibleRange) / itemHeight));

      for (let i = startIndex; i <= endIndex; i++) {
        const item = items[i];
        if (!item) continue;

        const itemCenter = item.offsetTop + itemHeight / 2;
        const distance = itemCenter - center;
        const indexOffset = distance / itemHeight;
        const shouldOffset = Math.abs(indexOffset) >= 0.5;
        const angle = indexOffset * 20;
        const rotateX = Math.max(-360, Math.min(360, angle));
        const scale = Math.max(0.96, 1 - Math.abs(distance) / 1000);
        const opacity = Math.max(0.3, 1 - Math.abs(distance) / 75);

        item.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
        item.style.opacity = `${opacity}`;
        item.style.transformOrigin = 'left center';
        item.style.backfaceVisibility = 'hidden';
        item.style.willChange = 'transform, opacity';

        if (!shouldOffset) {
          const marginAdjustment = -Math.abs(rotateX) * 0.12;
          if (indexOffset > 5) {
            item.style.marginTop = `${marginAdjustment}px`;
          } else {
            item.style.marginBottom = `${marginAdjustment}px`;
          }
        }
      }
      
      ref.current._effectRafId = null;
    });
  };

  const handleScroll = (ref, values, setter, isLooping = false, loopSize = 0) => {
    if (!ref.current || disabled) return;

    const scrollTop = ref.current.scrollTop;
    const centerOffset = itemHeight * Math.floor(rows / 2) + itemHeight / 2;
    const visibleCenter = scrollTop + centerOffset;

    // Optimize: only check items near the visible area
    const items = ref.current.children;
    const itemCount = items.length;
    const paddingCount = Math.floor(rows / 2);
    
    // Estimate which item should be closest based on scroll position
    const estimatedIndex = Math.round((scrollTop / itemHeight) - paddingCount);
    const startCheck = Math.max(0, estimatedIndex - 2);
    const endCheck = Math.min(itemCount - 1, estimatedIndex + rows + 2);
    
    let closestIndex = estimatedIndex;
    let minDistance = Infinity;

    // Only check items in the visible range for better performance
    for (let i = startCheck; i <= endCheck; i++) {
      const item = items[i];
      if (!item) continue;
      
      const itemCenter = item.offsetTop + itemHeight / 2;
      const distance = Math.abs(itemCenter - visibleCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    let valueIndex = closestIndex - paddingCount;

    if (isLooping && loopSize > 0) {
      // Calculate actual value using modulo for looping
      // valueIndex can be negative, so we need to handle that properly
      // Use proper modulo calculation with negative numbers
      let actualIndex = ((valueIndex % loopSize) + loopSize) % loopSize;
      
      // Get the actual value from the values array (for days, this maps 0-30 to 1-31)
      // For months, values array is [0,1,2,...,11] so actualIndex = actualValue
      // For days, values array is [1,2,3,...,31] so we need values[actualIndex]
      let actualValue = values[actualIndex];
      
      // Ensure we have a valid value
      if (actualValue !== undefined) {
        // Use functional setState to avoid stale closures
        setter((prevValue) => {
          if (prevValue !== actualValue) {
            return actualValue;
          }
          return prevValue;
        });
      }

      // Check if we need to jump to maintain loop (only if initialized)
      // Do this asynchronously to not block scrolling
      if (isInitializedRef.current && ref.current) {
        const middleCopy = Math.floor(LOOP_COPIES / 2);
        const middleStartIndex = middleCopy * loopSize;
        const threshold = loopSize * 8; // Increased threshold to reduce jumps during scrolling

        // Schedule jump check on next frame to not interrupt scrolling
        requestAnimationFrame(() => {
          if (!ref.current) return;
          
          const currentScrollTop = ref.current.scrollTop;
          const currentVisibleCenter = currentScrollTop + itemHeight * Math.floor(rows / 2) + itemHeight / 2;
          const currentItems = Array.from(ref.current.children);
          let currentClosestIndex = 0;
          let currentMinDistance = Infinity;

          for (let i = 0; i < currentItems.length; i++) {
            const item = currentItems[i];
            const itemCenter = item.offsetTop + itemHeight / 2;
            const distance = Math.abs(itemCenter - currentVisibleCenter);
            if (distance < currentMinDistance) {
              currentMinDistance = distance;
              currentClosestIndex = i;
            }
          }

          const paddingCount = Math.floor(rows / 2);
          const currentValueIndex = currentClosestIndex - paddingCount;

          // Only jump if we're really far from center and not actively scrolling
          if (currentValueIndex < middleStartIndex - threshold) {
            const jumpAmount = loopSize * (LOOP_COPIES - 16);
            ref.current.scrollTop = currentScrollTop + jumpAmount * itemHeight;
          } else if (currentValueIndex > middleStartIndex + threshold) {
            const jumpAmount = loopSize * (LOOP_COPIES - 16);
            ref.current.scrollTop = currentScrollTop - jumpAmount * itemHeight;
          }
        });
      }
    } else {
      // Non-looping (year column)
      if (values[valueIndex] !== undefined) {
        setter((prevValue) => {
          if (prevValue !== values[valueIndex]) {
            return values[valueIndex];
          }
          return prevValue;
        });
      }
    }
    
    // Update 3D effect asynchronously for smoother scrolling
    update3DEffect(ref);
  };

  // Use requestAnimationFrame for smooth, non-blocking scroll handling
  const handleMonthScroll = () => {
    if (disabled || !isInitializedRef.current) return;
    
    // Cancel any pending animation frame
    if (monthRef.current?._rafId) {
      cancelAnimationFrame(monthRef.current._rafId);
    }
    
    // Schedule update on next frame for smooth scrolling
    monthRef.current._rafId = requestAnimationFrame(() => {
      handleScroll(monthRef, months.map((_, i) => i), setSelectedMonth, true, 12);
      monthRef.current._rafId = null;
    });
  };

  const handleDayScroll = () => {
    if (disabled || !isInitializedRef.current) return;
    
    // Cancel any pending animation frame
    if (dayRef.current?._rafId) {
      cancelAnimationFrame(dayRef.current._rafId);
    }
    
    // Schedule update on next frame for smooth scrolling
    dayRef.current._rafId = requestAnimationFrame(() => {
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      handleScroll(dayRef, days, setSelectedDay, true, daysInMonth);
      dayRef.current._rafId = null;
    });
  };

  useEffect(() => {
    const dim = getDaysInMonth(selectedMonth, selectedYear);
    const prevDaysInMonth = daysInMonth;
    setDaysInMonth(dim);
    if (selectedDay > dim) {
      setSelectedDay(dim);
    }

    // Update day scroll position when month/year changes (only if initialized)
    if (isInitializedRef.current && dayRef.current && prevDaysInMonth !== dim) {
      const dayMiddleCopy = Math.floor(LOOP_COPIES / 2);
      const currentDay = selectedDay > dim ? dim : selectedDay;
      const dayStartIndex = dayMiddleCopy * dim + (currentDay - 1);
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (dayRef.current) {
          dayRef.current.scrollTop = dayStartIndex * itemHeight;
        }
      });
    }
  }, [selectedMonth, selectedYear, daysInMonth, selectedDay]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );
  const loopingDays = useMemo(
    () => Array.from({ length: LOOP_COPIES }, () => days).flat(),
    [days]
  );
  const paddingCount = Math.floor(rows / 2);

  useEffect(() => {
    // Initialize scroll positions to middle of loop for months and days
    if (isInitializedRef.current) return;

    const initPicker = () => {
      if (!monthRef.current || !dayRef.current || !yearRef.current) {
        return;
      }

      // Initialize scroll positions synchronously for immediate display
      const monthMiddleCopy = Math.floor(LOOP_COPIES / 2);
      const monthStartIndex = monthMiddleCopy * 12 + defaultMonth;
      monthRef.current.scrollTop = monthStartIndex * itemHeight;

      const dayMiddleCopy = Math.floor(LOOP_COPIES / 2);
      const initialDaysInMonth = getDaysInMonth(defaultMonth, defaultYear);
      const dayStartIndex = dayMiddleCopy * initialDaysInMonth + (defaultDay - 1);
      dayRef.current.scrollTop = dayStartIndex * itemHeight;

      const yearIndex = years.findIndex((y) => y === defaultYear);
      if (yearIndex >= 0) {
        yearRef.current.scrollTop = yearIndex * itemHeight;
      }

      // Mark as initialized immediately
      isInitializedRef.current = true;
      
      // Set initial date at noon local time to avoid timezone issues
      const initialDate = new Date(defaultYear, defaultMonth, defaultDay, 12, 0, 0);
      lastDateRef.current = initialDate;
      
      // Store the exact date string for comparison
      const initialYear = defaultYear;
      const initialMonth = String(defaultMonth + 1).padStart(2, '0');
      const initialDay = String(defaultDay).padStart(2, '0');
      lastDateRef.current._dateStr = `${initialYear}-${initialMonth}-${initialDay}`;

      // Defer 3D effects to next frame to prevent blocking
      requestAnimationFrame(() => {
        update3DEffect(monthRef);
        update3DEffect(dayRef);
        update3DEffect(yearRef);
      });
    };

    // Use double requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (monthRef.current && dayRef.current && yearRef.current) {
          initPicker();
        } else {
          // Fallback with minimal delay
          const timeoutId = setTimeout(() => {
            if (monthRef.current && dayRef.current && yearRef.current) {
              initPicker();
            }
          }, 10);

          return () => clearTimeout(timeoutId);
        }
      });
    });
  }, [defaultMonth, defaultDay, defaultYear, itemHeight, years]);

  const styles = {
    container: {
      fontFamily: 'inherit',
      margin: '16px auto',
      textAlign: 'center',
      position: 'relative',
      zIndex: '1',
    },
    pickerWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: itemHeight * rows,
      position: 'relative',
      paddingLeft: '4px',//d small padding on left for month column
      paddingRight: '0px', // Reduce right padding
    },
    pickerColumn: {
      width: '33%',
      height: itemHeight * rows,
      overflowY: 'scroll',
      scrollSnapType: 'y proximity', // Changed from 'mandatory' to 'proximity' for smoother scrolling
      WebkitOverflowScrolling: 'touch',
      borderRadius: 8,
      perspective: 1000,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      transformStyle: 'preserve-3d',
      pointerEvents: disabled ? 'none' : 'auto',
      opacity: disabled ? 0.6 : 1,
      scrollBehavior: 'auto', // Ensure smooth native scrolling
    },
    monthColumn: {
      width: '33%',
      height: itemHeight * rows,
      overflowY: 'scroll',
      scrollSnapType: 'y proximity',
      WebkitOverflowScrolling: 'touch',
      borderRadius: 8,
      perspective: 1000,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      transformStyle: 'preserve-3d',
      pointerEvents: disabled ? 'none' : 'auto',
      opacity: disabled ? 0.6 : 1,
      scrollBehavior: 'auto',
      paddingLeft: '0px', // Extra padding for month column on the left
    },
    pickerItem: {
      height: itemHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      scrollSnapAlign: 'center',
      fontSize: 16,
      fontWeight: 500,
      color: '#333',
      transition: 'transform 0.2s ease, opacity 0.2s ease',
    },
    highlightOverlay: {
      position: 'absolute',
      top: itemHeight * Math.floor(rows / 2),
      height: itemHeight,
      left: 0,
      right: 0,
      border: '1px solid #eee',
      background: '#eee',
      borderRadius: 4,
      pointerEvents: 'none',
      zIndex: -1,
    },
  };

  return (
    <div id="container" style={styles.container}>
      <div id="pickerWrapper" style={styles.pickerWrapper}>
        {/* Month Column - First (Looping) */}
        <div
          style={styles.monthColumn}
          ref={monthRef}
          onScroll={handleMonthScroll}
        >
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-month-top-${i}`} style={styles.pickerItem} />
          ))}
          {loopingMonths.map((m, i) => (
            <div
              key={`month-${i}`}
              style={{
                ...styles.pickerItem,
                justifyContent: 'flex-start',
              }}
            >
              {m}
            </div>
          ))}
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-month-bottom-${i}`} style={styles.pickerItem} />
          ))}
        </div>

        {/* Day Column - Second (Looping) */}
        <div
          style={styles.pickerColumn}
          ref={dayRef}
          onScroll={handleDayScroll}
        >
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-day-top-${i}`} style={styles.pickerItem} />
          ))}
          {loopingDays.map((d, i) => (
            <div
              key={`day-${i}`}
              style={{
                ...styles.pickerItem,
                justifyContent: 'flex-start',
                paddingLeft: '35px', // Reduced from 45px to balance with month padding
              }}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-day-bottom-${i}`} style={styles.pickerItem} />
          ))}
        </div>

        {/* Year Column - Third */}
        <div
          style={styles.pickerColumn}
          ref={yearRef}
          onScroll={() => {
            if (disabled || !isInitializedRef.current) return;
            // Cancel any pending animation frame
            if (yearRef.current?._rafId) {
              cancelAnimationFrame(yearRef.current._rafId);
            }
            // Schedule update on next frame for smooth scrolling
            yearRef.current._rafId = requestAnimationFrame(() => {
              handleScroll(yearRef, years, setSelectedYear);
              yearRef.current._rafId = null;
            });
          }}
        >
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-year-top-${i}`} style={styles.pickerItem} />
          ))}
          {years.map((y) => (
            <div key={y} style={styles.pickerItem}>
              {y}
            </div>
          ))}
          {Array.from({ length: paddingCount }).map((_, i) => (
            <div key={`pad-year-bottom-${i}`} style={styles.pickerItem} />
          ))}
        </div>

        <div
          id="highlightOverlay"
          style={{ ...styles.highlightOverlay, ...highlightOverlayStyle }}
        />
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(MonthDayYearPicker);

