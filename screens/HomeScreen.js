import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import CharacterCard from "../components/CharacterCard";

export default function HomeScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hasMoreData, setHasMoreData] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const bounceAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchCharacters = async (pageNumber) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${pageNumber}`
      );
      const data = await response.json();

      if (pageNumber === 1) {
        setCharacters(data.results);
        setFilteredCharacters(data.results);
      } else {
        setCharacters((prev) => {
          const existingIds = new Set(prev.map((char) => char.id));

          const newCharacters = data.results.filter(
            (char) => !existingIds.has(char.id)
          );

          return [...prev, ...newCharacters];
        });

        setFilteredCharacters((prev) => {
          const existingIds = new Set(prev.map((char) => char.id));
          const newCharacters = data.results.filter(
            (char) => !existingIds.has(char.id)
          );
          return [...prev, ...newCharacters];
        });
      }

      setHasMoreData(data.info.next !== null);

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error al cargar personajes:", error);
      setLoading(false);
      setLoadingMore(false);
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let filtered = characters;

    if (searchQuery) {
      filtered = filtered.filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (character) => character.status.toLowerCase() === selectedFilter
      );
    }

    setFilteredCharacters(filtered);
  }, [searchQuery, selectedFilter, characters]);

  const loadMore = useCallback(() => {
    if (
      !loadingMore &&
      searchQuery === "" &&
      selectedFilter === "all" &&
      hasMoreData
    ) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage);
    }
  }, [loadingMore, searchQuery, selectedFilter, page, hasMoreData]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <CharacterCard
        character={item}
        index={index}
        onPress={() => navigation.navigate("Detail", { character: item })}
      />
    ),
    [navigation]
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="#00b5cc" />
          <Text style={styles.loadingMoreText}>Cargando más personajes...</Text>
        </View>
      );
    }

    if (hasMoreData && searchQuery === "" && selectedFilter === "all") {
      return (
        <Animated.View
          style={[
            styles.swipeIndicator,
            { transform: [{ translateY: bounceAnim }] },
          ]}
        >
          <Text style={styles.swipeArrow}>⬇️</Text>
          <Text style={styles.swipeText}>Desliza hacia abajo</Text>
          <Text style={styles.swipeSubtext}>para cargar más personajes</Text>
        </Animated.View>
      );
    }

    if (!hasMoreData && searchQuery === "" && selectedFilter === "all") {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endEmoji}>🎉</Text>
          <Text style={styles.endText}>¡Has visto todos los personajes!</Text>
          <Text style={styles.endSubtext}>
            {characters.length} personajes en total
          </Text>
        </View>
      );
    }

    return null;
  }, [
    loadingMore,
    hasMoreData,
    searchQuery,
    selectedFilter,
    characters.length,
    bounceAnim,
  ]);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>😕</Text>
        <Text style={styles.emptyTitle}>No se encontraron personajes</Text>
        <Text style={styles.emptySubtitle}>
          Intenta con otra búsqueda o filtro
        </Text>
      </View>
    ),
    []
  );

  // KeyExtractor estable
  const keyExtractor = useCallback((item) => `character-${item.id}`, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b5cc" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
        <Text style={styles.loadingSubtext}>
          Conectando con la dimensión C-137... 🛸
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar personaje..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros por estado */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por:</Text>
          <View style={styles.filterButtons}>
            <FilterButton
              label="Todos"
              isSelected={selectedFilter === "all"}
              onPress={() => setSelectedFilter("all")}
              color="#00b5cc"
            />
            <FilterButton
              label="Vivos"
              isSelected={selectedFilter === "alive"}
              onPress={() => setSelectedFilter("alive")}
              color="#55cc44"
            />
            <FilterButton
              label="Muertos"
              isSelected={selectedFilter === "dead"}
              onPress={() => setSelectedFilter("dead")}
              color="#d63d2e"
            />
            <FilterButton
              label="Desconocido"
              isSelected={selectedFilter === "unknown"}
              onPress={() => setSelectedFilter("unknown")}
              color="#9e9e9e"
            />
          </View>
        </View>

        {/* Botón de favoritos */}
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.favoritesButtonText}> Ver mis favoritos</Text>
        </TouchableOpacity>

        <Text style={styles.resultsCount}>
          {filteredCharacters.length} personaje
          {filteredCharacters.length !== 1 ? "s" : ""} encontrado
          {filteredCharacters.length !== 1 ? "s" : ""}
        </Text>
      </Animated.View>

      <FlatList
        data={filteredCharacters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

// Componente de botón de filtro
function FilterButton({ label, isSelected, onPress, color }) {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected && { backgroundColor: color, borderColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          isSelected && styles.filterButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
    marginTop: 15,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 8,
    color: "#888",
    fontSize: 14,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#161b22",
    borderBottomWidth: 1,
    borderBottomColor: "#30363d",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d1117",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#30363d",
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 20,
    color: "#888",
    paddingHorizontal: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#30363d",
    backgroundColor: "#0d1117",
  },
  filterButtonText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  filterButtonTextSelected: {
    color: "#fff",
  },
  favoritesButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  favoritesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsCount: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    fontStyle: "italic",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
  },
  swipeIndicator: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  swipeArrow: {
    fontSize: 40,
    marginBottom: 8,
  },
  swipeText: {
    color: "#00b5cc",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  swipeSubtext: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  endMessage: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  endEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  endText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  endSubtext: {
    color: "#888",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#888",
    fontSize: 14,
  },
});
