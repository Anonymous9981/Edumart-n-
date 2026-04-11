import { useLocalSearchParams } from 'expo-router';

import { WebRouteScreen } from '../../components/web-route-screen';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const normalized = Array.isArray(id) ? id[0] : id;
  const productSlug = normalized?.trim() || '';

  return <WebRouteScreen title="Product" path={productSlug ? `/product/${productSlug}` : '/shop'} />;
}
