import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@gitroom/frontend/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service | Postlane',
  description: 'Terms for using Postlane at postlane.fyi.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms cover Postlane at postlane.fyi (the "service"), operated by Socia Growth
        Metrics. By creating an account or using the service, you agree to these terms. If you
        do not agree, do not use the service.
      </p>
      <LegalSection title="Your account">
        <p>
          You must provide accurate account information, protect your sign-in credentials, and
          use the service only through an account you are authorized to control. You are
          responsible for activity in your account and for managing access granted to members
          of your workspaces.
        </p>
      </LegalSection>
      <LegalSection title="Social accounts and publishing">
        <p>
          You authorize Postlane to access each social account you connect and to make the
          platform requests needed for features you use, including publishing content you
          schedule or submit. You confirm that you have the rights and permissions required
          for your accounts, content, and instructions. You are responsible for reviewing
          posts, schedules, audiences, and each platform's rules before publication.
        </p>
        <p className="mt-3">
          Social networks control their own APIs, review processes, availability, and content
          policies. We cannot guarantee that a platform will accept, publish, retain, or display
          a post, or that a connection will remain available. A scheduled time is an instruction
          to attempt publication, not a guarantee of delivery.
        </p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <p>
          Do not use the service to break the law, violate another person's rights, send spam,
          bypass platform limits, interfere with the service, or access another user's account
          or data without permission. Do not upload malicious code or misuse connected social
          accounts.
        </p>
      </LegalSection>
      <LegalSection title="Your content">
        <p>
          You keep your rights in content you submit. You give us permission to host, process,
          transmit, and schedule that content only as needed to provide the service and the
          features you request. You are responsible for having permission to use all content
          and media you provide.
        </p>
      </LegalSection>
      <LegalSection title="Availability, suspension, and deletion">
        <p>
          We may limit or suspend access when needed to protect users, comply with law, address
          misuse, or protect the service. You can stop using the service and delete your account
          through account settings. The current deletion flow marks owned workspaces and posts
          deleted and pseudonymizes account and social-connection fields; marked database
          records do not currently have a fixed physical-erasure deadline. Posts already
          published to external platforms are controlled by those platforms. See our{' '}
          <a className="text-blue-300 underline" href="/data-deletion">Data deletion instructions</a>{' '}
          for details.
        </p>
      </LegalSection>
      <LegalSection title="Paid plans and trials">
        <p>
          Paid plans, prices, channel limits, and trial terms are shown at checkout. Unless
          stated otherwise, subscriptions renew monthly and may be canceled from account
          settings before the next renewal. A trial that requires a payment method converts to
          a paid subscription at the end of the trial unless canceled. Applicable taxes may
          be added by the payment processor. Refund rights required by law remain unaffected.
        </p>
      </LegalSection>
      <LegalSection title="Service changes and liability">
        <p>
          The service and its features may change. To the extent permitted by applicable law,
          the service is provided without a promise of uninterrupted availability or successful
          publication to an external platform. Nothing in these terms limits rights or remedies
          that cannot legally be limited.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>Questions about these terms can be sent to <a className="text-blue-300 underline" href="mailto:support@postlane.fyi">support@postlane.fyi</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}
