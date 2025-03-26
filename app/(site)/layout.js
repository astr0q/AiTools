import Header from "@/app/_components/Header"

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
} 