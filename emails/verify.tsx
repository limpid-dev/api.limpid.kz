import { Heading } from '@react-email/components'

export function Email({ token }: { token: string }) {
  return <Heading as="h1">Lorem ipsum ${token}</Heading>
}
