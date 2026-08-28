import { redirect } from 'next/navigation';

export default async function JobRedirect({ params }) {
  const { id } = await params;
  redirect(`/jobs/${id}`);
}
