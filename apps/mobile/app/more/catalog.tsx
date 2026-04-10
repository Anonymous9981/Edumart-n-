import { MorePage } from '../../components/more-page';

export default function MoreCatalogScreen() {
  return (
    <MorePage
      eyebrow="Catalog"
      title="Browse the full product catalog"
      subtitle="The mobile route lands here so the account quick links can open a real screen."
      overviewTitle="Catalog shortcut"
      overview="The web app redirects catalog traffic to the shop. The mobile version keeps the same entry point."
      bullets={['Redirects to the shop experience', 'Useful for quick navigation from account', 'Keeps the route tree aligned with web']}
      primaryAction={{ label: 'Open Shop', route: '/shop' }}
      secondaryAction={{ label: 'Back to Account', route: '/account' }}
    />
  );
}
