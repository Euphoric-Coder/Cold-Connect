import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({
  number,
  title,
  children,
  active = false,
  completed = false,
}) => {
  return (
    <motion.div 
      className={`card border border-dark-200 dark:border-dark-700 overflow-hidden transition-all duration-300 ${
        active ? 'ring-2 ring-primary-400 dark:ring-primary-500' : ''
      } ${
        completed ? 'border-success-400 dark:border-success-500' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: number * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex items-center mb-4">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
          completed 
            ? 'bg-success-500 text-white' 
            : active 
              ? 'bg-primary-500 text-white' 
              : 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
        }`}>
          {number}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div>
        {children}
      </div>
    </motion.div>
  );
};

export default StepCard;