import { motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/fields/Badge";
import { Separator } from "@/components/ui/separator";
import { Tabs as RadixTabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, createTestIdProps } from "@/lib/utils";

/**
 * A customizable tabbed interface component with support for controlled/uncontrolled states,
 * different styles, orientations and active state management.
 *
 * @component
 * @param {Object} props
 * @param {Array<{value: string, label: string, shouldFetch?: boolean}>} props.tabs - Array of tab objects containing value and label
 * @param {'pill' | 'underline'} [props.style='pill'] - Visual style of the tabs
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal'] - Orientation of the tabs
 * @param {'none' | 'top'} [props.sticky='none'] - Sticky behavior of the tabs
 * @param {string} [props.controlledValue] - Controlled value for the active tab
 * @param {Function} [props.onValueChange] - Callback fired when tab changes
 * @param {boolean} [props.active=true] - Whether the tabs component is active
 * @param {number} [props.defaultActiveKey=0] - Index of the tab that should be active by default
 * @param {Array<string>} [props.onTabFetch=[]] - Array of tab values that should trigger re-render when switched to
 * @returns {React.ReactElement} The Tabs component
 */

export const Tabs = memo(
  ({
    tabs,
    style = "pill", // renamed from variant to style
    orientation = "horizontal",
    sticky = "none",
    value: controlledValue,
    onValueChange,
    active = true, // new prop for active state
    defaultActiveKey = 0, // new prop for default active tab index
    ...rest
  }) => {
    // Control active state
    const [isActive, setIsActive] = useState(active);

    // Update active state when prop changes
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    const controlled =
      controlledValue !== undefined && typeof onValueChange === "function";

    // Get default tab value based on defaultActiveKey index
    const getDefaultTabValue = () => {
      if (tabs && tabs.length > 0) {
        const index = Math.max(0, Math.min(defaultActiveKey, tabs.length - 1));
        return tabs[index]?.value ?? tabs[0]?.value ?? "";
      }
      return "";
    };

    const [internal, setInternal] = useState(getDefaultTabValue());
    const active_tab = controlled ? controlledValue : internal;
    const setActive_tab = controlled ? onValueChange : setInternal;

    // Store last active tab
    const [lastActiveTab, setLastActiveTab] = useState(active_tab);

    // Update last active tab when tab changes
    useEffect(() => {
      if (isActive) {
        setLastActiveTab(active_tab);
      }
    }, [active_tab, isActive]);

    // Use last active tab when component becomes active again
    useEffect(() => {
      if (isActive && !controlled) {
        setInternal(lastActiveTab);
      }
    }, [isActive, controlled, lastActiveTab]);

    const trgRef = useRef({});
    const [indicator, setIndicator] = useState({ width: 0, left: 0 });

    // Function to update indicator position
    const updateIndicator = useCallback(() => {
      const el = trgRef.current[active_tab];
      if (el) {
        setIndicator({ width: el.offsetWidth, left: el.offsetLeft });
      }
    }, [active_tab]);

    // Update indicator on tab change
    useLayoutEffect(() => {
      updateIndicator();
    }, [updateIndicator, tabs]);

    // Add resize listener to update indicator on screen size change
    useEffect(() => {
      const handleResize = () => {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          updateIndicator();
        });
      };

      window.addEventListener("resize", handleResize);

      // Also listen for orientation change on mobile devices
      window.addEventListener("orientationchange", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      };
    }, [updateIndicator]);

    const internalOnValue = useCallback(
      (val) => {
        const t = tabs.find((x) => x.value === val);
        if (t?.noIndicator || t?.disabled) return;
        setActive_tab(val);
      },
      [tabs, setActive_tab]
    );

    const TriggerInner = ({ tab, isActive }) => (
      <div className="flex items-center gap-1">
        {tab.icon && (
          <tab.icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-red" : "text-gray-500"
            )}
          />
        )}

        <span
          className={cn(isActive ? "text-red font-semibold" : "text-gray-700")}
        >
          {tab.label}
        </span>

        {Number.isFinite(tab.count) && (
          <span
            className="ml-1 inline-flex h-4 min-w-[18px] items-center justify-center
                           rounded-full bg-orange-500 px-[6px] text-[10px] font-semibold leading-none text-white"
          >
            {tab.count > 99 ? "99+" : tab.count}
          </span>
        )}

        {tab.badge && (
          <Badge
            color={tab.badgeColor || "red"}
            className="ml-2 px-2 py-0.5 text-xs"
          >
            {tab.badge}
          </Badge>
        )}
      </div>
    );

    // Render all tab contents but only display the active one
    const renderAllTabContents = () => {
      return tabs.map((tab) => (
        <div
          key={tab.value}
          className={cn(
            "h-full",
            tab.value === active_tab ? "block" : "hidden"
          )}
        >
          {tab.content}
        </div>
      ));
    };

    if (style === "pill") {
      return (
        <RadixTabs
          value={active_tab}
          onValueChange={setActive_tab}
          className={cn(
            "flex h-full w-full flex-col",
            orientation === "vertical" && "flex-row space-x-4"
          )}
          {...rest}
        >
          {/* Bar container */}
          <TabsList
            className={cn(
              "flex w-full rounded-md p-[2.5px] bg-tertiary-normal",
              orientation === "vertical" && "h-full flex-col"
            )}
          >
            {tabs.map((tab, i) => {
              const isTabActive = active_tab === tab.value;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  aria-disabled={tab.disabled || undefined}
                  tabIndex={tab.disabled ? -1 : 0}
                  data-disabled={tab.disabled ? "" : undefined}
                  className={cn(
                    "group relative transition-colors",
                    i === 0 && "rounded-l-md",
                    i === tabs.length - 1 && "rounded-r-md",
                    orientation === "horizontal" && "flex-1",
                    orientation === "vertical" && "w-full justify-start",
                    tab.disabled && "cursor-not-allowed"
                  )}
                  {...createTestIdProps(`tab_pill_${orientation}_${tab.value}`)}
                >
                  <div
                    className={cn(
                      "flex w-full items-center justify-center rounded-md px-5 py-[1.5px] transition-all duration-300 outline outline-none",
                      isTabActive
                        ? "bg-white active:shadow-md"
                        : "bg-tertiary-normal"
                    )}
                  >
                    <TriggerInner tab={tab} isActive={isTabActive} />
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div
            className={cn("h-full mt-4", orientation === "vertical" && "mt-0")}
          >
            {isActive && renderAllTabContents()}
          </div>
        </RadixTabs>
      );
    }

    return (
      <RadixTabs
        value={active_tab}
        onValueChange={internalOnValue}
        className={cn(
          "flex h-full w-full flex-col ",
          orientation === "vertical" && "flex-row space-x-4"
        )}
        {...rest}
      >
        <TabsList
          className={cn(
            "relative w-full rounded-none bg-white border-b border-gray-300",
            orientation === "vertical" && "h-full flex-col",
            sticky === "top" && "sticky top-0 z-10",
            sticky === "bottom" && "sticky bottom-0 z-10"
          )}
        >
          {tabs.map((tab) => {
            const isTabActive = active_tab === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                aria-disabled={tab.disabled || undefined}
                tabIndex={tab.disabled ? -1 : 0}
                data-disabled={tab.disabled ? "" : undefined}
                ref={(el) => el && (trgRef.current[tab.value] = el)}
                className={cn(
                  "relative rounded-none bg-white border-0 shadow-none outline-none ring-0 focus:ring-0 focus:outline-none hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-none",
                  orientation === "horizontal" && !tab.customWidth && "flex-1",
                  orientation === "vertical" && "w-full justify-start",
                  tab.disabled && "cursor-not-allowed"
                )}
                style={tab.customWidth ? { width: tab.customWidth } : {}}
                {...createTestIdProps(`tab_sticky_${orientation}_${tab.value}`)}
              >
                <div className="flex h-full items-center justify-center px-4 py-1">
                  <TriggerInner tab={tab} isActive={isTabActive} />
                </div>
              </TabsTrigger>
            );
          })}

          {/* baseline grey line - removed for cleaner look */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />

          {/* red underline indicator */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className="absolute bottom-0 z-10 h-0.5 bg-red"
            style={indicator}
          />
        </TabsList>

        {orientation === "vertical" && (
          <Separator orientation="vertical" className="h-auto" />
        )}

        <div
          className={cn(
            "h-auto",
            orientation === "vertical" && "mt-0",
            sticky === "bottom" && "mb-3"
          )}
        >
          {isActive && renderAllTabContents()}
        </div>
      </RadixTabs>
    );
  }
);
