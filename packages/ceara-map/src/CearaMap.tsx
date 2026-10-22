import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { MUNICIPALITIES, STATE_OUTLINE, VIEW_BOX, type Municipality } from "./data";

export type TooltipContent = {
  image?: string | null;
  /** defaults to the municipality name */
  title?: ReactNode;
  subtitle?: ReactNode;
};

export type TooltipConfig = {
  /** What the default tooltip shows. Return null to show nothing for that municipality. */
  content?: (municipality: Municipality) => TooltipContent | null | undefined;
  /** width in px (default 220) */
  width?: number;
  /** distance in px between the cursor and the tooltip (default 16) */
  cursorOffset?: number;
  /** "cursor" follows the mouse; "anchored" sits below the municipality (default "cursor") */
  placement?: "cursor" | "anchored";
  /** ms before showing, so it doesn't flicker when the mouse sweeps across (default 0) */
  delay?: number;
  className?: string;
  /**
   * On touch screens: "hide" shows no tooltip and a tap clicks right away;
   * "first-tap" shows the tooltip on the 1st tap and clicks on the 2nd (default "hide").
   */
  touch?: "hide" | "first-tap";
};

export type CearaMapProps = {
  /** Fill color for each municipality. Return undefined to use the default fill. */
  getFill?: (municipality: Municipality) => string | null | undefined;
  /** Same as getFill, as a { slug: color } object — use it when rendering from a Server Component. */
  fills?: Partial<Record<string, string>>;
  /** Fill for municipalities without a color (default: var(--cm-municipality-fill)). */
  defaultFill?: string;
  /** Extra class name for each municipality. */
  getClassName?: (municipality: Municipality) => string | null | undefined;
  /** Slug highlighted from outside the map (e.g. while hovering a list). */
  highlighted?: string | null;
  /** Turns each municipality into a link. */
  getHref?: (municipality: Municipality) => string | null | undefined;
  /** Municipality click. With getHref, call event.preventDefault() to navigate on your own. */
  onClick?: (municipality: Municipality, event: MouseEvent<Element> | KeyboardEvent<Element>) => void;
  /** Mouse entered (municipality) or left (null) a municipality. */
  onHover?: (municipality: Municipality | null, event: MouseEvent<Element> | null) => void;
  /** true for the default tooltip (name only), or a configuration object. */
  tooltip?: boolean | TooltipConfig;
  /** Custom tooltip content; takes precedence over tooltip.content. Return null to show nothing. */
  renderTooltip?: (municipality: Municipality) => ReactNode;
  /** State outline drawn over the municipalities (default true). */
  showOutline?: boolean;
  /** Accessible label of the map (default "Mapa do Ceará"). */
  title?: string;
  className?: string;
  style?: CSSProperties;
};

type Anchor = { type: "cursor"; x: number; y: number } | { type: "element"; element: Element };

// older React versions warn when useLayoutEffect runs on the server
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type ShapeProps = { municipality: Municipality; className: string; highlighted: boolean; fill?: string };

function Shape({ municipality, className, highlighted, fill }: ShapeProps) {
  const props = { className, "data-highlighted": highlighted || undefined, style: fill ? { fill } : undefined };
  if (municipality.shape === "path") return <path {...props} d={municipality.geometry} />;
  if (municipality.shape === "polyline") return <polyline {...props} points={municipality.geometry} />;
  return <polygon {...props} points={municipality.geometry} />;
}

function isKeyboardFocus(element: Element) {
  try {
    return element.matches(":focus-visible");
  } catch {
    return true; // browsers without :focus-visible
  }
}

function classNames(...names: (string | null | undefined | false)[]) {
  return names.filter(Boolean).join(" ");
}

