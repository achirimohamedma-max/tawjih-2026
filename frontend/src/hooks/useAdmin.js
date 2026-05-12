import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/admin.api.js';

export function useAdminQuestions(params) {
  return useQuery({
    queryKey: ['admin', 'questions', params],
    queryFn: () => api.adminListQuestions(params),
  });
}

export function useAdminMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'questions'] });
  return {
    create: useMutation({ mutationFn: api.adminCreateQuestion, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, body }) => api.adminUpdateQuestion(id, body),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: api.adminDeleteQuestion, onSuccess: invalidate }),
    translate: useMutation({
      mutationFn: ({ id, body }) => api.adminTranslate(id, body),
      onSuccess: invalidate,
    }),
  };
}

export function useAdminStats() {
  return {
    overview: useQuery({ queryKey: ['admin', 'stats', 'overview'], queryFn: () => api.adminStats.overview() }),
    questions: useQuery({ queryKey: ['admin', 'stats', 'questions'], queryFn: () => api.adminStats.questions() }),
    axes: useQuery({ queryKey: ['admin', 'stats', 'axes'], queryFn: () => api.adminStats.axes() }),
    activity: useQuery({ queryKey: ['admin', 'stats', 'activity'], queryFn: () => api.adminStats.activity() }),
  };
}
