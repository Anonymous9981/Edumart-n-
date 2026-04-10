import { MorePage } from '../../components/more-page';

export default function MoreForgotPasswordScreen() {
  return (
    <MorePage
      eyebrow="Forgot password"
      title="Reset your password"
      subtitle="The recovery flow is ready on the API and can be connected to email next."
      overviewTitle="Password recovery"
      overview="Web routing already exposes the forgot-password entry point for future email integration."
      bullets={['API endpoint is ready', 'Use it after email provider wiring', 'Return to login once recovery starts']}
      primaryAction={{ label: 'Go to Login', route: '/more/login' }}
      secondaryAction={{ label: 'Open Account', route: '/account' }}
    />
  );
}
