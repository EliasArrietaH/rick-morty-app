import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function CharacterCard({ character, onPress, index }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animación de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Color según estado
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "#55cc44";
      case "dead":
        return "#d63d2e";
      default:
        return "#9e9e9e";
    }
  };

  // Traducción
  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "Vivo";
      case "dead":
        return "Muerto";
      default:
        return "Desconocido";
    }
  };

  // Emojis
  const getSpeciesEmoji = (species) => {
    switch (species.toLowerCase()) {
      case "human":
        return "👤";
      case "alien":
        return "👽";
      case "robot":
        return "🤖";
      case "humanoid":
        return "🧑";
      case "poopybutthole":
        return "⭐";
      case "mythological creature":
        return "🐉";
      case "animal":
        return "🐾";
      default:
        return "❓";
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Badge de ID */}
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{character.id}</Text>
        </View>

        {/* Imagen */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: character.image }} style={styles.image} />

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(character.status) },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {translateStatus(character.status)}
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {character.name}
          </Text>

          {/* Especie */}
          <View style={styles.speciesContainer}>
            <Text style={styles.speciesEmoji}>
              {getSpeciesEmoji(character.species)}
            </Text>
            <Text style={styles.species}>{character.species}</Text>
          </View>

          {/* Ubicación */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location} numberOfLines={1}>
              {character.location.name}
            </Text>
          </View>

          {/* Episodios */}
          <View style={styles.episodesContainer}>
            <Text style={styles.episodesText}>
              📺 {character.episode.length} episodio
              {character.episode.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Indicador de ver más */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#30363d",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  idBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#00b5cc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: "#00b5cc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  idText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 130,
    height: 150,
    backgroundColor: "#0d1117",
  },
  statusBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  name: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  speciesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  speciesEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  species: {
    fontSize: 14,
    color: "#00b5cc",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 13,
    color: "#aaa",
    flex: 1,
  },
  episodesContainer: {
    marginTop: 4,
  },
  episodesText: {
    fontSize: 12,
    color: "#f59e0b",
    fontWeight: "600",
  },
  arrowContainer: {
    justifyContent: "center",
    paddingRight: 16,
  },
  arrow: {
    fontSize: 32,
    color: "#00b5cc",
    fontWeight: "bold",
  },
});
