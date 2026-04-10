import { MorePage } from '../../components/more-page';
import { useMockStore } from '../../lib/mock-store';

export default function MoreAboutScreen() {
  const { company, aboutPoints } = useMockStore();

  return (
    <MorePage
      eyebrow={`About ${company.name}`}
      title={company.tagline}
      subtitle={company.about}
      overviewTitle="What this page covers"
      overview={`Support: ${company.supportEmail} • ${company.supportPhone}`}
      bullets={aboutPoints.length ? aboutPoints : company.trustBadges}
      primaryAction={{ label: 'Order Products', route: '/shop' }}
      secondaryAction={{ label: 'See FAQs', route: '/more/faq' }}
    />
  );
}
