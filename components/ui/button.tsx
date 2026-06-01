import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-dark disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 px-4",
  {
    variants: {
      variant: {
        default:
          "bg-champagne text-white hover:bg-champagne/92 active:scale-[0.98] shadow-warm hover:shadow-warm-md",
        outline:
          "border border-champagne/45 bg-white/80 text-charcoal hover:bg-champagne/8 hover:border-champagne/60",
        ghost: "hover:bg-surface text-charcoal",
        secondary: "bg-surface text-charcoal hover:bg-surface-deep border border-beige",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-champagne underline-offset-4 hover:underline min-h-0 min-w-0 px-0",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 min-h-10 min-w-10 rounded-lg px-3.5 text-sm font-semibold",
        lg: "h-12 min-h-12 px-8 text-base rounded-2xl",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows spinner and disables the button while an action is in progress. */
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-busy={loading || undefined}
          disabled={isDisabled}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative"
        )}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="text-current" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
