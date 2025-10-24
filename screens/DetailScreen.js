import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const FAVORITES_KEY = "@favorites";

export default function DetailScreen({ route }) {
  const { character } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  const heartScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    checkIfFavorite();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Verificar si el personaje está en favoritos
  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.some((fav) => fav.id === character.id));
      }
    } catch (error) {
      console.error("Error al verificar favoritos:", error);
    }
  };

  // Agregar o quitar de favoritos
  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Quitar de favoritos
        favoritesArray = favoritesArray.filter(
          (fav) => fav.id !== character.id
        );
        setIsFavorite(false);
        Alert.alert(
          "💔 Eliminado de favoritos",
          `${character.name} fue eliminado de tus favoritos`
        );
      } else {
        // Agregar a favoritos
        favoritesArray.push(character);
        setIsFavorite(true);

        Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        Alert.alert(
          "⭐ Agregado a favoritos",
          `${character.name} fue agregado a tus favoritos`
        );
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
      Alert.alert("Error", "No se pudo guardar en favoritos");
    }
  };

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

  // Genero traducción
  const translateGender = (gender) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Masculino";
      case "female":
        return "Femenino";
      case "genderless":
        return "Sin género";
      default:
        return "Desconocido";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: character.image }} style={styles.image} />

          {/* Botón de favorito flotante */}
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={toggleFavorite}
            activeOpacity={0.8}
          >
            <Animated.Text
              style={[
                styles.favoriteIcon,
                { transform: [{ scale: heartScale }] },
              ]}
            >
              {isFavorite ? "⭐" : "☆"}
            </Animated.Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{character.name}</Text>

          {/* Estado y especie */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(character.status) },
              ]}
            />
            <Text style={styles.statusText}>
              {translateStatus(character.status)} - {character.species}
            </Text>
          </View>

          {/* Sección de información principal */}
          <View style={styles.mainInfoSection}>
            <InfoCard
              icon="👤"
              label="Género"
              value={translateGender(character.gender)}
            />
            <InfoCard icon="🧬" label="Especie" value={character.species} />
          </View>

          {/* Información detallada */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}> Información Detallada</Text>

            {character.type && <InfoRow label="Tipo" value={character.type} />}

            <InfoRow label="Origen" value={character.origin.name} icon="🌍" />

            <InfoRow
              label="Ubicación actual"
              value={character.location.name}
              icon="📍"
            />

            <InfoRow
              label="Apariciones"
              value={`${character.episode.length} episodios`}
              icon="📺"
            />
          </View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            <View style={styles.statsGrid}>
              <StatCard label="ID" value={`#${character.id}`} color="#00b5cc" />
              <StatCard
                label="Episodios"
                value={character.episode.length}
                color="#f59e0b"
              />
              <StatCard
                label="Estado"
                value={translateStatus(character.status)}
                color={getStatusColor(character.status)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// Componente de tarjeta de información
function InfoCard({ icon, label, value }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardIcon}>{icon}</Text>
      <Text style={styles.infoCardLabel}>{label}</Text>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        {icon && <Text style={styles.infoRowIcon}>{icon}</Text>}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function StatCard({ label, value, color }) {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width,
    height: width * 1.1,
    backgroundColor: "#161b22",
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  favoriteButtonActive: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },
  favoriteIcon: {
    fontSize: 30,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    color: "#ccc",
    fontWeight: "600",
  },
  mainInfoSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#161b22",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  infoCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoCardLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoCardValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: "#161b22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00b5cc",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#21262d",
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoRowIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: "#aaa",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
    textAlign: "right",
    paddingLeft: 12,
  },
  statsSection: {
    backgroundColor: "#161b22",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0d1117",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  episodesButton: {
    backgroundColor: "#00b5cc",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#00b5cc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  episodesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
