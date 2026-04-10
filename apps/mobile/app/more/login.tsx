import { MorePage } from '../../components/more-page';

export default function MoreLoginScreen() {
  return (
    <MorePage
      eyebrow="Login"
      title="Sign in to continue"
      subtitle="The web flow handles secure login and role-based redirects."
      overviewTitle="Sign in flow"
      overview="Login supports customer and vendor access and routes people to the correct dashboard."
      bullets={['Secure credential-based login', 'Role-aware post-sign-in routing', 'Google sign-in is wired on web']}
      primaryAction={{ label: 'Go to Account', route: '/account' }}
      secondaryAction={{ label: 'Create Account', route: '/more/signup' }}
    />
  );
}
