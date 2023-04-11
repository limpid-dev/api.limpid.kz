import { Body, Container, Heading, Html, Link, Preview, Text } from '@react-email/components'

interface Props {
  token: string
}

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

export default function Recovery({ token = '$TEST' }: Props) {
  return (
    <Html>
      <Preview>Limpid.kz</Preview>
      <Body
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <Container
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <Heading
            style={{
              color: '#111C18',
              fontSize: '32px',
              lineHeight: '40px',
              fontWeight: '700',
              fontFamily,
            }}
          >
            Восстановление пароля
          </Heading>
          <Text
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              fontFamily,
              color: '#111C18',
            }}
          >
            Скопируйте и вставьте этот код верификации:
          </Text>
          <code
            style={{
              display: 'inline-block',
              padding: '16px',
              width: '100%',
              backgroundColor: '#F1F4F3',
              borderRadius: '8px',
              borderColor: '#DFE4E2',
              borderStyle: 'solid',
              borderWidth: '1px',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '500',
              fontFamily: 'monospace',
              color: '#6A716E',
            }}
          >
            {token}
          </code>
          <Text
            style={{
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: '500',
              fontFamily,
              color: '#6A716E',
            }}
          >
            Если вы не отправляли запрос на восстановление пароля, то можете спокойно
            проигнорировать это письмо.
          </Text>
          <Link
            href="https://limpid.kz"
            style={{
              textDecoration: 'underline',
              fontSize: '14px',
              lineHeight: '20px',
              fontFamily,
              color: '#111C18',
            }}
          >
            Limpid.kz
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
