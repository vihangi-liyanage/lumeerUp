import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Ideally, this calls a distinct /login endpoint.
        // For the capstone, we utilize the /register or a generic /auth endpoint on our Node backend.
        try {
          const response = await fetch("http://localhost:4000/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
  
          if (response.ok) {
            const data = await response.json()
            if (data.user) {
              return { id: data.user.id, email: data.user.email, accessToken: data.token }
            }
          } else {
            // Fallback for a potential login scenario or if already registered
            console.error("Auth failed on backend", await response.text())
            return null
          }
        } catch (error) {
          console.error("Auth error", error)
          return null
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).accessToken = token.accessToken
      return session
    }
  }
})
