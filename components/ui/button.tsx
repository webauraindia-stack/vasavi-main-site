import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
