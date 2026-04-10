import { MorePage } from '../../components/more-page';

export default function MoreSchoolFlowScreen() {
  return (
    <MorePage
      eyebrow="School flow"
      title="Select school, then class, then see matched products"
      subtitle="A school-first buying path for class-wise discovery and bulk planning."
      overviewTitle="Flow summary"
      overview="Pick a school, choose a class and then continue into a catalog that matches the selection."
      bullets={['School selection comes first', 'Class selection unlocks the catalog', 'Use this flow for structured orders']}
      primaryAction={{ label: 'Open Schools', route: '/more/schools' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
