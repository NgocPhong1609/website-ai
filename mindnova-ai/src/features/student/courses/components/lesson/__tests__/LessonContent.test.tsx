import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LessonContent } from '../LessonContent';

describe('LessonContent Edge Cases', () => {
 it('renders the lesson placeholder correctly', () => {
 render(<LessonContent />);
 
 // Check if main title exists
 expect(screen.getByText('Route Handlers in Next.js')).toBeInTheDocument();
 
 // Check if code block exists
 expect(screen.getByText('app/api/route.ts')).toBeInTheDocument();
 });
});
