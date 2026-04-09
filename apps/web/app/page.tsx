import { HomepageClient } from '../components/homepage'
import { getHomepageData } from './homepage-loader'

export default async function Page() {
  const data = await getHomepageData()

  return <HomepageClient initialData={data} />
}
