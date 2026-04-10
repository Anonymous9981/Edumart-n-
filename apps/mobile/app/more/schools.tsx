import { MorePage } from '../../components/more-page';

export default function MoreSchoolsScreen() {
  return (
    <MorePage
      eyebrow="Schools"
      title="Select a school before browsing products"
      subtitle="This flow keeps the catalog aligned to the institution and class."
      overviewTitle="School-first shopping"
      overview="The web flow starts with school and class selection so the product list matches the buyer's needs."
      bullets={['Choose school first, then class', 'Show only matching products and kits', 'Useful for bulk orders and procurement']}
      primaryAction={{ label: 'Open School Flow', route: '/more/school-flow' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
