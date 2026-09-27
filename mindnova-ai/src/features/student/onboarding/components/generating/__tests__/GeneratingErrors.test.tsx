import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import GeneratingContainer from '../GeneratingContainer';
const { push, setGeneratedPlan, formData } = vi.hoisted(() => ({ push: vi.fn(), setGeneratedPlan: vi.fn(), formData: { goal: 'AI', currentLevel: 'beginner', timeAvailable: '30' } }));
vi.mock('next/navigation', () => { const router = { push, back: vi.fn() }; return { useRouter: () => router }; });
vi.mock('@/src/features/student/onboarding/stores/onboardingStore', () => ({ useOnboardingStore: () => ({ formData, setGeneratedPlan }) }));
vi.mock('../OrbitAnimation', () => ({ OrbitAnimation: () => null }));
vi.mock('../StepItem', () => ({ StepItem: () => null }));
vi.mock('../FloatingIcons', () => ({ LeftFloatingIcons: () => null, RightFloatingIcons: () => null }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); push.mockClear(); setGeneratedPlan.mockClear(); });
it('shows a recoverable error rather than redirecting away when generation fails', async () => {
  vi.useFakeTimers();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const fetcher = vi.fn()
    .mockResolvedValueOnce(new Response('<html>Bad Gateway</html>', { status: 502 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ phases: [] })));
  vi.stubGlobal('fetch', fetcher);
  render(<GeneratingContainer />);
  await act(async () => { await vi.advanceTimersByTimeAsync(3500); });
  expect(screen.getByRole('alert').textContent).toMatch(/Hệ thống tạm thời/);
  expect(push).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(3500); });
  expect(setGeneratedPlan).toHaveBeenCalledWith({ phases: [] });
  expect(push).toHaveBeenCalledWith('/onboarding/plan');
});
