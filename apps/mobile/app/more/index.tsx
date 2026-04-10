import { MorePage } from '../../components/more-page';

export default function MoreIndexScreen() {
  return (
    <MorePage
      eyebrow="More"
      title="Web flows mirrored for mobile"
      subtitle="These screens surface the same school, support and account journeys that exist on the web app."
      overviewTitle="What lives here"
      overview="Use this section to jump into the non-tab flows from the account screen."
      bullets={['About the marketplace', 'Support and FAQ', 'School selection flow', 'Login, signup and recovery', 'Order confirmation and permissions']}
      primaryAction={{ label: 'Open Account', route: '/account' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
