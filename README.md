# Postlane

Postlane is a hosted social publishing service operated by Socia Growth Metrics at
[postlane.fyi](https://postlane.fyi). It is based on the open-source
[Postiz project](https://github.com/gitroomhq/postiz-app) and is distributed under
the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE)
and the source files for applicable copyright and license notices.

## Source for the hosted version

The source corresponding to a deployed build is linked from the product footer and
legal pages. The public repository is [lstan44/postlane](https://github.com/lstan44/postlane).
Network users of this modified version can obtain its corresponding source under
the AGPL-3.0 terms.

## Hosted service

Planned hosted plans are monthly: $19 for up to 5 social channels or $49 for up
to 25 channels, with a seven-day trial requiring a payment method. Paid signup is
not currently open. Feature availability will depend on social platform approval
and the services configured for the deployed instance. The service does not
claim availability of unconfigured AI, analytics, or publishing features.

The public service is deployed from a pinned commit using the companion
[cloud-infra Ansible configuration](https://github.com/lstan44/cloud-infra) when
available. Production secrets are stored outside this repository.

## Development

This repository is a pnpm monorepo. Install the repository's pinned dependencies
with `pnpm install`; local development and Docker instructions are in the
repository's deployment documentation. Do not commit runtime credentials,
customer data, or generated production configuration.

## Upstream attribution

This project is a modified version of Postiz. The upstream project's notices and
AGPL license are retained. Postlane is an independently operated fork and is not
the Postiz hosted service.
