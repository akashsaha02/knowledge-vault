import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--on-brand)] shadow-[var(--shadow-card)] hover:bg-[var(--primary-hover)] active:scale-[0.98]",
        secondary:
          "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-hover)]",
        outline:
          "border border-[var(--border)] bg-transparent hover:bg-[var(--surface-hover)] text-[var(--foreground)]",
        ghost: "hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        destructive:
          "bg-[var(--danger)] text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
