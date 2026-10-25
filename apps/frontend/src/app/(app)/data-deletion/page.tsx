import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@gitroom/frontend/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Data Deletion | Postlane',
  description: 'How to delete your Postlane account and request removal of associated information.',
};

export default function DataDeletionPage() {
  return (
    <LegalPage title="Data Deletion Instructions">
      <p>
        You can request deletion of your Postlane account and associated service data at any time.
        Postlane is operated by Socia Growth Metrics at postlane.fyi.
      </p>
      <LegalSection title="Delete your account">
        <ol className="list-decimal space-y-2 pl-6">
          <li>Sign in to the Postlane account you want to delete.</li>
          <li>Open account settings and choose <strong>Delete Account</strong>.</li>
          <li>Review the impact and confirm the deletion request.</li>
        </ol>
        <p className="mt-3">
          The account deletion flow removes your access and team memberships. It marks
          organizations and posts that you own as deleted and pseudonymizes identifying
          account and social-connection fields. If you are a member of an organization owned
          by someone else, deletion removes your membership; it does not delete that
          organization. Marked organization and post records remain in the operational
          database, and the current service has no fixed physical-erasure deadline for them.
          Encrypted disaster-recovery copies have a separate retention period described below.
        </p>
      </LegalSection>
      <LegalSection title="Backups and external platforms">
        <p>
          Encrypted disaster-recovery backups are created daily and expire automatically within
          14 days. Data already published to a social network remains under that platform's
          control; delete it separately on that platform if you want it removed there. You can
          also revoke Postlane's authorization in the platform's security or connected-app
          settings. Deleting a Postlane account does not delete your social-network account.
        </p>
      </LegalSection>
      <LegalSection title="If you cannot sign in">
        <p>
          If you cannot access your account or need help with a deletion request, email{' '}
          <a className="text-blue-300 underline" href="mailto:support@postlane.fyi">support@postlane.fyi</a>.
          Include the account email and identify the social service involved. Do not send
          passwords or access tokens.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
