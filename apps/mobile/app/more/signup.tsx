import { MorePage } from '../../components/more-page';

export default function MoreSignupScreen() {
  return (
    <MorePage
      eyebrow="Signup"
      title="Create your EduMart account"
      subtitle="Customer and vendor signups use the same secure flow."
      overviewTitle="Create account"
      overview="The signup flow captures profile details, role selection and optional vendor store information."
      bullets={['Customer and vendor paths share one form', 'Role selection changes the required fields', 'Google sign-up is available on web']}
      primaryAction={{ label: 'Go to Login', route: '/more/login' }}
      secondaryAction={{ label: 'Go to Account', route: '/account' }}
    />
  );
}
