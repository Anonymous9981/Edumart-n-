import { MarketingPageShell } from '../../components/marketing-page-shell'
import { MarketplaceEcosystem } from '../../components/marketplace-ecosystem'

export const dynamic = 'force-dynamic'

export default function ServicesPage() {
  return (
    <MarketingPageShell
      eyebrow="Services Hub"
      title="A marketplace front end for learning, wellness, doctors, and schools"
      subtitle="Use this as the visual landing zone for the new verticals. The design keeps commerce at the center while making every new service lane easy to discover and act on."
      accent="teal"
      primaryCta={{ label: 'Browse Products', href: '/shop' }}
      secondaryCta={{ label: 'Open School Flow', href: '/schools' }}
    >
      <MarketplaceEcosystem />
    </MarketingPageShell>
  )
}