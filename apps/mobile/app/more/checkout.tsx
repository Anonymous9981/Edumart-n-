import { MorePage } from '../../components/more-page';

export default function MoreCheckoutScreen() {
  return (
    <MorePage
      eyebrow="Checkout"
      title="Delivery address and payment"
      subtitle="Confirm your details before placing the order."
      overviewTitle="Checkout flow"
      overview="The web checkout collects address details and confirms cash-on-delivery payment."
      bullets={['Delivery details come first', 'Cash on delivery is the default payment path', 'Order summary and totals are shown before submit']}
      primaryAction={{ label: 'View Cart', route: '/cart' }}
      secondaryAction={{ label: 'Browse Shop', route: '/shop' }}
    />
  );
}
