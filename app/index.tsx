import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text, TouchableOpacity } from 'react-native'

import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import { api } from '../src/lib/api'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

export default function App() {
  const router = useRouter()

  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint:
      'https://github.com/settings/connections/applications/ac85d2ab3edb58b0753e',
  }

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'ac85d2ab3edb58b0753e',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center  px-8 py-10">
      <StatusBar style="auto" translucent />

      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="items-center justify-center rounded-full bg-green-500 px-5 py-3"
            onPress={() => signInWithGithub()}
          >
            <Text className="font-alt text-sm uppercase text-black">
              Cadastrar lembrança
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
