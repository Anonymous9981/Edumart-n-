import { MorePage } from '../../components/more-page';

export default function MoreFaqScreen() {
  return (
    <MorePage
      eyebrow="FAQ"
      title="Answers to common EduMart questions"
      subtitle="Short answers for parents, students, school admins and vendors."
      overviewTitle="Need-to-know"
      overview="The FAQ page covers orders, school flows, pricing, membership and support."
      bullets={['Automatic discounts before checkout', 'School-first product discovery flow', 'Membership and referral details', 'Contact support when you need help']}
      primaryAction={{ label: 'Contact Support', route: '/more/contact' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
