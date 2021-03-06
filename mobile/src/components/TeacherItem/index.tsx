import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';

import styles from './styles';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png'
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';


export interface Teacher {
  id: number;
  name: string;
  avatar: string;
  subject: string;
  bio: string;
  cost: number;
  whatsapp: string;
}

interface TeacherItemProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FunctionComponent<TeacherItemProps> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited)

  function handleLinkToWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`)
  }

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');
    let favoritesArray: number[] = [];
    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacherItem.id === teacher.id;
      });
      favoritesArray.splice(favoriteIndex, 1);
      setIsFavorited(false);
    } else {
      favoritesArray.push(teacher.id);
      setIsFavorited(true);
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container} >
      <View style={styles.profile}>
        <Image
          style={styles.avatar}
          source={{ uri: teacher.avatar }}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}> {teacher.bio}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Pre&ccedil;o/hora {'   '}
          <Text style={styles.priceValue}>
            R$ {teacher.cost}
          </Text>
        </Text>

        <View style={styles.buttonsContainner}>
          <RectButton
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton,
              isFavorited ? styles.favorited : {}]}>
            {isFavorited
              ? <Image source={heartOutlineIcon} />
              : <Image source={unfavoriteIcon} />
            }
          </RectButton>
          <RectButton
            onPress={handleLinkToWhatsapp}
            style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>

    </View>
  )
}

export default TeacherItem;
