import { MorePage } from '../../components/more-page';

export default function MoreLogoutScreen() {
  return (
    <MorePage
      eyebrow="Logout"
      title="Signing you out"
      subtitle="This screen mirrors the sign-out state from the web app."
      overviewTitle="Sign-out flow"
      overview="The web experience posts to the logout endpoint and returns the user to login."
      bullets={['Session cleanup happens on the web flow', 'Return to login after logout', 'Used for account and support navigation']}
      primaryAction={{ label: 'Go to Login', route: '/more/login' }}
      secondaryAction={{ label: 'Open Account', route: '/account' }}
    />
  );
}
