import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '../api/attempts.api.js';

export function useStartAttempt() {
  return useMutation({ mutationFn: (body) => api.startAttempt(body) });
}
export function useSubmitAttempt() {
  return useMutation({ mutationFn: ({ id, body }) => api.submitAttempt(id, body) });
}
export function useAttempt(id, sessionId) {
  return useQuery({
    queryKey: ['attempt', id],
    queryFn: () => api.getAttempt(id, sessionId),
    enabled: !!id && !!sessionId,
  });
}
export function useAttemptHistory(sessionId) {
  return useQuery({
    queryKey: ['attempts', 'history', sessionId],
    queryFn: () => api.listAttempts(sessionId),
    enabled: !!sessionId,
  });
}
