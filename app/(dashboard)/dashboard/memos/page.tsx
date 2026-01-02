import { redirect } from 'next/navigation';

export default function MemosPage() {
  // Redirect to inbox by default
  redirect('/dashboard/memos/inbox');
}
