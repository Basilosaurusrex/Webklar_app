import Link from 'next/link';
import { colors } from '@/lib/colors';

export default function WebklarLogoHeader() {
  return (
    <div className="w-full flex justify-center pt-8 pb-4">
      <Link href="/">
        <div className="relative text-3xl sm:text-4xl font-bold cursor-pointer select-none" style={{ color: colors.primary }}>
          <span className="relative z-10">Webklar</span>
          <div className="absolute -inset-2 rounded-xl blur-sm opacity-20" style={{ backgroundColor: colors.secondary }}></div>
        </div>
      </Link>
    </div>
  );
} 