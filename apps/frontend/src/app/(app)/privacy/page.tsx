import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@gitroom/frontend/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | Postlane',
  description: 'How Postlane handles account, social connection, content, and technical data.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Postlane at postlane.fyi is operated by Socia Growth Metrics ("we," "us," or "our").
        This policy explains how this hosted service handles information when you use it to
        manage and schedule social media content.
      </p>
      <LegalSection title="Information we handle">
        <ul className="list-disc space-y-2 pl-6">
          <li>Account details such as your email address, name, sign-in provider, and password hash when you use password sign-in.</li>
          <li>Workspace and team details, settings, timezone, and account activity needed to operate the service.</li>
          <li>Social account identifiers, profile details returned by a platform, and authorization tokens needed to connect accounts and publish content.</li>
          <li>Posts, drafts, schedules, media, and other material you create or upload.</li>
          <li>Technical and security information such as IP address, browser user-agent, timestamps, and error records.</li>
        </ul>
      </LegalSection>
      <LegalSection title="How we use it">
        <p>
          We use this information to authenticate users, operate workspaces, store drafts and
          media, schedule and publish content at your direction, maintain service security,
          troubleshoot errors, and make backups for disaster recovery. We do not use your
          connected accounts to publish content you have not authorized through the service.
        </p>
      </LegalSection>
      <LegalSection title="Social networks and service providers">
        <p>
          When you connect a social account, the relevant platform receives requests needed to
          authorize the connection and perform the actions you request. Its own terms and
          privacy policy govern its handling of your information. This service is hosted on
          infrastructure operated through Hetzner and Cloudflare; those providers process
          network and hosting data to deliver and protect the service. We do not sell personal
          information.
        </p>
      </LegalSection>
      <LegalSection title="Storage and retention">
        <p>
          Account, workspace, social connection, and content data are stored in the service's
          database and media storage. Social authorization tokens are stored so scheduled
          publishing can work. We retain account data while the account is active. The current
          account-deletion flow removes access and memberships, marks owned workspaces and
          posts as deleted, and pseudonymizes the account and social-connection fields. Those
          marked records remain in the operational database; there is currently no fixed
          physical-erasure deadline for them. Encrypted disaster-recovery backups are made
          daily and retained for up to 14 days before automatic expiry.
        </p>
      </LegalSection>
      <LegalSection title="Your choices and requests">
        <p>
          You can disconnect a social account in Postlane or revoke Postlane access from that
          platform. You can request account deletion from the account settings while signed in.
          See <a className="text-blue-300 underline" href="/data-deletion">Data deletion</a> for
          the steps and backup timing. For privacy questions or requests, email{' '}
          <a className="text-blue-300 underline" href="mailto:support@postlane.fyi">support@postlane.fyi</a>.
        </p>
      </LegalSection>
      <LegalSection title="Cookies and security">
        <p>
          The service uses cookies needed for sign-in, session security, and language
          preferences. We use reasonable administrative and technical safeguards, but no
          internet transmission or storage system can be guaranteed completely secure.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update this policy as the service changes. The date at the top identifies the
          latest revision. Material changes will be announced through the service where
          appropriate.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
