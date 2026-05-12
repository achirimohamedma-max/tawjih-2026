import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { SummaryPage } from './pages/SummaryPage.jsx';
import { QcmExamPage } from './pages/QcmExamPage.jsx';
import { PsyExamPage } from './pages/PsyExamPage.jsx';
import { CorrectionPage } from './pages/CorrectionPage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { AdminGatePage } from './pages/admin/AdminGatePage.jsx';
import { QuestionListPage } from './pages/admin/QuestionListPage.jsx';
import { QuestionEditPage } from './pages/admin/QuestionEditPage.jsx';
import { TranslationsPage } from './pages/admin/TranslationsPage.jsx';
import { StatsPage } from './pages/admin/StatsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/exam/qcm" element={<QcmExamPage />} />
        <Route path="/exam/psy" element={<PsyExamPage />} />
        <Route path="/exam/:attemptId/result" element={<CorrectionPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminGatePage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<QuestionListPage />} />
        <Route path="questions" element={<QuestionListPage />} />
        <Route path="questions/new" element={<QuestionEditPage />} />
        <Route path="questions/:id" element={<QuestionEditPage />} />
        <Route path="translations" element={<TranslationsPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
