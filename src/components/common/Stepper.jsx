import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";

const STATE = {
  success: {
    circle: "bg-success-normal text-white",
    line: "bg-success-normal",
  },
  progress: {
    circle: "bg-warning-normal text-white",
    line: "bg-warning-normal",
  },
  warning: {
    circle: "bg-warning-normal text-white",
    line: "bg-warning-normal",
  },
  error: { circle: "bg-danger-normal text-white", line: "bg-danger-normal" },
  disable: { circle: "bg-gray-300 text-white", line: "bg-gray-300" },
};

export const Stepper = memo(
  ({ orientation = "vertical", startIndex = 1, stepItem = [], className, tail = false }) => {
    return orientation === "horizontal" ? (
      <Horizontal
        steps={stepItem}
        startIndex={startIndex}
        className={className}
        tail={tail}
      />
    ) : (
      <Vertical
        steps={stepItem}
        startIndex={startIndex}
        className={className}
        tail={tail}
      />
    );
  }
);

const Horizontal = memo(({ steps, className, tail }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("relative w-full overflow-x-auto", className)} />;
  }

  return (
    <div className={cn("relative w-full overflow-x-auto", className)}>
      <div className="flex items-start">
        {steps.map((s, i) => (
          <HItem
            key={i}
            data={s}
            idx={i}
            isLast={i === steps.length - 1}
            tail={tail}
          />
        ))}
      </div>
    </div>
  );
});

const HItem = memo(({ data, idx, isLast, tail }) => {
  const cfg = STATE[data.state] || STATE.disable;

  const showLine = data.line !== false;
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
      className="relative flex-1"
    >
      <div className="flex flex-col">
        {/* Circle with connecting line */}
        <div className="flex items-center">
          {/* Circle */}
          <div className="relative z-10">
            <Circle Icon={Icon} badge={data.badgeIndex} cfg={cfg} />
          </div>

          {/* Line */}
          {(!isLast || tail) && showLine && (
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: idx * 0.06 + 0.2, duration: 0.3 }}
              className={cn("h-[2px] flex-1 will-change-transform", cfg.line)}
            />
          )}
        </div>

        {/* Content */}
        <div className="mt-4 pl-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Header title={data.title} />
              <Description desc={data.description} />
            </div>
            {data.rightContent && (
              <div className="text-gray-500 shrink-0">{data.rightContent}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const Vertical = memo(({ steps, className, tail }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ref.current || !mounted) return;

    const updateHeight = () => {
      if (!ref.current) return;
      const circles = ref.current.querySelectorAll(".step-circle");
      if (circles.length < 2) return;

      const top = circles[0].getBoundingClientRect().top;
      const bottom = circles[circles.length - 1].getBoundingClientRect().bottom;
      const newHeight = bottom - top;

      if (newHeight > 0 && newHeight !== height) {
        setHeight(newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(ref.current);

    updateHeight();

    const timer = setTimeout(updateHeight, 300);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [mounted, height, steps.length]);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <AnimatePresence>
        {mounted && height > 0 && (
          <motion.div
            key="tail-line"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-[15px] top-4 w-[2px] bg-gray-300 -z-20 will-change-transform"
            style={{ height }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {steps.map((s, i) => (
          <VItem
            key={i}
            data={s}
            idx={i}
            hasNext={!!steps[i + 1]}
            mounted={mounted}
            tail={tail}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
});

const VItem = memo(({ data, idx, hasNext, mounted, tail, isLast }) => {
  const cfg = STATE[data.state] || STATE.disable;

  const showLine = data.line !== false;
  const showTail = tail && isLast;
  const Icon = data.icon;

  const lineStyle =
    data.textPosition === "bottom"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { left: 16 };

  return (
    <motion.div
      initial={mounted ? { opacity: 0, x: -16 } : false}
      animate={mounted ? { opacity: 1, x: 0 } : false}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
      className={cn(
        data.textPosition === "bottom"
          ? "flex flex-col items-center text-center"
          : "relative flex items-start"
      )}
    >
      {/* circle */}
      <div
        className={cn(
          "step-circle relative z-10",
          data.textPosition === "bottom" ? "mb-2" : "mr-4"
        )}
      >
        <Circle Icon={Icon} badge={data.badgeIndex} cfg={cfg} />
      </div>

      {/* Always show line unless there's no next item and tail is false, or line is explicitly false */}
      {mounted && showLine && (hasNext || showTail) && (
        <motion.div
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: showLine && (hasNext || showTail) ? 1 : 0 }}
          transition={{ delay: idx * 0.06 + 0.2, duration: 0.3 }}
          className={cn(
            "absolute top-8 w-0.5 will-change-transform",
            showLine && (hasNext || showTail) ? `z-0 ${cfg.line}` : "z-0 bg-transparent"
          )}
          style={{
            height: showTail ? "80%" : "calc(100% - 16px)",
            ...lineStyle
          }}
        />
      )}

      {/* content */}
      {data.textPosition === "bottom" ? (
        <ContentBottom data={data} />
      ) : (
        <div className="pb-6 flex-1">
          <ContentRight data={data} />
        </div>
      )}
    </motion.div>
  );
});

const Circle = ({ Icon, badge, cfg }) => (
  <div
    className={cn(
      "h-8 w-8 rounded-full flex items-center justify-center",
      cfg.circle
    )}
  >
    {badge !== undefined ? (
      badge
    ) : Icon ? (
      <Icon className="h-4 w-4 text-white" />
    ) : null}
  </div>
);

const Header = ({ title }) =>
  typeof title === "string" ? (
    <h4 className="font-semibold">{title}</h4>
  ) : (
    title
  );

const Description = ({ desc }) =>
  desc ? (
    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
  ) : null;

const ContentBottom = ({ data }) => (
  <div className="pb-4 flex-1">
    {data.rightContent ? (
      <>
        {/* title + pill/timestamp on one row */}
        <div className="flex items-start justify-between gap-3">
          <Header title={data.title} />
          <div className="shrink-0">{data.rightContent}</div>
        </div>
        {/* full description underneath */}
        <Description desc={data.description} />
      </>
    ) : (
      <>
        <Header title={data.title} />
        <Description desc={data.description} />
      </>
    )}
    {data.leftContent && <div className="mt-1">{data.leftContent}</div>}
  </div>
);

const ContentRight = ({ data }) => (
  <>
    {data.rightContent ? (
      <>
        {/* judul + pill di satu baris */}
        <div className="flex items-start justify-between gap-3">
          <Header title={data.title} />
          <div className="shrink-0">{data.rightContent}</div>
        </div>
        <Description desc={data.description} />
      </>
    ) : (
      <>
        <Header title={data.title} />
        <Description desc={data.description} />
      </>
    )}
    {data.leftContent && <div className="mt-1">{data.leftContent}</div>}
  </>
);

export default Stepper;