export function CearaMap({
  getFill,
  fills,
  defaultFill,
  getClassName,
  highlighted,
  getHref,
  onClick,
  onHover,
  tooltip,
  renderTooltip,
  showOutline = true,
  title = "Mapa do Ceará",
  className,
  style,
}: CearaMapProps) {
  const config: TooltipConfig = typeof tooltip === "object" ? tooltip : {};
  const hasTooltip = Boolean(tooltip || renderTooltip);
  const width = config.width ?? 220;
  const offset = config.cursorOffset ?? 16;
  const placement = config.placement ?? "cursor";
  const touch = config.touch ?? "hide";

  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipSlug, setTooltipSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<Anchor | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pointerRef = useRef<string>("mouse");

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // positions the tooltip straight in the DOM: moving the mouse doesn't re-render the map
  function position() {
    const container = containerRef.current;
    const box = tooltipRef.current;
    const anchor = anchorRef.current;
    if (!container || !box || !anchor) return;
    const area = container.getBoundingClientRect();
    const w = box.offsetWidth;
    const h = box.offsetHeight;
    let x: number;
    let y: number;
    if (anchor.type === "cursor") {
      x = anchor.x - area.left + offset;
      y = anchor.y - area.top + offset;
      // flip to the other side of the cursor when it doesn't fit inside the map
      if (x + w > area.width) x -= w + offset * 2;
      if (y + h > area.height) y -= h + offset * 2;
    } else {
      const target = anchor.element.getBoundingClientRect();
      x = target.left + target.width / 2 - area.left - w / 2;
      y = target.bottom - area.top + offset / 2;
      if (y + h > area.height) y = target.top - area.top - h - offset / 2;
    }
    x = Math.min(Math.max(x, 0), Math.max(area.width - w, 0));
    y = Math.max(y, 0);
    box.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  useIsomorphicLayoutEffect(position, [tooltipSlug]);

  function showTooltip(slug: string, anchor: Anchor, immediate = false) {
    if (!hasTooltip) return;
    anchorRef.current = anchor;
    clearTimeout(timerRef.current);
    if (immediate || !config.delay) setTooltipSlug(slug);
    else timerRef.current = setTimeout(() => setTooltipSlug(slug), config.delay);
  }

  function hideTooltip() {
    clearTimeout(timerRef.current);
    setTooltipSlug(null);
  }

  function enter(municipality: Municipality, event: MouseEvent<Element>) {
    if (pointerRef.current === "touch") return; // emulated mouse events after a tap
    setHovered(municipality.slug);
    onHover?.(municipality, event);
    showTooltip(
      municipality.slug,
      placement === "cursor"
        ? { type: "cursor", x: event.clientX, y: event.clientY }
        : { type: "element", element: event.currentTarget },
    );
  }

  function leave(event: MouseEvent<Element>) {
    if (pointerRef.current === "touch") return;
    setHovered(null);
    onHover?.(null, event);
    hideTooltip();
  }

  function click(municipality: Municipality, event: MouseEvent<Element> | KeyboardEvent<Element>) {
    if (pointerRef.current === "touch" && hasTooltip && touch === "first-tap" && tooltipSlug !== municipality.slug) {
      event.preventDefault();
      setHovered(municipality.slug);
      showTooltip(municipality.slug, { type: "element", element: event.currentTarget }, true);
      return;
    }
    onClick?.(municipality, event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    pointerRef.current = event.pointerType;
    if (event.pointerType === "mouse" && placement === "cursor" && anchorRef.current?.type === "cursor") {
      anchorRef.current = { type: "cursor", x: event.clientX, y: event.clientY };
      position();
    }
  }

  // tapping outside a municipality closes the tooltip opened by the first tap
  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    if (pointerRef.current === "touch" && !(event.target as Element).closest("[data-slug]")) {
      setHovered(null);
      hideTooltip();
    }
  }

  const tooltipMunicipality = tooltipSlug ? MUNICIPALITIES.find((m) => m.slug === tooltipSlug) : undefined;
  let content: ReactNode = null;
  if (tooltipMunicipality) {
    if (renderTooltip) {
      content = renderTooltip(tooltipMunicipality);
    } else {
      const data = config.content ? config.content(tooltipMunicipality) : {};
      if (data) {
        content = (
          <>
            {data.image && <img key={data.image} src={data.image} alt="" className="cm-tooltip-image" />}
            <div className="cm-tooltip-body">
              <strong className="cm-tooltip-title">{data.title ?? tooltipMunicipality.name}</strong>
              {data.subtitle && <span className="cm-tooltip-subtitle">{data.subtitle}</span>}
            </div>
          </>
        );
      }
    }
  }
  const tooltipVisible = content !== null && content !== undefined && content !== false;
  const hiddenOnTouch = touch === "hide" && pointerRef.current === "touch";

  return (
    <div
      ref={containerRef}
      className={classNames("cm-map", className)}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerDown={(event) => (pointerRef.current = event.pointerType)}
      onClick={handleMapClick}
    >
      <svg viewBox={VIEW_BOX} role="img" aria-label={title} className="cm-svg">
        {MUNICIPALITIES.map((municipality) => {
          const isHighlighted = municipality.slug === hovered || municipality.slug === highlighted;
          // while highlighted the color comes from CSS (--cm-municipality-highlight), so no inline fill
          const fill = isHighlighted
            ? undefined
            : (getFill?.(municipality) ?? fills?.[municipality.slug] ?? defaultFill);
          const shape = (
            <>
              {/* native browser tooltip only when there's no custom one, so it doesn't show twice */}
              {!hasTooltip && <title>{municipality.name}</title>}
              <Shape
                municipality={municipality}
                className={classNames("cm-municipality", getClassName?.(municipality))}
                highlighted={isHighlighted}
                fill={fill ?? undefined}
              />
            </>
          );
          const common = {
            "data-slug": municipality.slug,
            onMouseEnter: (event: MouseEvent<Element>) => enter(municipality, event),
            onMouseLeave: leave,
            onFocus: (event: FocusEvent<Element>) => {
              // only keyboard focus: a tap focuses the municipality right before its click, and
              // opening the tooltip here would turn that first tap into the "second tap" of first-tap
              if (!isKeyboardFocus(event.currentTarget)) return;
              setHovered(municipality.slug);
              showTooltip(municipality.slug, { type: "element", element: event.currentTarget }, true);
            },
            onBlur: () => {
              setHovered(null);
              hideTooltip();
            },
          };

          const href = getHref?.(municipality);
          if (href) {
            return (
              <a
                key={municipality.slug}
                {...common}
                href={href}
                aria-label={municipality.name}
                className="cm-target"
                onClick={(event) => click(municipality, event)}
              >
                {shape}
              </a>
            );
          }
          if (onClick || touch === "first-tap") {
            return (
              <g
                key={municipality.slug}
                {...common}
                role="button"
                tabIndex={0}
                aria-label={municipality.name}
                className="cm-target"
                onClick={(event) => click(municipality, event)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick?.(municipality, event);
                  }
                }}
              >
                {shape}
              </g>
            );
          }
          return (
            <g key={municipality.slug} {...common}>
              {shape}
            </g>
          );
        })}
        {showOutline && <path className="cm-outline" d={STATE_OUTLINE} pointerEvents="none" />}
      </svg>

      {hasTooltip && (
        <div
          ref={tooltipRef}
          className={classNames("cm-tooltip", config.className)}
          data-visible={(tooltipVisible && !hiddenOnTouch) || undefined}
          style={{ "--cm-tooltip-width": `${width}px` } as CSSProperties}
          aria-hidden="true"
        >
          {content}
        </div>
      )}
    </div>
  );
}
