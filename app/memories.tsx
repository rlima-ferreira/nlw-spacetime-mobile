import Icon from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../assets/logo.svg';
import { api } from '../lib/api';

interface IMemory {
  id: string;
  coverUrl: string;
  excerpt: string;
  createdAt: string;
}

dayjs.locale(ptBr);

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const [memories, setMemories] = useState<IMemory[]>([]);

  async function signOut() {
    await SecureStore.deleteItemAsync('token');
    router.push('/');
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token');
    const { data } = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemories(data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between mt-4">
        <Logo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="space-y-10 mt-6">
        {memories.map((memory) => (
          <View key={memory.id} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50">
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMM[, ]YYYY')}
                </Text>
              </View>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{ uri: memory.coverUrl }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link
                href={`/memories/${memory.id}`}
                className="flex-row items-center gap-2"
                asChild
              >
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
