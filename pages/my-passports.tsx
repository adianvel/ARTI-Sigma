// Redirect legacy route /my-passports -> /my-collection
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/my-collection",
      permanent: true,
    },
  }
}

export default function LegacyMyPassportsRedirect() {
  return null
}
