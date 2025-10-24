import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import CharacterCard from "../components/CharacterCard";

export default function HomeScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Función para obtener personajes de la API
  const fetchCharacters = async (pageNumber) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${pageNumber}`
      );
      const data = await response.json();

      if (pageNumber === 1) {
        setCharacters(data.results);
      } else {
        setCharacters((prev) => [...prev, ...data.results]);
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error al cargar personajes:", error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Cargar personajes al iniciar
  useEffect(() => {
    fetchCharacters(page);
  }, []);

  // Función para cargar más personajes (paginación)
  const loadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage);
    }
  };

  // Renderizar cada personaje
  const renderItem = ({ item }) => (
    <CharacterCard
      character={item}
      onPress={() => navigation.navigate("Detail", { character: item })}
    />
  );

  // Footer para mostrar el indicador de carga al cargar más
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#00b5cc" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b5cc" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
  listContent: {
    padding: 10,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
