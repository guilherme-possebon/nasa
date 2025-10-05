'use client';

import { useInView } from '@/hooks/useInView';
import { ReactNode, useEffect } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
    id: number; // A unique identifier for this section
    onVisibilityChange: (id: number) => void; // Callback function
};

export default function AnimatedSection({ children, className, id, onVisibilityChange }: Props) {
    const [ref, isInView] = useInView({
        threshold: 0.5, // Trigger when 50% of the section is visible
    });

    // When this section comes into view, call the parent's function with its ID
    useEffect(() => {
        if (isInView) {
            onVisibilityChange(id);
        }
    }, [isInView, id, onVisibilityChange]);

    const animationClasses = isInView ? 'opacity-100' : 'opacity-25';

    return (
        <section
            ref={ref}
            className={`transition-opacity duration-500 ease-in-out ${animationClasses} ${className}`}
        >
            {children}
        </section>
    );
}
