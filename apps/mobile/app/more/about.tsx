import { MorePage } from '../../components/more-page';

export default function MoreAboutScreen() {
  return (
    <MorePage
      eyebrow="About EduMart"
      title="A trusted marketplace built for students, schools and vendors"
      subtitle="School-focused curation, verified supply and fast delivery in one place."
      overviewTitle="What this page covers"
      overview="EduMart helps families and institutions source books, classroom tools and school infrastructure from verified vendors."
      bullets={['Verified vendor onboarding', 'School and class-based catalog matching', 'Automatic discount application', 'Fast dispatch and order tracking']}
      primaryAction={{ label: 'Order Products', route: '/shop' }}
      secondaryAction={{ label: 'See FAQs', route: '/more/faq' }}
    />
  );
}
