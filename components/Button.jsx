import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  children,
  onClick,
  to,
  type = "button",
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 transform";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-primary text-white hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 active:scale-95",
    secondary:
      "bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-200 dark:border-dark-700 hover:bg-dark-100 dark:hover:bg-dark-700 hover:shadow-lg focus:ring-2 focus:ring-dark-200 dark:focus:ring-dark-700 focus:ring-offset-2 active:scale-95",
    outline:
      "bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 dark:hover:bg-dark-800 focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 active:scale-95",
    ghost:
      "bg-transparent text-dark-800 dark:text-dark-100 hover:bg-dark-100 dark:hover:bg-dark-800 focus:ring-2 focus:ring-dark-200 dark:focus:ring-dark-700 focus:ring-offset-2 active:scale-95",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon
          className="mr-2\"
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon
          className="ml-2"
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link href={to} className={buttonClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
