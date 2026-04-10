import { MorePage } from '../../components/more-page';

export default function MoreContactScreen() {
  return (
    <MorePage
      eyebrow="Contact"
      title="Talk to the EduMart team"
      subtitle="Use this flow for orders, quotations, support and partnerships."
      overviewTitle="Support desk"
      overview="The contact page routes school procurement, bulk orders and support requests to the right team."
      bullets={['General support for product questions', 'Bulk order and quotation requests', 'Fast reply during business hours']}
      primaryAction={{ label: 'View FAQ', route: '/more/faq' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
