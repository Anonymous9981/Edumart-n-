import { MorePage } from '../../components/more-page';

export default function MoreUnauthorizedScreen() {
  return (
    <MorePage
      eyebrow="403"
      title="Access denied"
      subtitle="Your account does not have permission to view this area."
      overviewTitle="Permission check"
      overview="The web app uses this route when a signed-in user lacks the right access level."
      bullets={['Used for restricted areas', 'Points users back to login', 'Keeps permission handling explicit']}
      primaryAction={{ label: 'Go to Login', route: '/more/login' }}
      secondaryAction={{ label: 'Open Account', route: '/account' }}
    />
  );
}
