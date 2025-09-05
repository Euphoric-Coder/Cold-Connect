import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) => {
  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-dark-600 dark:text-dark-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;