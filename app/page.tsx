import { RedirectPage } from "@/components/redirect-page"

export default function Home() {
  // Use a client component to handle the redirect
  return <RedirectPage to="/dashboard/create-campaign" />
}
