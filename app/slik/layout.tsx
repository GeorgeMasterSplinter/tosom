/**
 * Redirect /slik → /slik-fungerer-det (301 permanent)
 */

import { redirect } from 'next/navigation';

export default function SlikRedirect() {
  redirect('/slik-fungerer-det');
}