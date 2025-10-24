import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CharacterCard from "../components/CharacterCard";

const FAVORITES_KEY = "@favorites";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadFavorites();
    // Recargar favoritos cuando la pantalla recibe foco
    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesData) {
        const favoritesArray = JSON.parse(favoritesData);
        setFavorites(favoritesArray);
      }
      setLoading(false);
      // Animación de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setLoading(false);
    }
  };

  const clearAllFavorites = () => {
    Alert.alert(
      "⚠️ Confirmar",
      "¿Estás seguro de que quieres eliminar TODOS tus favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar todos",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
              setFavorites([]);
              Alert.alert("✅ Listo", "Todos los favoritos fueron eliminados");
            } catch (error) {
              console.error("Error al eliminar favoritos:", error);
              Alert.alert("Error", "No se pudieron eliminar los favoritos");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <CharacterCard
      character={item}
      index={index}
      onPress={() => navigation.navigate("Detail", { character: item })}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        {favorites.length > 0
          ? `Tienes ${favorites.length} personaje${
              favorites.length !== 1 ? "s" : ""
            } favorito${favorites.length !== 1 ? "s" : ""}`
          : "Aún no tienes favoritos"}
      </Text>
      {favorites.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllFavorites}
        >
          <Text style={styles.clearButtonText}>Eliminar todos</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <Text style={styles.emptyEmoji}>⭐</Text>
      <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
      <Text style={styles.emptySubtitle}>
        Explora personajes y agrega tus favoritos tocando la estrella ⭐
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.exploreButtonText}> Explorar personajes</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d1117",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#161b22",
    borderBottomWidth: 1,
    borderBottomColor: "#30363d",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: "#d63d2e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: "#00b5cc",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#00b5cc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
