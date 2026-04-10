import { MorePage } from '../../components/more-page';

export default function MoreOrderSuccessScreen() {
  return (
    <MorePage
      eyebrow="Order placed"
      title="Your order has been placed successfully"
      subtitle="This screen mirrors the confirmation state from the web app."
      overviewTitle="Order confirmation"
      overview="After checkout, the app confirms the order, shows the totals and points users back to shopping."
      bullets={['Confirmation is shown immediately', 'Order details can be loaded from the API on web', 'Continue shopping or review the cart']}
      primaryAction={{ label: 'Continue Shopping', route: '/shop' }}
      secondaryAction={{ label: 'View Cart', route: '/cart' }}
    />
  );
}
