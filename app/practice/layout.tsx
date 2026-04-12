import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI实战全流程 - OpenMAIC',
  description: '从数据工程到模型部署的完整AI学习路径',
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}