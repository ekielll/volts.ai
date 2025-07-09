import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedTagline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const line1 = "Create it in your mind,";
  const line2 = "behold your creation.";
  
  const midPoint1 = Math.floor(line1.length / 2);
  const midPoint2 = Math.floor(line2.length / 2);

  const animation = {
    hidden: {
      opacity: 0,
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 50,
        delay: i * 0.02,
      },
    }),
  };

  return (
    <div ref={ref} className="text-center">
      <motion.div 
        className="flex justify-center items-center text-4xl md:text-6xl font-bold leading-tight tracking-tight font-premium mb-2"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {line1.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={{
              ...animation,
              hidden: { ...animation.hidden, x: index < midPoint1 ? -50 : 50 },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        className="flex justify-center items-center text-4xl md:text-6xl font-bold leading-tight tracking-tight font-premium"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {line2.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index + line1.length}
            className={char === '.' ? '' : 'text-orange-400'}
            variants={{
              ...animation,
              hidden: { ...animation.hidden, x: index < midPoint2 ? -50 : 50 },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedTagline;