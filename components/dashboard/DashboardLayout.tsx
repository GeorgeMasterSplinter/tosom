"use client";

import DashboardTop from "./DashboardTop";
import DashboardMiddle from "./DashboardMiddle";
import DashboardBottom from "./DashboardBottom";

export default function DashboardLayout({
  userName,
  date,
  journeyStatus,
  reflectionText,
  onOpenReflection,
  journeyText,
  noticeText,
  noticeType,
}: {
  userName?: string;
  date?: string;
  journeyStatus?: string;
  reflectionText?: string;
  onOpenReflection?: () => void;
  journeyText?: string;
  noticeText?: string;
  noticeType?: string;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 scroll-smooth">
      <DashboardTop
        userName={userName}
        date={date}
        journeyStatus={journeyStatus}
      />
      <div className="bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] rounded-xl p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardMiddle
              reflectionText={reflectionText}
              onOpenReflection={onOpenReflection}
              journeyText={journeyText}
              journeyStatus={journeyStatus}
              noticeText={noticeText}
              noticeType={noticeType}
            />
          </div>
          <div className="lg:col-span-1">
            <DashboardBottom />
          </div>
        </div>
      </div>
    </div>
  );
}
