import { create } from 'zustand';

export const useExamStore = create((set, get) => ({
  attemptId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  startedAt: null,

  init({ attemptId, questions }) {
    set({
      attemptId,
      questions,
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      startedAt: Date.now(),
    });
  },
  setAnswer(idx, value) {
    const answers = [...get().answers];
    answers[idx] = value;
    set({ answers });
  },
  next() {
    set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1) }));
  },
  prev() {
    set((s) => ({ currentIndex: Math.max(s.currentIndex - 1, 0) }));
  },
  jump(i) {
    set({ currentIndex: i });
  },
  reset() {
    set({ attemptId: null, questions: [], currentIndex: 0, answers: [], startedAt: null });
  },
}));
